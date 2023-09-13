import React from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from './component';
import * as blobs2 from 'blobs/v2';
import {
  annotatedEquation,
  testComponent,
  testRow,
  annotatedDiagram,
  testCol,
  testArrow,
  annotatedEquationRef,
  blobPaperJSTest,
} from './testComponents';
import * as _ from 'lodash';
import { bertinHotel } from './examples/bertinHotel';
// import { blob as test_blob } from './examples/paperjs-test';
import { SVG } from './components/SVG';
import { Row } from './components/Row';
import { Text } from './components/Text';
// import { Char, Peritext } from './examples/peritext';
import { Bluefish } from './components/Bluefish';
// import { Child, Parent } from './components/TestingRefs';
import { Child, Parent } from './components/TestingContext';
import { rasterize } from './rasterize';
import { Label, LabelTest } from './examples/label';
import labelLayout, { Anchors } from './components/Label/LabelLayout';
import { PointLabel } from './components/Label/PointLabel';
import { Circle, Line, Padding, Ref, Space, useBluefishContext } from './main';
// import { GoTree } from './examples/gotree';
import { Plot2 as Plot, Plot2 } from './examples/grammars/gog/Plot';
import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
// import { GlobalFrame } from './python-tutor';
import { NewLine } from './examples/grammars/gog/marks/NewLine';
import { NewDot } from './examples/grammars/gog/marks/NewDot';
import { resolveRef } from './components/Ref';
import { BluefishContextValue, lookup, useName, withBluefish } from './bluefish';
import { Rect } from './components/Rect';
import { Col } from './components/Col';
import { Test2 } from './components/Test2';
import { Copy } from './components/Copy';
import { CopyAttr } from './components/CopyAttr';
import { Align, Align as Align3 } from './components/Align';
import { Group } from './components/Group';
import { Circle as Circle2 } from './components/Circle';
import { ColNewHooks } from './components/ColNewHooks';
// import { CharSymbol } from './examples/peritext-symbol-test';
// import { TreeSymbol } from './examples/tree-symbol-test';
// import { Peritext as PeritextSymbol } from './examples/peritext-symbol-test';
import { interpolateBlues } from 'd3-scale-chromatic';
import { BarY } from './examples/grammars/gog/marks/NewBarY';
// import { Tree as Tree1 } from './examples/grammars/gotree/gotree-ex1';
// import { Tree2 } from './examples/grammars/gotree/gotree-ex2';
// import { NodeProps, Tree3 } from './examples/grammars/gotree/gotree-ex3';
// import { Tree3 } from './examples/grammars/gotree/gotree-ex4';
// import { RELATIONS, Tree5 } from './examples/grammars/gotree/gotree-ex5';
import { RectPath } from './examples/grammars/gog/marks/RectPath';
import { Molecule } from './examples/chemistry/Molecule';
import { Polio } from './examples/polio/polio';
import { Distribute } from './components/Distribute';
// import { Tree5 as Tree6 } from './examples/grammars/gotree/gotree-ex6 copy';
// import { Matrix } from './examples/grammars/gog/examples/neo/Matrix';
import { Background } from './components/Background';
import { PythonTutor, pointer, tuple, variable } from './examples/python-tutor/python-tutor';
import { Variable } from './examples/python-tutor/Variable';
import { ElmTuple } from './examples/python-tutor/ElmTuple';
// import { Tree5 as Tree6 } from './examples/grammars/gotree/gotree-ex6 copy';
// import { Matrix } from './examples/grammars/gog/examples/neo/Matrix';
import { Recipe } from './examples/Recipe';
import { Euclid } from './examples/euclid/euclid';
import { Playfair } from './examples/playfair/playfair';
import { UpSet } from './examples/upset/upset';
import { Tree1 } from './examples/grammars/gotree/1-SingleVisualization';
import { CircleNode, RectNode, TextNode, Tree2 } from './examples/grammars/gotree/2-AbstractedNode';
import { Tree3, link, row, col, none, rect, circle, text, contain } from './examples/grammars/gotree/3-EncodableTree';
import { Contain } from './components/Contain';
// import { Tree3 } from './examples/grammars/gotree/3-EncodableTree - FRESH';
import { flexibleRect } from './examples/grammars/gotree/3-EncodableTree';
import { Cars0, Cars1, Cars2, Cars3 } from './examples/cars/cars';
import { Objects } from './examples/python-tutor/Objects';
// import { ChartAccent } from './examples/chart-accent';

const blob = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): JSX.Element => {
  return <path {...svgOptions} d={blobs2.svgPath(blobOptions)}></path>;
};

// const copyAttr = <T,>(context: BluefishContextValue, name: string, prop: string): T => {
//   const measurable = resolveRef(name, context.bfMap);
//   return measurable.props[prop] as T;
// };

{
  /* <>
  <Group data={''}>
    <Label>1957</Label>
    <Label>1978</Label>
  </Group>
  <Group>
    <Label>2000</Label>
  </Group>

  {[1957, 1978, 2000].map((year, i) => (
    <Label>{year}</Label>
  ))}

  <Label data={[1957, 1978, 2000]} />
</>; */
}

