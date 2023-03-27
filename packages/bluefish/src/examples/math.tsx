import { Measure, PropsWithBluefish, useBluefishLayout, useName, useNameList, withBluefish } from '../bluefish';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { SVGWrapper } from 'mathjax-full/js/output/svg/Wrapper';
import { MathJax } from 'mathjax-full/js/components/startup';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { MmlNode } from 'mathjax-full/js/core/MmlTree/MmlNode';
import { PropsWithChildren, ReactNode, useRef } from 'react';
import { Group, NewBBox } from '../main';
import { SVGWrapperFactory } from 'mathjax-full/js/output/svg/WrapperFactory';
import { MyWrapperFactory } from './mathWrapper/myWrapperFactory';
import { MySVGWrapper } from './mathWrapper/mySVGWrapper';
import { rasterize } from '../rasterize';

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
};

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

  const tree = {
    bbox: bbox,
    node: node,
    children: children,
    transform: transform ?? undefined,
  };

  if (parent !== undefined) {
    parent.children.push(tree);
  } else {
    parent = tree;
  }

  for (const child of Array.from(elem.children)) {
    children.push(traverseTree(child as SVGElement, undefined));
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
    wrapperFactory: new MyWrapperFactory(),
  }); // insert wrapperfactory here
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

export type MathProps = PropsWithBluefish<{ latex: string }>; // latex string to render

export const Math = withBluefish((props: MathProps) => {
  const parser = new DOMParser();
  const svgString = texToSvg(props.latex);
  const mathSVG = parser.parseFromString(svgString, 'image/svg+xml').firstChild?.firstChild as SVGElement;
  const defs = mathSVG.firstChild as SVGElement;
  const equation = defs.nextSibling as SVGElement;
  const node = useName('node');

  const toRemove = document.body.appendChild(mathSVG);
  const result = traverseTree(equation, undefined);
  toRemove?.remove();

  const { id, bbox, domRef } = useBluefishLayout({}, props, mathMeasurePolicy2({}));

  return (
    <svg
      id={id}
      ref={domRef}
      // style={{ verticalAlign: '-0.186ex' }}
      // xmlns={mathSVG.getAttribute('xmlns') ?? undefined}
      width={mathSVG.getAttribute('width') ?? undefined}
      height={mathSVG.getAttribute('height') ?? undefined}
      // role="img"
      // focusable="false"
      viewBox={mathSVG.getAttribute('viewBox') ?? undefined}
      // xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs dangerouslySetInnerHTML={{ __html: defs.innerHTML }} />
      <MathNode
        name={node}
        bbox={result.bbox}
        elem={result.node}
        childrenTree={result.children}
        transform={result.transform}
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

const mathMeasurePolicy2 = ({ left, right, top, bottom, width, height }: mathProps): Measure => {
  return (_measurables, constraints) => {
    return {
      left: left,
      right: right,
      bottom: bottom,
      top: top,
      width: width,
      height: height,
    };
  };
};

type MathNodeProps = PropsWithBluefish<{
  bbox: BoundingBox;
  elem: Element;
  childrenTree: EquationTree[];
  transform?: string;
}>;

// const Node = withBluefish(props: {opId: string, }) => {
//   return elem;
// };

export const MathNode = withBluefish((props: PropsWithChildren<MathNodeProps>) => {
  const { id, bbox, domRef } = useBluefishLayout({}, props, mathMeasurePolicy2(props.bbox));

  if (props.childrenTree.length === 0) {
    return (
      <g
        id={id}
        ref={domRef}
        transform={`${props.transform ?? ''}
      scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
        height={props.bbox?.height ?? 0}
        width={props.bbox?.width ?? 0}
        dangerouslySetInnerHTML={{ __html: props.elem.outerHTML }}
      />
    );
  }

  const childrenNames = useNameList(props.childrenTree.map((child, index) => `child-${index}`));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`${props.transform ?? ''}
      scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
      height={props.bbox?.height ?? 0}
      width={props.bbox?.width ?? 0}
    >
      {props.childrenTree.map((child, index) => {
        return (
          <MathNode
            elem={child.node}
            bbox={child.bbox}
            childrenTree={child.children}
            transform={child.transform}
            name={childrenNames[index]}
          />
        );
      })}
    </g>
  );
});
