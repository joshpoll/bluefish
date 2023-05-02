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

export const PythonTutor = withBluefish(function _PythonTutor({
  variables,
  objects,
  rows,
  opId,
}: {
  variables: any;
  objects: any;
  rows: any;
  opId: any;
}) {
  // const globalFrame = useRef(null);
  // const rowRef = useRef(null);

  console.log('got into python tutor');

  // lookup map for the yellow objects
  const objMap = new Map();
  objects.forEach((obj: any) => objMap.set(obj.opId, obj));

  // Lookup map for yellow objects by column
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

  const cols: any[] = [];
  objIdByCol.forEach((values, keys) => {
    const columnObject = { depth: keys, nodes: values };
    cols.push(columnObject);
  });

  // find start and end location for links between objects and objects
  const objectLinks = objects
    .filter((object: any) => object.nextObject !== null)
    .map((object: any, index: any) => {
      return {
        opId: `objectLink${index}`,
        start: { opId: `pointer${object.opId}` },
        end: { opId: `pointed${object.nextObject.opId}` },
      };
    });

  // find start and end locations for links between global frame and objects
  const variableLinks = variables
    .filter((variable: any) => variable.pointObject !== null)
    .map((variable: any, index: any) => {
      return {
        opId: `variableLink${index}`,
        start: { opId: variable.opId },
        end: { opId: `pointed${variable.pointObject.opId}` },
      };
    });

  return (
    <Group name={opId}>
      <GlobalFrame variables={variables} opId={`globalframe` as any} />

      <Group name={`object-matrix` as any}>
        {rows.map((level: any, index: any) => (
          <Row name={`row${index}` as any} spacing={50} alignment={'middle'}>
            {level.nodes.map((obj: any, objIndex: any) =>
              obj == '' ? (
                <Rect
                  name={`row${level.depth}_col${objIndex}` as any}
                  height={60}
                  width={140}
                  fill={'none'}
                  stroke={'none'}
                />
              ) : (
                <Objects {...objMap.get(obj)} />
              ),
            )}
          </Row>
        ))}
        {cols.map((columns, index) => (
          <Col name={`col${index}` as any} spacing={50} alignment={'left'}>
            {columns.nodes.map((objectId: any) => (
              <Ref to={objectId} />
            ))}
          </Col>
        ))}
      </Group>

      <Distribute direction="horizontal" spacing={60}>
        <Ref to={`globalframe`} />
        <Ref to={`object-matrix`} />
      </Distribute>

      <Distribute direction="vertical" spacing={-250}>
        <Ref to={`globalframe`} />
        <Ref to={`object-matrix`} />
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
