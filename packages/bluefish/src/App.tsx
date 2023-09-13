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
      <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[tuple([1, pointer(1), pointer(2)]), tuple([1, 4]), tuple([3, 10])]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG>

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
      {/* Times:  403.06ms, 391.58ms, 389.29ms, 395.78ms, 395.44ms*/}
      {/* <SVG width={800} height={400}>
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
      </SVG> */}

      {/* 250 tuple length object */}
      {/* Times: 522.35ms, 561.51ms, 530.97ms, 546.02ms, 523.56ms */}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2), 4, 3, 2]),
            tuple([41, 75, 97, 89, 25, 44, 90, 34]),
            tuple([
              64, 94, 43, 77, 48, 94, 77, 76, 39, 49, 95, 98, 57, 8, 50, 19, 83, 41, 37, 47, 46, 8, 18, 6, 11, 79, 0,
              64, 16, 28, 33, 94, 91, 84, 25, 92, 22, 73, 84, 6, 17, 81, 15, 23, 61, 12, 65, 1, 72, 26, 9, 59, 40, 95,
              83, 79, 1, 89, 2, 85, 67, 20, 63, 56, 14, 68, 2, 73, 37, 26, 35, 92, 15, 78, 66, 8, 70, 49, 57, 60, 33,
              21, 7, 15, 38, 41, 61, 82, 33, 9, 56, 62, 90, 6, 59, 44, 67, 85, 25, 21, 50, 82, 61, 45, 91, 34, 0, 52,
              84, 12, 0, 51, 4, 20, 24, 27, 52, 97, 56, 73, 61, 46, 56, 29, 25, 66, 45, 76, 70, 26, 93, 59, 13, 69, 33,
              93, 52, 93, 7, 18, 90, 62, 8, 39, 26, 66, 92, 85, 84, 33, 45, 82, 1, 76, 74, 3, 62, 96, 57, 36, 88, 60,
              60, 95, 4, 91, 17, 78, 68, 30, 90, 92, 57, 40, 81, 94, 91, 71, 98, 12, 70, 22, 70, 16, 52, 80, 37, 17, 24,
              54, 37, 10, 73, 19, 57, 80, 58, 48, 56, 77, 11, 2, 77, 11, 62, 41, 17, 80, 28, 15, 8, 24, 70, 82, 9, 65,
              6, 42, 28, 74, 51, 97, 9, 60, 15, 80, 84, 27, 15, 14, 63, 32, 84, 43, 58, 12, 92, 18, 94, 35, 62, 85, 87,
              36, 61, 54, 32, 34, 12, 18,
            ]),
          ]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG> */}

      {/* 500 tuple length object */}
      {/* Times: 814.62ms, 833.62ms, 795.65ms, 792.92, 785.15ms */}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2), 4, 3, 2]),
            tuple([41, 75, 97, 89, 25, 44, 90, 34]),
            tuple([
              75, 15, 80, 86, 71, 95, 18, 89, 97, 84, 70, 81, 73, 9, 25, 65, 0, 21, 2, 49, 42, 15, 77, 71, 51, 21, 12,
              14, 94, 57, 42, 5, 18, 98, 73, 57, 31, 41, 48, 88, 31, 37, 53, 51, 91, 11, 29, 24, 22, 13, 31, 17, 99, 76,
              1, 29, 69, 43, 27, 68, 92, 36, 20, 99, 58, 5, 5, 23, 28, 44, 5, 26, 22, 32, 71, 79, 93, 44, 46, 11, 76,
              42, 85, 0, 95, 66, 2, 20, 87, 4, 56, 4, 10, 16, 50, 26, 93, 82, 11, 87, 3, 26, 14, 43, 25, 0, 13, 68, 53,
              27, 35, 66, 45, 83, 39, 18, 65, 98, 54, 61, 39, 68, 9, 94, 78, 49, 38, 17, 1, 23, 83, 56, 4, 40, 23, 82,
              22, 45, 58, 24, 37, 93, 65, 89, 39, 58, 19, 8, 24, 6, 15, 42, 69, 81, 7, 51, 29, 91, 65, 16, 43, 79, 39,
              67, 88, 21, 15, 21, 94, 44, 1, 67, 77, 38, 30, 48, 84, 22, 76, 4, 93, 74, 96, 87, 90, 67, 34, 74, 91, 73,
              12, 94, 10, 15, 66, 2, 93, 45, 46, 8, 16, 56, 24, 40, 71, 86, 92, 36, 74, 94, 2, 11, 69, 31, 96, 98, 63,
              38, 19, 12, 53, 56, 49, 0, 88, 75, 88, 22, 21, 25, 93, 65, 75, 12, 87, 55, 80, 16, 51, 22, 83, 26, 46, 74,
              46, 76, 40, 65, 73, 39, 91, 68, 24, 42, 11, 75, 92, 43, 70, 4, 51, 15, 53, 59, 24, 99, 47, 1, 55, 4, 91,
              70, 90, 6, 15, 93, 96, 49, 8, 6, 87, 27, 66, 2, 44, 20, 97, 98, 8, 49, 78, 83, 14, 0, 25, 47, 27, 16, 29,
              67, 60, 43, 61, 69, 72, 25, 15, 58, 93, 38, 9, 7, 9, 15, 31, 83, 35, 70, 81, 20, 62, 12, 94, 19, 49, 17,
              35, 27, 29, 94, 49, 26, 68, 2, 27, 80, 45, 53, 69, 10, 86, 10, 18, 66, 65, 31, 63, 41, 84, 58, 26, 2, 13,
              27, 33, 66, 42, 81, 16, 29, 64, 87, 90, 67, 54, 45, 82, 26, 6, 52, 81, 99, 14, 44, 67, 14, 58, 48, 82, 36,
              71, 76, 10, 88, 60, 67, 51, 89, 0, 83, 36, 17, 10, 93, 94, 98, 12, 58, 29, 54, 19, 11, 2, 45, 32, 12, 6,
              48, 18, 39, 23, 3, 19, 96, 3, 73, 84, 76, 57, 25, 23, 77, 98, 30, 70, 85, 30, 3, 30, 46, 52, 19, 99, 61,
              25, 95, 51, 94, 25, 14, 2, 1, 4, 71, 40, 39, 52, 9, 97, 20, 92, 96, 78, 23, 41, 6, 40, 68, 78, 62, 68, 17,
              15, 32, 61, 27, 18, 28, 40, 17, 28, 42, 24, 14, 41, 33, 13, 98, 22, 1, 12, 85, 43, 23, 15, 59, 53, 95, 17,
              2, 5, 66, 37, 37, 92, 24, 0, 16, 66, 1,
            ]),
          ]}
          rows={[
            [0, null, null],
            [null, 1, 2],
          ]}
        />
      </SVG> */}

      {/* 750 tuple length object */}
      {/* Times:  957.33ms, 1.01s, 987.50ms, 1.07s, 975.67ms */}
      {/* <SVG width={800} height={400}>
        <PythonTutor
          variables={[variable('c', pointer(0)), variable('d', pointer(1)), variable('x', 5)]}
          objects={[
            tuple([1, pointer(1), pointer(2), 4, 3, 2]),
            tuple([41, 75, 97, 89, 25, 44, 90, 34]),
            tuple([
              5, 34, 32, 80, 98, 22, 81, 33, 71, 12, 70, 90, 69, 3, 1, 32, 73, 8, 83, 38, 97, 42, 26, 8, 46, 57, 54, 85,
              20, 76, 64, 8, 52, 75, 53, 77, 61, 11, 96, 71, 67, 94, 55, 41, 37, 78, 78, 80, 30, 3, 49, 27, 15, 91, 2,
              50, 50, 45, 49, 7, 57, 36, 60, 42, 49, 35, 4, 25, 87, 83, 90, 50, 57, 49, 28, 18, 80, 84, 10, 74, 36, 16,
              86, 29, 26, 22, 92, 60, 16, 29, 70, 76, 8, 73, 58, 10, 95, 24, 24, 99, 34, 52, 10, 33, 34, 92, 73, 90, 31,
              19, 12, 39, 76, 80, 34, 88, 6, 83, 89, 97, 86, 57, 43, 69, 62, 33, 35, 4, 51, 54, 95, 17, 79, 40, 25, 49,
              95, 8, 35, 38, 99, 87, 7, 10, 42, 1, 17, 55, 81, 74, 74, 24, 3, 26, 0, 23, 94, 57, 40, 97, 70, 23, 78, 10,
              20, 95, 92, 66, 39, 72, 46, 9, 35, 14, 5, 90, 36, 27, 82, 2, 33, 22, 1, 14, 30, 12, 38, 8, 85, 72, 69, 9,
              23, 21, 30, 99, 77, 31, 8, 78, 87, 70, 23, 80, 87, 11, 88, 22, 49, 45, 2, 90, 8, 75, 52, 68, 64, 59, 76,
              63, 48, 65, 72, 70, 14, 90, 72, 92, 38, 45, 7, 28, 36, 28, 33, 74, 90, 76, 36, 7, 46, 11, 10, 95, 91, 14,
              80, 77, 31, 7, 11, 59, 83, 29, 0, 51, 29, 11, 12, 54, 99, 17, 52, 84, 83, 43, 83, 94, 19, 50, 2, 40, 28,
              78, 8, 24, 16, 55, 15, 98, 48, 55, 30, 67, 37, 1, 25, 85, 3, 0, 68, 62, 0, 60, 84, 96, 3, 42, 73, 19, 95,
              78, 10, 49, 89, 12, 75, 58, 60, 98, 76, 19, 95, 2, 90, 83, 40, 68, 40, 61, 80, 46, 90, 72, 54, 27, 64, 54,
              50, 37, 79, 75, 23, 31, 29, 87, 39, 89, 53, 72, 26, 8, 33, 73, 92, 69, 73, 92, 86, 5, 18, 7, 58, 84, 66,
              19, 60, 46, 28, 92, 8, 5, 79, 46, 36, 61, 77, 14, 56, 37, 83, 75, 91, 73, 99, 63, 54, 58, 36, 33, 2, 81,
              82, 56, 9, 66, 43, 12, 7, 65, 38, 69, 23, 43, 24, 0, 29, 49, 48, 87, 43, 87, 21, 70, 89, 35, 78, 21, 14,
              12, 86, 53, 47, 89, 43, 73, 74, 85, 0, 60, 70, 40, 80, 54, 7, 70, 0, 38, 25, 46, 12, 19, 96, 11, 32, 80,
              89, 69, 9, 94, 43, 10, 50, 78, 44, 42, 38, 67, 56, 86, 76, 45, 49, 9, 94, 75, 7, 65, 1, 90, 0, 54, 74, 9,
              14, 45, 2, 47, 60, 60, 58, 86, 35, 38, 10, 51, 15, 27, 98, 34, 41, 55, 1, 74, 78, 93, 28, 78, 59, 17, 22,
              16, 81, 4, 35, 17, 37, 13, 81, 69, 58, 95, 31, 50, 63, 26, 78, 96, 90, 85, 35, 44, 34, 12, 9, 25, 25, 53,
              10, 47, 87, 42, 49, 0, 98, 51, 11, 6, 50, 40, 94, 41, 49, 87, 60, 51, 44, 36, 23, 48, 27, 9, 71, 12, 25,
              76, 27, 7, 0, 69, 55, 14, 24, 96, 77, 63, 8, 4, 13, 25, 71, 5, 77, 34, 21, 14, 32, 29, 60, 17, 43, 98, 51,
              82, 49, 61, 67, 49, 45, 24, 75, 7, 22, 5, 98, 41, 66, 7, 68, 9, 81, 38, 24, 86, 97, 58, 23, 7, 3, 54, 23,
              71, 37, 92, 94, 79, 79, 86, 79, 90, 20, 9, 65, 98, 94, 34, 99, 42, 47, 8, 38, 59, 58, 53, 35, 43, 2, 98,
              38, 92, 31, 91, 73, 88, 13, 43, 90, 55, 67, 55, 34, 13, 38, 43, 6, 52, 66, 37, 53, 92, 77, 22, 66, 8, 17,
              74, 33, 91, 50, 15, 24, 98, 41, 93, 56, 12, 69, 40, 89, 95, 97, 75, 72, 38, 16, 9, 53, 29, 70, 42, 28, 56,
              2, 10, 30, 81, 69, 80, 49, 61, 0, 38, 33, 87, 46, 50, 81, 34, 65, 32, 44, 10, 40, 56, 58, 22, 18, 19, 40,
              56, 57, 21, 73, 91, 31, 35, 27, 61, 43, 3, 95, 98, 31, 42, 40, 93, 56, 66, 32, 14, 55, 21, 16, 17, 77, 50,
              16, 65, 65, 11, 47, 86, 13, 44, 77, 68, 94, 31, 43, 98,
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
