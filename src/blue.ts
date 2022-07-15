/* an even less expressive constraint system. close to a non-incremental deltablue solver */
/* this algorithm implements linear + max/min equality constraints with hierarchies. The problems
must be solvable by local propagation, so we can sort of model this with datalog.
Things like [x + y = 5, 2x + 7y = 9] are not solvable (at least in isolation) by local propagation alone.
*/
/* this implementation is designed to be _correct_, not necessarily performant or with good error messages */

// We use this small datalog interpreter as inspiration:
// https://github.com/d4hines/datalog-ts/blob/c07d54e2cb33a7f3e0d37045be33d22e862feb69/src/datalog.ts
import * as _ from 'lodash';

type Strength = number;

export const required: Strength = Infinity;
export const strong: Strength = 9;
export const medium: Strength = 8;
export const weak: Strength = 7;
export const weaker: Strength = 6; 

const TOLERANCE = 1e-5;
const is_close = (x: number, y: number) => Math.abs(x - y) < TOLERANCE;

export type Variable = string;
export type Solution = { [key in Variable]: number };
export type Constraint = {
  strength: Strength,
  // we may want to do something like (x, y) <-> (r, theta) in the future in which case there are
  // always two outputs, so we let the constraint define its propagation methods
  propagation: { inputs: Variable[], method: (inputs: Solution) => Solution }[],
  toString(): string,
};

const query = (constraint: Constraint, solution: Solution): Solution => {
  // each propagation method has a list of variables it needs, and a function from those variables
  // to some output solution. if any of the inputs are undefined in the current solution, the method
  // doesn't run
  let output_solution = {};
  for (const { inputs, method } of constraint.propagation) {
    // https://stackoverflow.com/a/56592365
    const inputObj = Object.fromEntries(inputs.map(key => [key, solution[key]]));
    if (Object.values(inputObj).some((v) => v === undefined)) continue;
    // TODO: maybe add an assertion here that method must not return `undefined`s
    output_solution = { ...output_solution, ...method(inputObj) }
  }
  return output_solution;
}

const join = (solution: Solution, new_solution: Solution, strength: Strength): Solution =>
  _.mergeWith({...solution}, new_solution, (objValue, srcValue) => {
    if (strength === required && objValue !== undefined && srcValue !== undefined && !is_close(objValue, srcValue)) {
      // TODO: improve error message
      throw `required constraint not satisfied, because it contradicts an existing value.
old value: ${objValue}, new value: ${srcValue}`
    } else {
      return objValue ?? srcValue;
    }
  })

const step = (constraints: Constraint[], solution: Solution): Solution => {
  // query every constraint using the input solution space
  // return a new solution with these updated facts
  let new_solution = solution;
  for (const c of constraints) {
    new_solution = join(new_solution, query(c, solution), c.strength);
  }
  return new_solution;
}

export const isEqual = (s1: Solution, s2: Solution): boolean => {
  if (s1 === undefined && s2 !== undefined) return false;
  if (s1 !== undefined && s2 === undefined) return false;
  const keys1 = Object.keys(s1);
  const keys2 = Object.keys(s2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = s1[key];
    const val2 = s2[key];
    if (val2 === undefined) return false;
    if (!is_close(val1, val2)) return false;
  }

  return true;
}

export const solve = (constraints: Constraint[], prev_solution: Solution={}): Solution => {
  // iterate constraint propagation until fixpoint
  let solution = prev_solution;
  do {
    // console.log('current solution', solution);
    prev_solution = solution;
    solution = step(constraints, solution);
    console.log('prev solution, new solution', prev_solution, solution);
  } while (!isEqual(prev_solution, solution));
  return solution;
}

/* Solve the problem by saturating constraints in order of priority. */
export const layeredSolve = (constraints: Constraint[]): Solution => {
  // sort and group constraints in descending order by strength
  const layers = _.groupBy(constraints, (c) => c.strength);
  const layerEntries = Object.entries(layers).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
  let solution = {}, active_constraints = [];
  for (const [strength, constraints] of layerEntries) {
    active_constraints.push(...constraints);
    console.log(`solving strength: ${strength}`);
    console.log('active constraints', active_constraints.map((c) => c.toString()));
    solution = solve(active_constraints, solution);
    console.log('current layered solution', solution);
  }
  return solution
}

// Constraints
export const mkConstEqConstraint = (x: Variable, c: number, strength=required): Constraint => {
  return {
    strength,
    propagation: [{
      inputs: [],
      method: (_inputs) => ({ [x]: c }),
    }],
    toString: () => `${x} == ${c} (${strength})`
  }
}

export const mkEqConstraint = (x: Variable, y: Variable, strength=required): Constraint => {
  return {
    strength,
    propagation: [
      {
        inputs: [y],
        method: ({ y }) => ({ [x]: y }),
      },
      {
        inputs: [x],
        method: ({ x }) => ({ [y]: x }),
      },
    ],
    toString: () => `${x} == ${y} (${strength})`
  }
}

type Plus = { type: 'plus', exprs: AffineExpr[] };
export const plus = (...exprs: AffineExpr[]): Plus => ({ type: 'plus', exprs });

