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
// import { PythonTutor } from './python-tutor';
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
// import { ChartAccent } from './examples/chart-accent';

const blob = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): JSX.Element => {
  return <path {...svgOptions} d={blobs2.svgPath(blobOptions)}></path>;
};

function App() {
  const line = useName('line');

  const ex1 = useName('ex1');
  const ex2 = useName('ex2');

  const fixed1 = useName('fixed1');
  const fixed2 = useName('fixed2');

  const chemical1 = useName('chemical1');
  const chemical2 = useName('chemical2');
  const chemical3 = useName('chemical3');
  const chemical4 = useName('chemical4');
  const chemical5 = useName('chemical5');

  const autoAssign2 = useName('autoAssign2');
  const autoAssign3 = useName('autoAssign3');

  return (
    <div className="App">
      {/* Diphenyl ether */}
      {/* <SVG width={500} height={500}>
        <Group>
          <Molecule name={chemical1} chemicalFormula={'C1=CC=C(C=C1)OC2=CC=CC=C2'} />
          <PointLabel
            texts={[{ label: <Text contents={'Diphenyl Ether'} />, ref: lookup(chemical1, 'vertex-5') }]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        </Group>
      </SVG> */}

      {/* Aspirin */}
      {/* <SVG width={500} height={500}>
        <Group>
          <Molecule name={chemical2} chemicalFormula={'CC(OC1=C(C(=O)O)C=CC=C1)=O'} />
          <PointLabel
            texts={[
              { label: <Text contents={'Aspirin'} />, ref: lookup(chemical2, 'vertex-7') },
              {
                label: <Text contents={'Benzene'} fill={'blue'} stroke={'blue'} />,
                ref: lookup(chemical2, 'vertex-10'),
              },
              { label: <Text contents={'Ester'} fill={'red'} stroke={'red'} />, ref: lookup(chemical2, 'vertex-0') },
            ]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
          <Background>
            <Group>
              <Ref to={lookup(chemical2, 'vertex-0')} />
              <Ref to={lookup(chemical2, 'vertex-1')} />
              <Ref to={lookup(chemical2, 'vertex-2')} />
              <Ref to={lookup(chemical2, 'vertex-12')} />
            </Group>
            <Rect fill={'none'} stroke={'red'} />
          </Background>
          <Background>
            <Group>
              <Ref to={lookup(chemical2, 'vertex-8')} />
              <Ref to={lookup(chemical2, 'vertex-9')} />
              <Ref to={lookup(chemical2, 'vertex-10')} />
              <Ref to={lookup(chemical2, 'vertex-11')} />
              <Ref to={lookup(chemical2, 'vertex-3')} />
            </Group>
            <Circle fill={'none'} stroke={'blue'} />
          </Background>
        </Group>
      </SVG> */}

      {/* Nicotine */}
      {/* <SVG width={500} height={500}>
        <Group>
          <Molecule name={chemical3} chemicalFormula={'CN1CCCC1C2=CN=CC=C2'} />
          <PointLabel
            texts={[{ label: <Text contents={'Nicotine'} />, ref: lookup(chemical3, 'vertex-10') }]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        </Group>
      </SVG> */}

      {/* Sucrose */}
      {/* <SVG width={500} height={500}>
        <Group>
          <Molecule name={chemical4} chemicalFormula={'C(C1C(C(C(C(O1)OC2(C(C(C(O2)CO)O)O)CO)O)O)O)O'} />
          <PointLabel
            texts={[{ label: <Text contents={'Sucrose'} />, ref: lookup(chemical4, 'vertex-21') }]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        </Group>
      </SVG> */}

      {/* Penicillin */}
      {/* <SVG width={600} height={600}>
        <Group>
          <Molecule name={chemical5} chemicalFormula={'CC1(C(N2C(S1)C(C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C'} />
          <PointLabel
            texts={[{ label: <Text contents={'Penicillin'} />, ref: lookup(chemical5, 'vertex-21') }]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        </Group>
      </SVG> */}
    </div>
  );
}

export default App;
