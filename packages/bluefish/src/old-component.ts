export type Interval = { lb: number, ub: number }
export type BBoxConstraints = { width: Interval, height: Interval }
export type BBoxSolution = { width: number, height: number }

// https://github.com/linebender/druid/pull/2183/files
export type Component<State, Constraints, Solution> = {
  layout: (constraints: Constraints, state: State) => Solution,
  paint: (solution: Solution, state: State) => JSX.Element,
  children: Component<State, Constraints, Solution>[],
  state: State,
}

type Rect = React.SVGProps<SVGRectElement> & Partial<{
  x: number,
  y: number,
  width: number,
  height: number,
}>

export const rect: (state: Rect) => Component<Rect, BBoxConstraints, BBoxSolution> = (state: Rect) => ({
  state,
  children: [],
  layout: () => {
    // if the values are already specified, return them
    // if the values are not already specified, infer them from constraints
    // defaults that might be desirable: smallest, largest, mean, random. maybe there is a way to
    // have the parent specify this behavior? idk
    throw ''
  },
  paint: () => { throw '' },
});
