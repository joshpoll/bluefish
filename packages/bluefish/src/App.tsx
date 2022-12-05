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
import { Col } from './components/Col';
import { Row } from './components/Row';
import { Rect } from './components/Rect';
import { Text } from './components/Text';
import { Char, Peritext } from './examples/peritext';
import { Bluefish } from './components/Bluefish';
// import { Child, Parent } from './components/TestingRefs';
import { Child, Parent } from './components/TestingContext';
import { Align } from './components/Align';
import { GoGTest } from './examples/grammars/gog/examples/test';
import { rasterize } from './rasterize';
import { Label, LabelTest } from './examples/label';
import { Group } from './components/Group';
import labelLayout, { Anchors } from './components/Label/LabelLayout';
import { PointLabel } from './components/Label/PointLabel';
import { Circle, Ref, useBluefishContext } from './main';
import { GoTree } from './examples/gotree';
import { driving } from './examples/grammars/gog/examples/driving';
import { Plot2 as Plot } from './examples/grammars/gog/Plot';
import { scaleLinear } from 'd3-scale';
import { GlobalFrame } from './python-tutor';
import { NewLine } from './examples/grammars/gog/marks/NewLine';
import { NewDot } from './examples/grammars/gog/marks/NewDot';
import { resolveRef } from './components/Ref';
import { BluefishContextValue } from './bluefish';
import { Rect as Rect2 } from './components/Rect2';
import { Col as Col2 } from './components/Col2';

const blob = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): JSX.Element => {
  return <path {...svgOptions} d={blobs2.svgPath(blobOptions)}></path>;
};

const copyAttr = <T,>(context: BluefishContextValue, name: string, prop: string): T => {
  const measurable = resolveRef(name, context.bfMap);
  return measurable.props[prop] as T;
};

