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
import { alphabet, GoGTest } from './examples/grammars/gog/examples/test';
import { rasterize } from './rasterize';
import { Label, LabelTest } from './examples/label';
import labelLayout, { Anchors } from './components/Label/LabelLayout';
import { PointLabel } from './components/Label/PointLabel';
import { Circle, Line, Padding, Ref, Space, useBluefishContext } from './main';
// import { GoTree } from './examples/gotree';
import { driving } from './examples/grammars/gog/examples/driving';
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
// import { Tree4 } from './examples/grammars/gotree/gotree-ex4';
// import { RELATIONS, Tree5 } from './examples/grammars/gotree/gotree-ex5';
import { RectPath } from './examples/grammars/gog/marks/RectPath';
import { Polio } from './examples/grammars/gog/examples/polio';
// import { AlignNew } from './components/AlignNew';
import { Molecule } from './examples/chemistry/Molecule';
import { Distribute } from './components/Distribute';
// import { Tree5 as Tree6 } from './examples/grammars/gotree/gotree-ex6 copy';
// import { Matrix } from './examples/grammars/gog/examples/neo/Matrix';
import { Background } from './components/Background';
// import { PythonTutor } from './python-tutor';
// import { Tree5 as Tree6 } from './examples/grammars/gotree/gotree-ex6 copy';
// import { Matrix } from './examples/grammars/gog/examples/neo/Matrix';
import { Recipe } from './examples/Recipe';
import { Euclid } from './examples/euclid/euclid';
import { BertinHotel } from './examples/bertin/bertin';
import { Playfair } from './examples/playfair/playfair';
import { UpSet } from './examples/upset/upset';
import { DrivingSafety } from './examples/driving-safety/driving-safety';
import { Tree1 } from './examples/grammars/gotree/1-SingleVisualization';
import { CircleNode, RectNode, TextNode, Tree2 } from './examples/grammars/gotree/2-AbstractedNode';
import { Tree3, link, row, col, none, rect, circle, text, contain } from './examples/grammars/gotree/3-EncodableTree';
import { Contain } from './components/Contain';
import { Tree4 } from './examples/grammars/gotree/3-EncodableTree - FRESH';
import { flexibleRect } from './examples/grammars/gotree/3-EncodableTree';
import { Cars0, Cars1, Cars2, Cars3 } from './examples/cars/cars';
// import { Molecule } from './examples/chemistry/Molecule';
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
      <br />
      <br />
      <br />
      <br />
      {/* <SVG width={500} height={500}>
        <Contain padding={{ all: 20 }}>
          <Rect width={300} height={300} fill={'blue'} />
          <Rect fill={'red'} />
        </Contain>
      </SVG> */}
      {/* <svg width={500} height={500}>
        <ColUseState spacing={10}>
          <RectUseState width={100} height={100} fill={'red'} />
          <RectUseState width={100} height={100} fill={'green'} />
          <RectUseState width={100} height={100} fill={'blue'} />
        </ColUseState>
      </svg>
      <br /> */}
      {/* <SVG width={500} height={1000}>
        <DrivingSafety />
      </SVG> */}
      {/* <SVG width={500} height={300}>
        <Col spacing={5} alignment={'center'}>
          <Padding left={40} top={10} right={20} bottom={30}>
            <Plot
              height={200}
              data={driving}
              x={({ width }) =>
                scaleLinear([_.min(driving.map((d) => +d.miles))!, _.max(driving.map((d) => +d.miles))!], [0, width])
              }
              y={({ height }) =>
                scaleLinear([_.min(driving.map((d) => +d.gas))!, _.max(driving.map((d) => +d.gas))!], [height, 0])
              }
              color={() => () => 'black'}
            >
              <NewLine name={line} x={'miles'} y={'gas'} />
              <NewDot
                x={'miles'}
                y={'gas'}
                label={{
                  field: 'year',
                  avoid: [
                    
                  ],
                }}
              />
            </Plot>
          </Padding>
          <Text contents={'this is a test caption'} />
        </Col>
      </SVG> */}
      <SVG width={1000} height={500}>
        <UpSet />
      </SVG>
      <SVG width={1000} height={500}>
        <Playfair />
      </SVG>
      {/* <SVG width={500} height={500}>
        <BertinHotel />
      </SVG> */}
      <SVG width={500} height={500}>
        <Euclid />
      </SVG>
      {/* <SVG width={500} height={500}>
        <Recipe
          recipe={[
            {
              type: 'ingredient',
              id: 1,
              name: '1/2 cup (50 g) onion',
            },
            {
              type: 'ingredient',
              id: 2,
              name: '2 tablespoons (30 g) bacon grease',
            },
          ]}
        />
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <Matrix />
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <AlignNew x={250} y={250} alignment="centerHorizontally">
          <Rect name={autoAssign1} width={100} fill={'red'} />
          <Rect name={autoAssign2} height={20} width={100} fill={'green'} />
          <Rect name={autoAssign3} width={100} fill={'blue'} />
        </AlignNew>
        <Distribute direction="vertical" spacing={10} total={200}>
          <Ref to={autoAssign1} />
          <Ref to={autoAssign2} />
          <Ref to={autoAssign3} />
        </Distribute>
      </SVG>
      <SVG width={500} height={500}>
        <AlignNew x={250} y={250} alignment="centerHorizontally">
          <Line name={fixed1} x1={20} y1={20} x2={20} y2={30} strokeWidth={2} stroke={'black'} />
          <Text name={fixed2} contents={'1'} />
        </AlignNew>
        <Distribute direction="vertical" spacing={10}>
          <Ref to={fixed1} />
          <Ref to={fixed2} />
        </Distribute>
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <AlignNew x={250} y={250}>
          <Line guidePrimary="bottomCenter" x1={20} y1={20} x2={20} y2={30} strokeWidth={2} stroke={'black'} />
          <Text guidePrimary="topCenter" contents={'1'} />
        </AlignNew>
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <AlignNew x={250} y={250}>
          <Rect guidePrimary="bottomCenter" width={100} height={100} fill={'firebrick'} />
          <Rect guidePrimary="topCenter" width={20} height={20} fill={'lightgreen'} />
        </AlignNew>
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <AlignNew x={250} y={250} alignment="center">
          <Rect width={100} height={100} fill={'firebrick'} />
          <Rect width={20} height={500} fill={'lightgreen'} />
        </AlignNew>
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <Group> */}
      {/* <Group>
            <Col spacing={5} alignment={'center'}>
              <Line x1={20} y1={20} x2={20} y2={30} strokeWidth={2} stroke={'black'} /> */}
      {/* <Text contents={'1'} /> */}
      {/* <Rect width={20} height={20} fill={'red'} />
            </Col>
          </Group> */}
      {/* <Group> */}
      {/* <Line name={ex1} x1={50} y1={20} x2={50} y2={30} strokeWidth={2} /> */}
      {/* <Rect name={ex1} width={20} height={20} fill={'red'} /> */}
      {/* <Text contents={'2'} /> */}
      {/* <Rect name={ex2} width={20} height={20} fill={'blue'} /> */}
      {/* <Align centerHorizontally={[<Ref to={ex1} />, <Ref to={ex2} />]} />
            <Space vertically by={5}>
              <Ref to={ex1} />
              <Ref to={ex2} />
            </Space> */}
      {/* <Col spacing={5} alignment={'center'}>
              <Ref to={ex1} />
              <Ref to={ex2} />
            </Col> */}
      {/* <Col spacing={5} alignment={'center'}>
              <Line x1={50} y1={20} x2={50} y2={30} strokeWidth={2} /> */}
      {/* <Text contents={'2'} /> */}
      {/* <Rect width={20} height={20} fill={'red'} /> */}
      {/* </Col> */}
      {/* </Group>
        </Group>
      </SVG> */}
      <SVG width={500} height={500}>
        <Cars0 />
      </SVG>
      <SVG width={500} height={500}>
        <Cars1 />
      </SVG>
      <SVG width={500} height={500}>
        <Cars2 />
      </SVG>
      <SVG width={500} height={500}>
        <Cars3 />
      </SVG>
      <SVG width={500} height={500}>
        <Polio />
      </SVG>
      {/* <SVG width={500} height={500}>
        <RectPath
          x={Math.PI / 2}
          y={10}
          width={Math.PI / 2}
          height={20}
          xyScale={({ width, height }) =>
            (theta, r) => ({
              x: width / 2 + r * Math.cos(theta),
              y: height / 2 + r * Math.sin(theta),
            })}
          fill={'firebrick'}
          stroke={'white'}
          strokeWidth={2}
        />
        <RectPath
          x={Math.PI}
          y={10}
          width={Math.PI / 2}
          height={20}
          xyScale={({ width, height }) =>
            (theta, r) => ({
              x: width / 2 + r * Math.cos(theta),
              y: height / 2 + r * Math.sin(theta),
            })}
          fill={'cornflowerblue'}
          stroke={'white'}
          strokeWidth={2}
        />
        <RectPath
          x={Math.PI * 1.5}
          y={10}
          width={Math.PI / 2}
          height={20}
          xyScale={({ width, height }) =>
            (theta, r) => ({
              x: width / 2 + r * Math.cos(theta),
              y: height / 2 + r * Math.sin(theta),
            })}
          fill={'coral'}
          stroke={'white'}
          strokeWidth={2}
        />
        <RectPath
          x={Math.PI * 2}
          y={10}
          width={Math.PI / 2}
          height={20}
          xyScale={({ width, height }) =>
            (theta, r) => ({
              x: width / 2 + r * Math.cos(theta),
              y: height / 2 + r * Math.sin(theta),
            })}
          fill={'olive'}
          stroke={'white'}
          strokeWidth={2}
        />
      </SVG> */}
      <SVG width={500} height={500}>
        <Tree4
          data={{
            value: 0,
            subtrees: [
              {
                value: 0.5,
                subtrees: [{ value: 0.75 }, { value: 0.75 }],
              },
              { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
            ],
          }}
          encoding={{
            node: flexibleRect as any,
            link: none,
            rootSubTree: contain({ padding: { top: 20, bottom: 20, left: 20, right: 20 } }),
            subTreeSubTree: col({ alignment: 'right', spacing: 20 }),
          }}
          overdraw={false}
        />
      </SVG>
      <SVG width={500} height={500}>
        <Padding all={20}>
          <Row spacing={20} alignment={'top'}>
            <Tree4
              data={{
                value: 0,
                subtrees: [
                  {
                    value: 0.5,
                    subtrees: [{ value: 0.75 }, { value: 0.75 }],
                  },
                  { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                ],
              }}
              encoding={{
                node: flexibleRect as any,
                link: none,
                rootSubTree: contain({ padding: { top: 20, bottom: 20, left: 20, right: 20 } }),
                subTreeSubTree: col({ alignment: 'right', spacing: 20 }),
              }}
              overdraw={false}
            />
            <Tree4
              data={{
                value: 0,
                subtrees: [
                  { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                  { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                ],
              }}
              encoding={{
                node: rect as any,
                link: none,
                rootSubTree: col({ alignment: 'left', spacing: 5 }),
                subTreeSubTree: col({ alignment: 'left', spacing: 5 }),
              }}
            />
            <Tree4
              data={{
                value: 0,
                subtrees: [
                  { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                  { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                ],
              }}
              encoding={{
                node: circle as any,
                link: link({ to: 'centerLeft' }),
                rootSubTree: row({ alignment: 'bottom' }),
                subTreeSubTree: col(),
              }}
            />
          </Row>
        </Padding>
      </SVG>
      <SVG width={500} height={500}>
        <Col spacing={50} alignment="center">
          {/* <Tree2
            data={{
              value: 0,
              subtrees: [
                { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
              ],
            }}
            $node={RectNode}
          /> */}
          {/* <Tree2
            data={{
              value: 0,
              subtrees: [
                { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
                { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
              ],
            }}
            $node={TextNode}
          /> */}
        </Col>
      </SVG>
      <SVG width={500} height={300}>
        {/* <Tree1
          data={{
            value: 0,
            subtrees: [
              { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
              { value: 0.5, subtrees: [{ value: 0.75 }, { value: 0.75 }] },
            ],
          }}
        /> */}
      </SVG>
      {/* <SVG width={500} height={300}>
        <Col spacing={10} alignment={'center'}>
          <Tree1
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
          />
          <Text contents={'flat component'} />
        </Col>
      </SVG> */}
      {/* <SVG width={500} height={300}>
        <Col spacing={10} alignment={'center'}>
          <Tree2
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
          />
          <Text contents={'node factored out'} />
        </Col>
      </SVG> */}
      {/* <SVG width={500} height={300}>
        <Col spacing={10} alignment={'center'}>
          <Tree3
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
            encoding={{
              node: CustomNode,
            }}
          />
          <Text contents={'node in encoding'} />
        </Col>
      </SVG> */}
      {/* <SVG width={500} height={300}>
        <Col spacing={10} alignment={'center'}>
          <Tree4
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
            encoding={{
              node: CustomNode,
            }}
          />
          <Text contents={'link in encoding'} />
        </Col>
      </SVG> */}
      {/* <SVG width={500} height={500}>
        <Col spacing={10} alignment={'center'}> */}
      {/* <Tree6
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
            encoding={{
              node: CustomNode,
              link: () => null,
              rootSubtree: { row: {} },
              subtreeSubtree: { row: {} },
            }}
          /> */}
      {/* <Tree5
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
            encoding={{
              node: CustomNode,
              link: () => null,
              rootSubtree: RELATIONS.row({}),
              subtreeSubtree: RELATIONS.row({}),
            }}
          /> */}
      {/* <Tree5
            data={{
              value: 1,
              subtrees: [
                {
                  value: 2,
                  subtrees: [{ value: 3 }, { value: 4 }],
                },
                {
                  value: 5,
                  subtrees: [{ value: 6 }, { value: 7 }],
                },
              ],
            }}
            encoding={{
              node: CustomNode,
              // link: () => null,
              rootSubtree: RELATIONS.row({}),
              subtreeSubtree: RELATIONS.col({}),
            }}
          /> */}
      {/* <Text contents={'relations in encoding'} /> */}
      {/* </Col>
      </SVG> */}
      <br />
      {/* <SVG width={800} height={200}>
        <Padding left={40} top={10} right={20} bottom={30}>
          <Plot
            data={alphabet}
            x={({ width }) =>
              scaleBand(
                alphabet.map((d) => d.letter),
                [0, width],
              ).padding(0.1)
            }
            y={({ height }) => scaleLinear([0, _.max(alphabet.map((d) => +d.frequency))!], [0, height])}
            color={() =>
              scaleSequential(interpolateBlues).domain([
                _.min(alphabet.map((d) => +d.frequency))!,
                _.max(alphabet.map((d) => +d.frequency))!,
              ])
            }
          > */}
      {/* <BarY encodings={{ x: 'letter', y: 'frequency', color: 'frequency' }} /> */}
      {/* <NewBarY spacing={5} x={'letter'} y={'frequency'} color={'frequency'} /> */}
      {/* <BarYWithBFN encodings={{ x: 'letter', y: 'frequency', color: 'frequency' }} /> */}
      {/* </Plot>
        </Padding>
      </SVG> */}
      {/* <PeritextSymbol
        chars={[
          { value: 'T', opId: '1@A', deleted: false, marks: ['italic'] },
          { value: 'h', opId: '2@A', deleted: true, marks: ['italic'] },
          // { value: 'r', opId: '20@A', deleted: true, marks: ['italic'] },
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
            start: { opId: '5@B' },
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
      /> */}
      {/* <SVG width={500} height={500}>
        <Col alignment={'center'} spacing={5}>
          <TreeSymbol
            data={{
              name: 'A',
              value: {
                value: '7',
                marks: ['bold', 'italic'],
              },
              subtrees: [
                {
                  name: 'B',
                  value: {
                    value: '4',
                    marks: ['bold', 'italic'],
                  },
                  subtrees: [
                    {
                      name: 'C',
                      value: {
                        value: '2',
                        marks: ['bold', 'italic'],
                      },
                    },
                    {
                      name: 'D',
                      value: {
                        value: '2',
                        marks: ['bold', 'italic'],
                      },
                    },
                  ],
                },
                {
                  name: 'E',
                  value: {
                    value: '3',
                    marks: ['bold', 'italic'],
                  },
                  subtrees: [
                    {
                      name: 'F',
                      value: {
                        value: '1',
                        marks: ['bold', 'italic'],
                      },
                    },
                    {
                      name: 'G',
                      value: {
                        value: '1',
                        marks: ['bold', 'italic'],
                      },
                    },
                  ],
                },
              ],
            }}
          />
          <TreeSymbol
            data={{
              name: 'A',
              value: {
                value: '7',
                marks: ['bold', 'italic'],
              },
              subtrees: [
                {
                  name: 'B',
                  value: {
                    value: '4',
                    marks: ['bold', 'italic'],
                  },
                  subtrees: [
                    {
                      name: 'C',
                      value: {
                        value: '2',
                        marks: ['bold', 'italic'],
                      },
                    },
                    {
                      name: 'D',
                      value: {
                        value: '2',
                        marks: ['bold', 'italic'],
                      },
                    },
                  ],
                },
                {
                  name: 'E',
                  value: {
                    value: '3',
                    marks: ['bold', 'italic'],
                  },
                  subtrees: [
                    {
                      name: 'F',
                      value: {
                        value: '1',
                        marks: ['bold', 'italic'],
                      },
                    },
                    {
                      name: 'G',
                      value: {
                        value: '1',
                        marks: ['bold', 'italic'],
                      },
                    },
                  ],
                },
              ],
            }}
          />
        </Col>
      </SVG>
      <br />
      <SVG width={500} height={500}>
        <Col spacing={10} alignment={'center'}>
          <CharSymbol value={'b'} opId={'8@A'} marks={['bold', 'italic']} deleted={false} />
          <CharSymbol value={'a'} opId={'8@A'} marks={['bold', 'italic']} deleted={false} />
        </Col>
      </SVG> */}
      {/* <svg width={500} height={500}>
        <RectUseState x={20} y={20} width={100} height={100} fill={'green'} />
      </svg> */}
    </div>
  );
}

export default App;