// const CustomNode = withBluefish(<T,>(props: NodeProps<T>) => {
//   const circle = useName('circle');
//   const text = useName('text');

//   return (
//     <Group>
//       <Rect name={circle} width={50} height={50} fill={'cornflowerblue'} />
//       <Text name={text} contents={`${props.value}`} fontSize={'20px'} />
//       <Align center={[<Ref to={text} />, <Ref to={circle} />]} />
//     </Group>
//   );
// });

function App() {
  const line = useName('line');

  const ex1 = useName('ex1');
  const ex2 = useName('ex2');

  const fixed1 = useName('fixed1');
  const fixed2 = useName('fixed2');

  const autoAssign1 = useName('autoAssign1');
  const autoAssign2 = useName('autoAssign2');
  const autoAssign3 = useName('autoAssign3');

  const chemical2 = useName('chemical2');

  return (
    <div className="App">
      {/* Each Align of the element tuple objects uses refs -> scaling size of objects scales Ref usage */}

      {/* Less than 10 Objects */}
      {/* Times: 98.2ms, 108.3ms, 158.4ms, 90.4ms, 88.1ms */}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[tuple([1, pointer(1), pointer(2)]), tuple([1, 4]), tuple([3, 10])]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG> */}

      {/* Around 10 tuple length objects */}
      {/* Times: 247.9ms, 247.8ms, 252.7ms, 219.4ms, 215.7ms */}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2)]),
            tuple([57, 69, 73, 48, 44, 81, 76, 50, 64, 1]),
            tuple([54, 29, 64, 66, 8, 38, 13, 1, 42, 68]),
          ]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG> */}

      {/* 50 tuple length objects */}
      {/* Times: 366.2, 328.3ms, 432ms, 339.7ms, 374.7ms*/}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2), 4, 3, 2]),
            tuple([41, 75, 97, 89, 25, 44, 90, 34]),
            tuple([
              61, 77, 64, 53, 78, 52, 15, 19, 99, 78, 47, 15, 79, 34, 76, 9, 76, 70, 17, 71, 98, 98, 69, 48, 98, 69, 78,
              91, 9, 61, 31, 33, 5, 28, 99, 48, 22, 49, 25, 12, 36, 34, 70, 13, 81, 22, 6, 95, 25, 83,
            ]),
          ]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG> */}

      {/* 100 tuple length object */}
      {/* Times:  404.6ms, */}
      <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2), 4, 3, 2]),
            tuple([41, 75, 97, 89, 25, 44, 90, 34]),
            tuple([
              59, 80, 35, 89, 69, 67, 83, 28, 61, 83, 17, 34, 43, 26, 67, 71, 58, 15, 56, 30, 0, 41, 17, 79, 57, 98, 15,
              48, 72, 32, 15, 53, 31, 34, 4, 68, 67, 91, 89, 91, 64, 71, 2, 83, 32, 80, 87, 4, 35, 89, 15, 90, 16, 50,
              25, 98, 51, 78, 22, 0, 28, 14, 59, 43, 32, 9, 59, 51, 68, 93, 18, 57, 22, 10, 28, 55, 60, 70, 32, 82, 80,
              61, 38, 24, 86, 8, 61, 45, 35, 10, 46, 89, 17, 89, 41, 23, 70, 80, 81, 8,
            ]),
          ]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG>

      {/* Performance testing - computer wasn't happy; profiler paused and didn't give response */}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2), 4, 3, 2]),
            tuple([
              62, 55, 14, 44, 57, 16, 81, 84, 29, 82, 20, 13, 66, 40, 46, 66, 48, 2, 87, 91, 86, 57, 99, 45, 86, 69, 63,
              10, 78, 40, 32, 28, 68, 16, 33, 79, 82, 13, 67, 89, 56, 7, 94, 13, 19, 93, 19, 26, 59, 33, 60, 24, 21, 76,
              15, 12, 51, 23, 42, 95, 25, 38, 7, 61, 1, 97, 96, 16, 64, 13, 50, 83, 52, 95, 16, 71, 11, 62, 5, 36, 57,
              35, 41, 15, 34, 63, 90, 22, 8, 56, 16, 41, 26, 9, 38, 26, 6, 9, 48, 78,
            ]),
            tuple([
              61, 25, 23, 18, 89, 16, 33, 75, 7, 86, 3, 19, 63, 19, 58, 34, 85, 92, 46, 54, 37, 9, 91, 67, 59, 46, 35,
              45, 81, 97, 9, 61, 0, 80, 10, 36, 44, 16, 30, 19, 33, 59, 21, 74, 18, 46, 71, 30, 91, 8, 60, 61, 53, 70,
              74, 99, 88, 14, 71, 74, 43, 92, 17, 27, 66, 37, 25, 3, 43, 86, 27, 45, 58, 44, 24, 60, 40, 64, 34, 54, 87,
              1, 56, 37, 39, 72, 36, 1, 43, 73, 10, 77, 12, 9, 85, 59, 32, 63, 13, 64,
            ]),
          ]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG> */}
    </div>
  );
}

export default App;
