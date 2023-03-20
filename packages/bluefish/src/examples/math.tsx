import { Measure, useBluefishLayout, withBluefish } from '../bluefish';
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

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mathjax_document = mathjax.document('', {
  InputJax: new TeX(),
  outputJax: new SVG({ fontCache: 'local' }),
  // loader: ['input/tex-full'],
});

const visitor = new SerializedMmlVisitor();
const toMathML = (node: MmlNode) => visitor.visitTree(node);

const mathjax_options = {
  em: 16,
  ex: 8,
  containerWidth: 1280,
};

// MathJax.startup.input = [new TeX({ packages: AllPackages })];
// MathJax.startup.makeMmlMethods('tex', new TeX({ packages: AllPackages }));

export function get_mml(math: string): string {
  //   mathjax_document.compile;
  const node = mathjax_document.convert(math, mathjax_options);
  console.log(node);
  console.log(toMathML(node));
  return toMathML(node);
}

export function get_mathjax_svg(math: string): string {
  const node = mathjax_document.convert(math, mathjax_options);
  console.log('node', node);
  return adaptor.innerHTML(node);
}

// mathjax.init({ loader: { load: ['input/tex'] } });
// const MathJax = require('mathjax-full').init({ loader: { load: ['input/tex'] } });

export const MathExample: React.FC<{}> = withBluefish(() => {
  const parser = new DOMParser();
  const y = get_mathjax_svg('a * 2 / 3 + 10^4');
  console.log(y);

  const x = get_mml('-b + \\sqrt{b^2 - 4ac}');

  console.log(x);

  const parsed = parser.parseFromString(x, 'text/html');
  const child = parsed.firstElementChild;
  const props = parsed.firstElementChild === null ? {} : parsed.firstElementChild.getBoundingClientRect();
  const { id, bbox, domRef } = useBluefishLayout({}, props, mathMeasurePolicy(props));

  return (
    <Group>
      <g
        id={id}
        ref={domRef}
        transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
      >
        <div dangerouslySetInnerHTML={{ __html: child === null ? '' : child.innerHTML }}></div>
      </g>
    </Group>
  );
});

type mathProps = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
};
const mathMeasurePolicy = ({ left, right, top, bottom, width, height }: mathProps): Measure => {
  return (_measurables, constraints) => {
    return {
      left: left,
      top: top,
      width: width,
      height: height,
    };
  };
};