// The restriction here ensures expressions are affine.
type Mul = { type: 'mul', scalar: number, expr: AffineExpr };
export const mul = (scalar: number, expr: AffineExpr): Mul => ({ type: 'mul', scalar, expr });

export type AffineExpr =
| number
| Variable
| Plus
| Mul

namespace AffineExpr {
  export const toString = (e: AffineExpr): string => {
    if (typeof e === 'number') {
      return `${e}`;
    } else if (typeof e === 'string') {
      return e;
    } else if (e.type === 'plus') {
      return `(+ ${e.exprs.map(toString).join(' ')})`
    } else if (e.type === 'mul') {
      return `(* ${e.scalar} ${toString(e.expr)})`
    } else {
      throw 'never'
    }
  }
}

// a_1x_1 + ... + a_nx_n + b
export type CanonicalAffineExpr = {
  terms: Map<Variable, number>,
  bias: number,
}

// lhs = rhs
export type AffineConstraint = { lhs: AffineExpr, rhs: AffineExpr }

// a_1x_1 + ... + a_nx_n + b = 0
export type CanonicalAffineConstraint = CanonicalAffineExpr;

// turns affine constraint into a_1x_1 + ... + a_nx_n + b = 0 where a_1, ..., a_n != 0
const canonicalizeAffineConstraint = (c: AffineConstraint): CanonicalAffineConstraint => {
  const cLHS = canonicalizeExpr(c.lhs);
  const cRHS = canonicalizeExpr(c.rhs);
  console.log('canonical here', cLHS, cRHS);
  const lhsMinusRhsTerms = new Map(cLHS.terms);
  cRHS.terms.forEach((v, k) => {
  if (lhsMinusRhsTerms.has(k)) {
    lhsMinusRhsTerms.set(k, lhsMinusRhsTerms.get(k)! - v)
  } else {
    lhsMinusRhsTerms.set(k, -v);
  }
});
  lhsMinusRhsTerms.forEach((v, k, m) => is_close(v, 0) ? m.delete(k) : {})
  const lhsMinusRhs = { terms: lhsMinusRhsTerms, bias: cLHS.bias - cRHS.bias };
  return {
    ...lhsMinusRhs,
  }
}

// turns affine expression into a_1x_1 + ... + a_nx_n + b
const canonicalizeExpr = (c: AffineExpr): CanonicalAffineExpr => {
  if (typeof c === 'number') {
    return {
      terms: new Map(),
      bias: c,
    }
  } else if (typeof c === 'string') {
    // variable
    return {
      terms: new Map([[c, 1]]),
      bias: 0,
    }
  } else if (c.type === 'plus') {
    const cExprs = c.exprs.map(canonicalizeExpr);
    console.log('cExprs', cExprs);
    return cExprs.reduce((acc, ce) => {
     ce.terms.forEach((v, k) => acc.terms.has(k) ? acc.terms.set(k, acc.terms.get(k) + v) : acc.terms.set(k, v));
     return {
      terms: acc.terms,
      bias: acc.bias + ce.bias,
     };
  }, { terms: new Map(), bias: 0});
  } else if (c.type === 'mul') {
    const cExpr = canonicalizeExpr(c.expr);
    const mulTerms = new Map();
    cExpr.terms.forEach((v, k) => mulTerms.set(k, v * c.scalar));
    return {
      terms: mulTerms,
      bias: cExpr.bias * c.scalar,
    };
  } else {
    throw 'never';
  }
}

export const mkAffineConstraint = (lhs: AffineExpr, rhs: AffineExpr, strength=required): Constraint => {
  const canonicalConstraint = canonicalizeAffineConstraint({lhs, rhs});
  console.log('canonical constraint', canonicalConstraint);
  const termNames = Array.from(canonicalConstraint.terms.keys());

  return {
    strength,
    propagation: termNames.map((v) => {
      const indexOfV = termNames.indexOf(v);
      // https://stackoverflow.com/a/47743742
      const inputs = [...termNames.slice(0, indexOfV), ...termNames.slice(indexOfV + 1)];
      return {
        inputs,
        /* a_1x_1 + ... + a_ix_i + ... + a_nx_n + b = 0 -> x_i = -1/a_i * (a_1x_1 + ... + a_nx_n + b)
        (without x_i ofc) */
        method: (inputs) => ({
          [v]: Object.entries(inputs)
            .reduce((acc, [x_i, x_i_val]) => acc + canonicalConstraint.terms.get(x_i)! * x_i_val, canonicalConstraint.bias) / -canonicalConstraint.terms.get(v)!
        })
      }
    }),
    toString: () => `${AffineExpr.toString(lhs)} == ${AffineExpr.toString(rhs)} (${strength})`
  }
}

// TODO: maybe add some more propagation logic here?
export const mkMinMaxConstraint = (x: Variable, op: 'min' | 'max', ys: Variable[], strength=required): Constraint => {
  return {
    strength,
    propagation: [
      {
        inputs: ys,
        method: (inputs) => ({ [x]: Math[op](...Object.values(inputs)) }),
      },
    ],
    toString: () => `${x} = ${op}(${ys.join(', ')}) (${strength})`
  }
}
