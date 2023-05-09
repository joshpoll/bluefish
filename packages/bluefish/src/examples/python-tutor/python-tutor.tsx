import { forwardRef, useRef } from 'react';
import { Group, Rect, Align, Ref, SVG, Text, Connector } from '../../main';
import { Col } from '../../components/Col';
import { Row } from '../../components/Row';
import { useName, useNameList, withBluefish } from '../../bluefish';
import React from 'react';
import { Distribute } from '../../components/Distribute';
import { ElmTuple } from './ElmTuple';
import { Variable } from './Variable';
import { GlobalFrame } from './GlobalFrame';
import { Objects } from './Objects';

export const PythonTutor = withBluefish(function ({ variables, objects, rows, opId }: any) {
  const globalFrame = 'globalFrame' as any;
  const objectMatrix = 'objectMatrix' as any;

  // lookup map for the yellow objects
  const objMap = new Map();
  objects.forEach((obj: any) => objMap.set(obj.objectId, obj));

  // lookup map for yellow objects grouped in columns
  const objIdByCol = new Map();

  rows.forEach((rowObject: any) => {
    rowObject.nodes.forEach((node: any, index: any) => {
      objIdByCol.set(
        index,
        (objIdByCol.has(index) ? objIdByCol.get(index) : []).concat([
          node === '' ? `row${rowObject.depth}_col${index}` : node,
        ]),
      );
    });
  });

  const cols: any = [];
  objIdByCol.forEach((values, keys) => {
    const columnObject = { depth: keys, nodes: values };
    cols.push(columnObject);
  });

  const objectValues = objects.map((object: any) => {
    const objectWithPointerInfo = object.objectValues.map((element: any, index: any) => {
      return { ...element, objectId: object.objectId, objectOrder: index };
    });
    return objectWithPointerInfo;
  });

  const objectValuesFlat = objectValues.flat();

  // find start and end location for links between objects and objects
  const objectLinks = objectValuesFlat
    .filter((boxObject: any) => boxObject.type == 'pointer')
    .map((element: any, index: any) => {
      return {
        opId: `objectLink${index}`,
        start: { opId: `elm_${element.objectOrder}_${element.objectId}` },
        end: { opId: `elm_0_${element.pointId}` },
      };
    });

  // find start and end locations for links between global frame and objects
  const variableLinks = variables
    .filter((variable: any) => variable.pointObject !== null)
    .map((variable: any, index: any) => {
      return {
        opId: `variableLink${index}`,
        start: { opId: variable.opId },
        end: { opId: `elm_0_${variable.pointObject.opId}` },
      };
    });

  console.log('these are the cols: ', cols);
  console.log('these are the rows:', rows);

  return (
    <Group name={opId}>
      <GlobalFrame variables={variables} opId={'globalFrame'} name={globalFrame} />

      <Group name={objectMatrix}>
        {rows.map((level: any, index: any) => (
          <Row name={`row${index}` as any} spacing={100} alignment={'middle'}>
            {level.nodes.map((obj: any, objIndex: any) =>
              obj == '' ? (
                <Rect
                  name={`row${level.depth}_col${objIndex}` as any}
                  height={60}
                  width={140}
                  fill={'none'}
                  stroke={'red'}
                />
              ) : (
                <Objects {...objMap.get(obj)} />
              ),
            )}
          </Row>
        ))}
        {/* {cols.map((columns: any, index: any) => (
          <Col alignment={'left'} name={`col${index}` as any} spacing={50}>
            {columns.nodes.map((objectId: any) => (
              <Ref to={objectId} />
            ))}
          </Col>
        ))} */}
        {cols.map((columns: any, index: any) => (
          <Distribute direction={'vertical'} name={`col${index}` as any} spacing={50}>
            {columns.nodes.map((objectId: any) => (
              <Ref to={objectId} />
            ))}
          </Distribute>
        ))}
      </Group>

      <Distribute direction={'horizontal'} spacing={60}>
        <Ref to={globalFrame} />
        <Ref to={objectMatrix} />
      </Distribute>

      <Distribute direction={'vertical'} spacing={-250}>
        <Ref to={globalFrame} />
        <Ref to={objectMatrix} />
      </Distribute>

      {objectLinks.map((link: any) => (
        <Group>
          <Link {...link} />
        </Group>
      ))}

      {variableLinks.map((link: any) => (
        <Group>
          <Link {...link} />
        </Group>
      ))}
    </Group>
  );
});

export const Link = withBluefish(function _Link({ opId, start, end }: { opId: any; start: any; end: any }) {
  const groupRef = useName(opId);
  const startName = useName(start.opId);
  const endName = useName(end.opId);
  console.log('found this connector: ', opId, start, end);
  return (
    <Group>
      <Connector
        name={opId}
        $from={'center'}
        $to={'centerLeft'}
        stroke={'cornflowerblue'}
        strokeWidth={3}
        strokeDasharray={0}
      >
        <Ref to={start.opId} />
        <Ref to={end.opId} />
      </Connector>
    </Group>
  );
});
