import { Measure, PropsWithBluefish, useBluefishLayout, withBluefish } from '../bluefish';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import {} from 'mathjax-full/js/output/svg/Wrapper';
import { MathJax } from 'mathjax-full/js/components/startup';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { MmlNode } from 'mathjax-full/js/core/MmlTree/MmlNode';
import { useRef } from 'react';
import { Group } from '../main';

const DEFAULT_OPTIONS = {
  width: 1280,
  ex: 8,
  em: 16,
};

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
  const svg = new SVG({ fontCache: FONT_CACHE ? 'local' : 'none' });
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

export const MathExample2: React.FC<{}> = withBluefish(() => {
  const parser = new DOMParser();
  const y = texToSvg('a * 2 / 3 + 10^4');
  const equation = parser.parseFromString(y, 'image/svg+xml').firstElementChild;
  console.log(equation);
  console.log('Equation', equation?.getBoundingClientRect());

  const props = {};

  const { id, bbox, domRef } = useBluefishLayout({}, props, mathMeasurePolicy2(props));
  return (
    <Group>
      <g
        id={id}
        ref={domRef}
        transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
      >
        {/* <g>
          <div dangerouslySetInnerHTML={{ __html: y }}></div>
        </g> */}
        <TraverseDocument elem={equation} />
      </g>
    </Group>
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
      top: top,
      width: width,
      height: height,
    };
  };
};

type traversalProps = {
  elem: Element | null;
};

export const TraverseDocument = withBluefish((props: traversalProps) => {
  if (props.elem == null) {
    return null;
  }
  const rect = props.elem.getBoundingClientRect();
  const bboxProps = {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
  console.log('input bbox', bboxProps);
  const { id, bbox, domRef } = useBluefishLayout({}, {}, mathMeasurePolicy2(bboxProps));
  console.log(bbox);
  const children = [];
  let curChild = props.elem.firstElementChild;
  while (curChild !== null) {
    children.push(curChild);
    curChild = curChild.nextElementSibling;
  }

  console.log(props.elem.attributes);

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
      scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
      xlinkHref={props.elem.getAttribute('xlink:href') ?? undefined}
      data-mml-node={props.elem.getAttribute('data-mml-node') ?? undefined}
    >
      {children.map((child) => (
        <TraverseDocument elem={child} />
      ))}
    </g>
  );
});
TraverseDocument.displayName = 'TraverseDocument';
// module.exports = TeXToSVG;
