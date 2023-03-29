import { Measure, PropsWithBluefish, useBluefishLayout, useName, useNameList, withBluefish, Symbol } from '../bluefish';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { PropsWithChildren, ReactNode, useRef } from 'react';
import { Group, NewBBox } from '../main';
import { SVGWrapperFactory } from 'mathjax-full/js/output/svg/WrapperFactory';
import { MyWrapperFactory } from './mathWrapper/myWrapperFactory';
import { MySVGWrapper } from './mathWrapper/mySVGWrapper';
import { rasterize } from '../rasterize';
import _ from 'lodash';

const DEFAULT_OPTIONS = {
  width: 1280,
  ex: 8,
  em: 16,
};

type BoundingBox = {
  height?: number;
  width?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

type EquationTree = {
  bbox: BoundingBox; // for elements with no bounding boxes (?) i.e. <def> elements
  node: SVGElement; // the SVG element of the node
  transform?: string;
  children: EquationTree[];
  leafCount: number;
};

/**
 * Traverse SVG element tree, returning a tree of the elements with their associated bounding
 * boxes, as well as their transforms and leaf counts (number of leaf nodes corresponding to the subtree)
 */
function traverseTree(elem: SVGElement, parent: EquationTree | undefined): EquationTree {
  const rect = elem.getBoundingClientRect();
  const bbox: BoundingBox = {
    width: rect.width,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
  };
  const node = elem;
  const children: EquationTree[] = [];
  const transform = elem.getAttribute('transform');
  let leafCount = 0;

  for (const child of Array.from(elem.children)) {
    const traversal = traverseTree(child as SVGElement, undefined);
    children.push(traversal);
    leafCount += traversal.leafCount;
  }
  if (children.length === 0) {
    leafCount = 1;
  }
  const tree = {
    bbox: bbox,
    node: node,
    children: children,
    transform: transform ?? undefined,
    leafCount: leafCount,
  };

  if (parent !== undefined) {
    parent.children.push(tree);
  } else {
    parent = tree;
  }

  return parent;
}

/**
 * Convert latex to SVG string representing latex code, using MathJax
 *
 * @param str latex string
 * @returns SVG string corresponding to the latex string
 */
function texToSvg(str: string) {
  const options = DEFAULT_OPTIONS;

  const ASSISTIVE_MML = false,
    FONT_CACHE = true,
    INLINE = false,
    CSS = false,
    packages = AllPackages.sort();

  const adaptor = liteAdaptor();
  const handler = RegisterHTMLHandler(adaptor);

  const tex = new TeX({ packages });
  const svg = new SVG({
    fontCache: FONT_CACHE ? 'local' : 'none',
  });
  const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

  const node = html.convert(str, {
    display: !INLINE,
    em: options.em,
    ex: options.ex,
    containerWidth: options.width,
  });

  const svgString = adaptor.outerHTML(node);
  return svgString;
}

export type MathProps = PropsWithBluefish<{ latex: string; names?: Symbol[] }>; // latex string to render

export const Math = withBluefish((props: MathProps) => {
  const parser = new DOMParser();
  const svgString = texToSvg(props.latex);
  const mathSVG = parser.parseFromString(svgString, 'image/svg+xml').firstChild?.firstChild as SVGElement;
  const defs = mathSVG.firstChild as SVGElement; // SVG path definitions for elements
  const equation = defs.nextSibling as SVGElement;
  const node = useName('node');

  const toRemove = document.body.appendChild(mathSVG); // add to DOM to get measurements
  const result = traverseTree(equation, undefined);
  console.log('traversal', result);

  const bounds = mathSVG.getBoundingClientRect(); // get bounding box of SVG
  console.log('bounds of mathSVG', bounds);
  const boundingBox = {
    left: bounds.left,
    right: bounds.right,
    top: bounds.top,
    bottom: bounds.bottom,
    width: bounds.width,
    height: bounds.height,
  };

  toRemove?.remove();

  // pass bounding box results into math measure policy
  const { id, bbox, domRef } = useBluefishLayout({}, props, mathMeasurePolicy2(boundingBox));

  return (
    <svg
      id={id}
      ref={domRef}
      // style={{ verticalAlign: '-0.186ex' }}
      // xmlns={mathSVG.getAttribute('xmlns') ?? undefined}
      width={bbox.width ?? undefined}
      height={bbox.height ?? undefined}
      // role="img"
      // focusable="false"
      viewBox={mathSVG.getAttribute('viewBox') ?? undefined}
      // xmlnsXlink="http://www.w3.org/1999/xlink"
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      <defs dangerouslySetInnerHTML={{ __html: defs.innerHTML }} />
      <MathNode
        name={node}
        node={result}
        transform={result.transform}
        names={props.names ?? useNameList(_.range(result.leafCount).map((i) => `leaf-${i}`))}
      />
    </svg>
  );
});

type mathProps = PropsWithBluefish<{
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
}>;

const mathMeasurePolicy2 = (props: mathProps): Measure => {
  return (_measurables, constraints) => {
    return {
      left: props.left ?? 0,
      right: props.right ?? 0,
      bottom: props.bottom ?? 0,
      top: props.top ?? 0,
      width: props.width ?? 0,
      height: props.height ?? 0,
    };
  };
};

type MathNodeProps = PropsWithBluefish<{
  node: EquationTree;
  transform?: string;
  names: Symbol[]; // names to assign to leaves of tree
}>;

export const MathNode = withBluefish((props: PropsWithChildren<MathNodeProps>) => {
  const { node, children } = props.node;
  const boundingBox = props.node.bbox;
  console.log('pre-measurement bounding box', boundingBox);
  const { id, bbox, domRef } = useBluefishLayout({}, props, mathMeasurePolicy2(boundingBox));

  if (children.length === 0) {
    // leaf node
    return (
      <g
        id={id}
        ref={domRef}
        transform={`${props.transform ?? ''}
      scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
        height={bbox.height ?? 0}
        width={bbox.width ?? 0}
        dangerouslySetInnerHTML={{ __html: node.outerHTML }}
      />
    );
  }
  let counter = 0;
  console.log('post-measurement bounding box', bbox);

  return (
    <g
      id={id}
      ref={domRef}
      transform={`${props.transform ?? ''}
      scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
      height={bbox.height ?? 0}
      width={bbox.width ?? 0}
    >
      {children.map((child, index) => {
        const names = props.names.slice(counter, counter + child.leafCount);

        counter += child.leafCount;
        if (child.leafCount === 1) {
          return <MathNode node={child} transform={child.transform} names={names} name={names[0]} />;
        } else {
          return (
            <MathNode
              node={child}
              transform={child.transform}
              names={props.names.slice(counter - child.leafCount, counter)}
            />
          );
        }
      })}
    </g>
  );
});
