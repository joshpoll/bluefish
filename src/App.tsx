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
import { blob as test_blob } from './examples/paperjs-test';
import { SVG } from './components/SVG';
import { Col } from './components/Col';
import { Row } from './components/Row';
import { Rect } from './components/Rect';
import { Text } from './components/Text';
import { Char, Peritext } from './examples/peritext';
import { Bluefish } from './components/Bluefish';
import { SVGClass } from './components/SVGClass';
// import { Child, Parent } from './components/TestingRefs';
import { Child, Parent } from './components/TestingContext';
import { Align } from './components/Align';
import { FlexTree, Node, Tree, ParseTree } from './examples/basic-tree';
import { Point, GlobalFrame, Variable, Objects, PythonTutor } from './examples/python-tutor';

const blob = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): JSX.Element => {
  return <path {...svgOptions} d={blobs2.svgPath(blobOptions)}></path>;
};

function App() {
  const [startOpId, setStartOpId] = React.useState('5@B');
  const [rangeval, setRangeval] = React.useState(undefined);

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header> */}
      <br />
      <input
        type="range"
        className="custom-range"
        min="0"
        max="20"
        onChange={(event) => setRangeval(event.target.value as any)}
      />
      <h4>The range value is {rangeval}</h4>
      <br />
      <select value={startOpId} onChange={(e) => setStartOpId(e.target.value)}>
        {['5@B', '6@B', '7@A'].map((opId) => (
          <option value={opId}>{opId}</option>
        ))}
      </select>
      "OP ID": {startOpId}
      <br />
      <Peritext
        spacing={rangeval}
        chars={[
          { value: 'T', opId: '1@A', deleted: false, marks: ['italic'] },
          { value: 'h', opId: '2@A', deleted: true, marks: ['italic'] },
          { value: 'e', opId: '5@B', deleted: false, marks: ['bold', 'italic'] },
          { value: ' ', opId: '6@B', deleted: false, marks: ['bold', 'italic'] },
          { value: 'f', opId: '7@A', deleted: false, marks: ['bold'] },
          { value: 'o', opId: '8@A', deleted: true, marks: [] },
          { value: 'x', opId: '9@A', deleted: false, marks: [] },
        ]}
        markOps={[
          {
            action: 'addMark',
            opId: '18@A',
            start: { opId: startOpId },
            end: { opId: '7@A' },
            markType: 'bold',
            backgroundColor: '#F9EEEE',
            borderColor: '#E57E97',
          },
          {
            action: 'addMark',
            opId: '10@B',
            start: { opId: '1@A' },
            end: { opId: '6@B' },
            markType: 'italic',
            backgroundColor: '#E3F2F7',
            borderColor: '#00C2FF',
          },
        ]}
      />
      <br />
      {/* <Node value={'3'} opId={'node1'} /> */}
      {/* <Tree
        nodes={[
          { value: '3', opId: 'node1' },
          { value: '4', opId: 'node2' },
          { value: '5', opId: 'node3' },
        ]}
        parentChild={[
          { parent: { opId: 'node1' }, child: { opId: 'node2' } },
          { parent: { opId: 'node1' }, child: { opId: 'node3' } },
        ]}
        levels={[
          { depth: 0, nodes: ['node1'] },
          { depth: 1, nodes: ['node2', 'node3'] },
        ]}
      /> */}
      <ParseTree
        spacing={200}
        nodes={[
          { value: '1', opId: 'node1' },
          { value: '2', opId: 'node2' },
          { value: '3', opId: 'node3' },
          { value: '4', opId: 'node4' },
          { value: '5', opId: 'node5' },
          { value: '6', opId: 'node6' },
          { value: '8', opId: 'node8' },
          { value: '9', opId: 'node9' },
        ]}
        parentChild={[
          { parent: { opId: 'node1' }, child: { opId: 'node2' } },
          { parent: { opId: 'node1' }, child: { opId: 'node3' } },
          { parent: { opId: 'node1' }, child: { opId: 'node4' } },
          { parent: { opId: 'node2' }, child: { opId: 'node5' } },
          { parent: { opId: 'node2' }, child: { opId: 'node6' } },
          { parent: { opId: 'node4' }, child: { opId: 'node8' } },
          { parent: { opId: 'node4' }, child: { opId: 'node9' } },
        ]}
        levels={[
          { depth: 0, nodes: ['node1'] },
          { depth: 1, nodes: ['node2', 'node4'] },
          { depth: 2, nodes: ['node5', 'node6', 'node3', 'node8', 'node9'] },
        ]}
      />
      <FlexTree
        spacing={200}
        nodes={[
          { value: '1', opId: 'node1' },
          { value: '2', opId: 'node2' },
          { value: '3', opId: 'node3' },
          { value: '4', opId: 'node4' },
          { value: '5', opId: 'node5' },
          { value: '6', opId: 'node6' },
          { value: '7', opId: 'node7' },
          { value: '8', opId: 'node8' },
          { value: '9', opId: 'node9' },
        ]}
        parentChild={[
          { parent: { opId: 'node1' }, child: { opId: 'node2' } },
          { parent: { opId: 'node1' }, child: { opId: 'node3' } },
          { parent: { opId: 'node1' }, child: { opId: 'node4' } },
          { parent: { opId: 'node2' }, child: { opId: 'node5' } },
          { parent: { opId: 'node2' }, child: { opId: 'node6' } },
          { parent: { opId: 'node2' }, child: { opId: 'node7' } },
          { parent: { opId: 'node4' }, child: { opId: 'node8' } },
          { parent: { opId: 'node4' }, child: { opId: 'node9' } },
        ]}
        levels={[
          { depth: 0, nodes: ['node1'] },
          { depth: 1, nodes: ['node2', 'node3', 'node4'] },
          { depth: 2, nodes: ['node5', 'node6', 'node7', 'node8', 'node9'] },
        ]}
      />
      <GlobalFrame
        variables={[{ pointObject: { opId: 'list1' }, value: 'c', opId: 'c' },
        { pointObject: { opId: 'list2' }, value: 'd', opId: 'd' },
        { pointObject: { opId: 'list3' }, value: 'x', opId: 'x' }]}
        opId={'pythonTutor'} />

      <Objects nextObject={{ opId: '2' }} objectType={'tuple'} value={'1'} opId={'firstElm'} />

      <PythonTutor variables={[
        { pointObject: { opId: 'list1' }, value: 'c', opId: 'c' },
        { pointObject: { opId: 'list2' }, value: 'd', opId: 'd' },
        { pointObject: { opId: 'list3' }, value: 'x', opId: 'x' }
      ]}
        opId={'pythonTutorFrame1'}
        objects={[{ nextObject: { opId: '2' }, objectType: 'tuple', value: '1', opId: 'firstElm' }]} />
      {/* <SVG width={500} height={500}>
        <Align center>
          <Rect fill={'lightblue'} width={100} height={100} />
          <Rect fill={'magenta'} width={20} height={10} />
        </Align>
      </SVG>
      <SVG width={500} height={500}>
        <Col spacing={5} alignment={'center'}>
          <Rect fill={'lightblue'} width={100} height={100} />
          <Rect fill={'magenta'} width={20} height={10} />
        </Col>
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <Col spacing={5} alignment={'left'}>
          <Rect fill={'magenta'} width={100} height={50} />
          <Col spacing={5} alignment={'left'}>
            <Rect fill={'lightgreen'} width={50} height={20} />
          </Col>
          <Rect fill={'cornflowerblue'} width={50} height={100} />
        </Col>
      </SVG> */}
      {/* {
        <SVG width={500} height={500}>
          <Char value={'a'} opId={'8@A'} marks={['bold', 'italic']} deleted={false} />
        </SVG>
      } */}
      {/* {
        <Bluefish width={500} height={500}>
          <SVGClass width={500} height={500}>
            <ColClass spacing={5} alignment={'left'}>
              <RectClass fill={'magenta'} width={100} height={50} />
              <ColClass spacing={5} alignment={'left'}>
                <RectClass fill={'lightgreen'} width={50} height={20} />
              </ColClass>
              <RectClass fill={'cornflowerblue'} width={50} height={100} />
            </ColClass>
          </SVGClass>
        </Bluefish>
      } */}
      {/* {
        <Bluefish width={500} height={500}>
          <SVGClass width={500} height={500}>
            <CharClass value={'a'} opId={'8@A'} marks={['bold', 'italic']} deleted={false} />
          </SVGClass>
        </Bluefish>
      } */}
      {/* {
        <SVG width={500} height={500}>
          <Rect height={65} width={50} rx={5} fill={'#eee'} />
          <Rect height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
          <Rect height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
          <Text
            contents={'a'}
            fontSize={'30px'}
            fontWeight={true ? 'bold' : 'normal'}
            fontStyle={true ? 'italic' : 'normal'}
          />
          <Text contents={'8@A'} fontSize={'12px'} fill={'#999'} />
        </SVG>
      }
      {
        <SVG width={500} height={500}>
          <Rect fill={'magenta'} width={100} height={50} />
          <Rect fill={'cornflowerblue'} width={50} height={100} x={150} />
        </SVG>
      }
      <br />
      {
        <SVG width={500} height={500}>
          <Col spacing={5} alignment={'left'}>
            <Rect fill={'magenta'} width={100} height={50} />
            <Col spacing={5} alignment={'left'}>
              <Rect fill={'lightgreen'} width={50} height={20} />
            </Col>
            <Rect fill={'cornflowerblue'} width={50} height={100} />
          </Col>
        </SVG>
      }
      {
        <SVG width={500} height={500}>
          <ColHOC spacing={5} alignment={'left'}>
            <Rect fill={'magenta'} width={100} height={50} />
            <ColHOC spacing={5} alignment={'left'}>
              <Rect fill={'lightgreen'} width={50} height={20} />
            </ColHOC>
            <Rect fill={'cornflowerblue'} width={50} height={100} />
          </ColHOC>
        </SVG>
      }
      {
        <SVG width={500} height={500}>
          <ColLayout spacing={5} alignment={'left'}>
            <Rect fill={'magenta'} width={100} height={50} />
            <ColLayout spacing={5} alignment={'left'}>
              <Rect fill={'lightgreen'} width={50} height={20} />
            </ColLayout>
            <Rect fill={'cornflowerblue'} width={50} height={100} />
          </ColLayout>
        </SVG>
      }
      {
        <SVG width={500} height={500}>
          <Row spacing={5} alignment={'top'}>
            <Rect fill={'magenta'} width={100} height={50} />
            <Row spacing={5} alignment={'top'}>
              <Rect fill={'lightgreen'} width={50} height={20} />
            </Row>
            <Rect fill={'cornflowerblue'} width={50} height={100} />
          </Row>
        </SVG>
      } */}
      {/* <Parent /> */}
      {/* <br />
      <div>{render(blobPaperJSTest)}</div>
      <br />
      <div>{render(bertinHotel)}</div>
      <br />
      <div>{render(annotatedDiagram)}</div>
      <br />
      <div>{render(annotatedEquationRef)}</div>
      <br />
      <div>{render(testArrow)}</div>
      <div>{render(annotatedDiagram)}</div>
      <div>
        {render(testRow)}
        {render(testCol)}
        {render(testComponent)}
      </div>
      <br />
      <div>{render(annotatedEquation)}</div>
      <div>
        <svg width="256" height="256">
          {blob(
            {
              seed: Math.random(),
              extraPoints: 8,
              randomness: 4,
              size: 256,
            },
            {
              fill: 'white', // 🚨 NOT SANITIZED
              stroke: 'black', // 🚨 NOT SANITIZED
              strokeWidth: 4,
            },
          )}
        </svg>
      </div> */}
    </div>
  );
}

export default App;
