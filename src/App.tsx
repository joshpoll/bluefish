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
import { Col, ColHOC, ColLayout } from './components/Col';
import { Row } from './components/Row';
import { Rect } from './components/Rect';
import { Text } from './components/Text';
import { Char, Peritext } from './examples/peritext';
import { CharClass } from './examples/peritextClass';
import { Bluefish } from './components/Bluefish';
import { SVGClass } from './components/SVGClass';
import { RectClass } from './components/RectClass';
import { ColClass } from './components/ColClass';
import { Child, Parent } from './components/TestingRefs';

const blob = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): JSX.Element => {
  return <path {...svgOptions} d={blobs2.svgPath(blobOptions)}></path>;
};

function App() {
  test_blob();
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    const element = ref.current;
    console.log('element', element);
    if (element) {
      setWidth(element.clientWidth);
      setHeight(element.clientHeight);
    }
  }, [ref]);
  // console.log(
  //   'this thing',
  //   <SVG width={500} height={500}>
  //     <Char value={'a'} opId={'8@A'} marks={['bold', 'italic']} deleted={false} />
  //   </SVG>,
  // );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
      <br />
      {/* <Parent>
        <Child ref={ref} /> */}
      {/* <div>test child</div> */}
      {/* </Parent> */}
      {/* <div>width: {width}</div>
      <div>height: {height}</div> */}
      {
        <Peritext
          chars={[
            { value: 'T', opId: '1@A', deleted: false, marks: ['italic'] },
            { value: 'h', opId: '2@A', deleted: true, marks: ['italic'] },
            { value: 'e', opId: '5@B', deleted: false, marks: ['bold', 'italic'] },
            { value: ' ', opId: '6@B', deleted: false, marks: ['bold', 'italic'] },
            { value: 'f', opId: '7@A', deleted: false, marks: ['bold'] },
            { value: 'o', opId: '8@A', deleted: true, marks: [] },
            { value: 'x', opId: '9@A', deleted: false, marks: [] },
          ]}
        />
      }
      <br />
      <SVG width={500} height={500}>
        <Col spacing={5} alignment={'left'}>
          <Rect fill={'magenta'} width={100} height={50} />
          <Col spacing={5} alignment={'left'}>
            <Rect fill={'lightgreen'} width={50} height={20} />
          </Col>
          <Rect fill={'cornflowerblue'} width={50} height={100} />
        </Col>
      </SVG>
      {
        <SVG width={500} height={500}>
          <Char value={'a'} opId={'8@A'} marks={['bold', 'italic']} deleted={false} />
        </SVG>
      }
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