function App() {
  const [startOpId, setStartOpId] = React.useState('5@B');
  const [rangeval, setRangeval] = React.useState(undefined);

  const [circle, setCircle] = React.useState<SVGCircleElement | null>(null);
  const [pngUrl, setPngUrl] = React.useState<string | null>(null);

  const [text1, setText1] = React.useState<SVGTextElement | null>(null);
  const [text2, setText2] = React.useState<SVGTextElement | null>(null);
  const [text3, setText3] = React.useState<SVGTextElement | null>(null);
  const [circle1, setCircle1] = React.useState<SVGCircleElement | null>(null);
  const [circle2, setCircle2] = React.useState<SVGCircleElement | null>(null);
  const [circle3, setCircle3] = React.useState<SVGCircleElement | null>(null);

  // React.useEffect(() => {
  //   if (
  //     text1 === null ||
  //     text2 === null ||
  //     text3 === null ||
  //     circle1 === null ||
  //     circle2 === null ||
  //     circle3 === null
  //   ) {
  //     return;
  //   }

  //   console.log('layout', text1);

  //   labelLayout({
  //     // labels and anchor points
  //     texts: [
  //       { label: text1, ref: circle1 },
  //       { label: text2, ref: circle2 },
  //       { label: text3, ref: circle3 },
  //     ],
  //     // canvas size (provided by parent in Bluefish)
  //     size: [500, 500],
  //     // optional sorting function to determine label layout priority order
  //     compare: undefined,
  //     // label offset from anchor point
  //     offset: [1],
  //     // offset orientation (e.g. 'top-left')
  //     anchor: Anchors,
  //     // optional list of elements to avoid (like a line mark)
  //     avoidElements: [],
  //     // whether or not we should avoid the anchor points (circle1, circle2, circle3)
  //     avoidRefElements: true,
  //     // padding around canvas to allow labels to be partially offscreen
  //     padding: 0,
  //   });
  // }, [text1, text2, text3, circle1, circle2, circle3]);

  // use canvg to convert circle to png
  React.useEffect(() => {
    async function convert() {
      if (circle !== null) {
        const canvas = await rasterize(circle, { width: 100, height: 100 });
        const blob = await canvas.convertToBlob();
        const pngUrl = URL.createObjectURL(blob);
        setPngUrl(pngUrl);
      }
    }
    convert();
  }, [circle]);

  return (
    <div className="App">
      <SVG width={300} height={300}>
        <Group>
          <Col2 name={'$2 col2'} spacing={5} alignment={'center'}>
            <Rect2 name={'$2 rect2-1'} width={20} height={10} fill="cornflowerblue" />
            <Rect2 name={'$2 rect2-2'} width={10} height={20} fill="green" />
          </Col2>
        </Group>
      </SVG>
      <br />
      <SVG width={300} height={300}>
        <Rect2 x={30} y={50} width={20} height={10} fill="cornflowerblue" />
      </SVG>
      <br />
      {/* <SVG width={500} height={300}>
        <GlobalFrame
          variables={[
            { pointObject: { opId: 'list1' }, name: 'c', value: '4', opId: 'cID' },
            { pointObject: { opId: 'list2' }, name: 'd', value: '1', opId: 'dID' },
            { pointObject: { opId: 'list3' }, name: 'x', value: '5', opId: 'xID' },
          ]}
          opId={'globalFrame'}
        />
      </SVG> */}
      {/* <SVG width={500} height={300}>
        <Plot
          data={driving}
          width={500}
          height={300}
          margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
          x={({ width }) => scaleLinear([0, _.max(driving.map((d) => +d.miles))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(driving.map((d) => +d.gas))!], [height, 0])}
          color={() => () => 'black'}
        >
          <Plot.Line x={'miles'} y={'gas'} />
          <Plot.Dot x={'miles'} y={'gas'} label={'year'} />
        </Plot>
      </SVG>
      <br />
      <SVG width={500} height={300}>
        <Plot
          data={driving}
          width={500}
          height={300}
          margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
          x={({ width }) => scaleLinear([0, _.max(driving.map((d) => +d.miles))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(driving.map((d) => +d.gas))!], [height, 0])}
          color={() => () => 'black'}
        >
          <Plot.Line x={'miles'} y={'gas'} />
          <Plot.Dot x={'miles'} y={'gas'} />
        </Plot>
      </SVG>
      <br /> */}
      <SVG width={500} height={300}>
        <Rect name={'rect'} x={10} y={10} width={40} height={20} fill={'cornflowerblue'} />
        {/* <CopyAttr<number> name={'rect'} prop={'y'}>
          {(y) => <Rect x={10} y={y} width={40} height={20} fill={'cornflowerblue'} />}
        </CopyAttr>
        <Rect x={10} y={copyAttr<number>('rect', 'y')} width={40} height={20} fill={'cornflowerblue'} /> */}
        {/* do the above, but place the callback in the props instead of the children */}
        {/* <CopyAttr<number>
          name={'rect'}
          prop={'y'}
          callback={(y: number) => <Rect x={10} y={y} width={40} height={20} fill={'cornflowerblue'} />}
        />
        <Copy name={'rect'} /> */}
      </SVG>
      <br />
      <SVG width={500} height={300}>
        <Col spacing={5} alignment={'center'}>
          <Plot
            data={driving /* .slice(0, 16) */}
            width={500}
            height={300}
            margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
            x={({ width }) => scaleLinear([0, _.max(driving.map((d) => +d.miles))!], [0, width])}
            y={({ height }) => scaleLinear([0, _.max(driving.map((d) => +d.gas))!], [height, 0])}
            color={() => () => 'black'}
          >
            <NewLine name={'line'} x={'miles'} y={'gas'} />
            <NewDot x={'miles'} y={'gas'} label={'year'} />
          </Plot>
          <Row spacing={5} alignment={'top'}>
            <Col spacing={2} alignment={'center'}>
              <Text contents={'Cheap gas'} fontSize={'10pt'} />
              <Text contents={'1956-1972'} />
            </Col>
            <Col spacing={2} alignment={'center'}>
              <Text contents={'Oil embargo'} fontSize={'10pt'} />
              <Text contents={'1973-1974'} />
            </Col>
            <Col spacing={2} alignment={'center'}>
              <Text contents={'Energy crisis'} fontSize={'10pt'} />
              <Text contents={'1978-1981'} />
            </Col>
          </Row>
        </Col>
      </SVG>
      <br />
      <SVG width={500} height={300}>
        <Plot
          data={driving /* .slice(0, 16) */}
          width={500}
          height={300}
          margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
          x={({ width }) => scaleLinear([0, _.max(driving.map((d) => +d.miles))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(driving.map((d) => +d.gas))!], [height, 0])}
          color={() => () => 'black'}
        >
          <NewLine name={'line'} x={'miles'} y={'gas'} />
          <NewDot x={'miles'} y={'gas'} label={'year'} />
        </Plot>
      </SVG>
      <br />
      <SVG width={500} height={300}>
        <Plot
          data={driving}
          width={500}
          height={300}
          margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
          x={({ width }) => scaleLinear([0, _.max(driving.map((d) => +d.miles))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(driving.map((d) => +d.gas))!], [height, 0])}
          color={() => () => 'black'}
        ></Plot>
      </SVG>
      <br />
      <br />
      <br />
      <br />
      {/* <SVG width={200} height={200}>
        <Text name={'text'} contents={'b'} fontSize={'30px'} />
        <Rect name={'rect'} x={20} y={50} width={50} height={65} rx={5} fill={'cornflowerblue'} />
        <Text name={'label'} contents={'@A'} fontSize={'12px'} fill={'#999'} />
        <Align>
          {{
            the: 'center',
            of: <Ref to={'text'} />,
            to: <Ref to={'rect'} />,
          }}
        </Align>
        <Align
          {...{
            the: 'center',
            of: <Ref to={'label'} />,
            to: {
              the: 'topCenter',
              of: <Ref to={'rect'} />,
            },
          }}
        />
      </SVG> */}
      <GoTree
        tree={
          {
            name: 'A',
            value: 7,
            treeChildren: [
              {
                name: 'B',
                value: 4,
                treeChildren: [
                  { name: 'C', value: 2 },
                  { name: 'D', value: 2 },
                ],
              },
              {
                name: 'E',
                value: 3,
                treeChildren: [
                  { name: 'F', value: 2 },
                  { name: 'G', value: 1 },
                ],
              },
            ],
          }
          // {
          //   name: 'E',
          //   value: 3,
          //   treeChildren: [
          //     { name: 'F', value: 2 },
          //     { name: 'G', value: 1 },
          //   ],
          // }
        }
      />
      <br />
      {/* <SVG width={200} height={200}>
        <Group>
          <Rect name={'rect1'} x={25} y={25} width={20} height={15} fill={'cornflowerblue'} />
          <Rect name={'rect2'} x={70} y={55} width={20} height={20} fill={'cornflowerblue'} />
          <Rect name={'rect3'} x={95} y={60} width={10} height={10} fill={'cornflowerblue'} />
          <PointLabel
            texts={[
              { label: <Text contents={'test label 1'} />, ref: 'rect1' },
              {
                label: (
                  <Group>
                    <Align center>
                      <Circle r={7} fill={'firebrick'} />
                      <Circle r={4} fill={'coral'} /> */}
      {/* <Text contents={'2'} fill={'white'} fontSize={'12px'} /> */}
      {/* </Align>
                  </Group>
                ),
                ref: 'rect2',
              },
              { label: <Text contents={'test label 3'} />, ref: 'rect3' },
            ]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        </Group>
      </SVG> */}
      <br />
      {/* <SVG width={200} height={200}>
        <Group> */}
      {/* <Circle name={'circle1'} cx={50} cy={50} r={10} fill={'cornflowerblue'} />
          <Circle name={'circle2'} cx={100} cy={50} r={10} fill={'cornflowerblue'} />
          <Circle name={'circle3'} cx={100} cy={100} r={10} fill={'cornflowerblue'} /> */}
      {/* <Rect name={'rect1'} x={25} y={25} width={10} height={10} fill={'cornflowerblue'} />
          <Rect name={'rect2'} x={40} y={55} width={10} height={10} fill={'cornflowerblue'} />
          <Rect name={'rect3'} x={75} y={60} width={10} height={10} fill={'cornflowerblue'} />
          <PointLabel
            texts={[
              { label: <Text contents={'test label 1'} />, ref: 'rect1' },
              { label: <Text contents={'test label 2'} />, ref: 'rect2' },
              { label: <Text contents={'test label 3'} />, ref: 'rect3' },
            ]}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        </Group>
      </SVG> */}
      <br />
      <svg width="200" height="200">
        <text
          ref={(node) => {
            setText1(node as any);
          }}
          x={25}
          y={25}
        >
          text1
        </text>
        <circle
          ref={(node) => {
            setCircle1(node as any);
          }}
          cx={25}
          cy={25}
          fill={'black'}
          r={5}
        />
        <text
          ref={(node) => {
            setText2(node as any);
          }}
          x={40}
          y={25}
        >
          text2
        </text>
        <circle
          ref={(node) => {
            setCircle2(node as any);
          }}
          cx={40}
          cy={25}
          fill={'black'}
          r={5}
        />
        <text
          ref={(node) => {
            setText3(node as any);
          }}
          x={50}
          y={50}
        >
          text3
        </text>
        <circle
          ref={(node) => {
            setCircle3(node as any);
          }}
          cx={50}
          cy={50}
          fill={'black'}
          r={5}
        />
      </svg>
      {/* <GoGTest /> */}
      {/* <LabelTest /> */}
      {/* <SVG width={500} height={500}>
        <Group>
          <Label>
            <Rect height={65} width={50} rx={5} fill={'#eee'} />
          </Label>
        </Group>
      </SVG> */}
      <svg width="100" height="100">
        <circle
          ref={(node) => {
            setCircle(node as any);
          }}
          cx="50"
          cy="50"
          r="40"
          stroke="green"
          strokeWidth="4"
          fill="yellow"
        />
      </svg>
      <br />
      {`${circle?.outerHTML}`}
      <br />
      <img src={pngUrl ?? undefined} alt={''} />
      <br />
      <input
        type="range"
        className="custom-range"
        min="0"
        max="20"
        // step="0.25"
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
      {/* <SVG width={1000} height={1000}>
        <Row name={'test-row'} spacing={rangeval ? +rangeval : 10} alignment={'middle'}>
          <Rect fill={'red'} width={100} height={100} />
          <Rect fill={'blue'} width={100} height={100} />
          <Rect fill={'green'} width={100} height={100} />
        </Row>
      </SVG> */}
      <Peritext
        spacing={rangeval}
        chars={[
          { value: 'T', opId: '1@A', deleted: false, marks: ['italic'] },
          { value: 'h', opId: '2@A', deleted: true, marks: ['italic'] },
          { value: 'r', opId: '20@A', deleted: true, marks: ['italic'] },
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
