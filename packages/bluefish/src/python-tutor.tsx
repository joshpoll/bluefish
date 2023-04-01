import { forwardRef, useRef } from 'react';
import { Group, Rect, Space, Align, Ref, SVG, Text, Connector } from './main';
import { Col } from './components/Col';
import { Row } from './components/Row';
import { useName, useNameList, withBluefish } from './bluefish';
import React from 'react';

const Variable = withBluefish(function _Variable({ data }: { data: any }) {
  const { pointObject, name, value, opId } = data;

  // References
  const valueName = useName('value');
  const box = useName('box');
  const boxBorderLeft = useName('boxBorderLeft');
  const boxBorderBottom = useName('boxBorderBottom');
  const variable = useName('variable');

  // Declares font used in Python Tutor Diagrams
  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group>
      {/* Creates frame of Variable component (text label & box for value) */}
      <Space name={variable} horizontally by={5}>
        <Text contents={name} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
        <Rect name={box} height={40} width={40} fill={'#e2ebf6'} />
      </Space>
      {/* Creates left and bottom edge borders */}
      <Rect name={boxBorderLeft} height={40} width={2} fill={'#a6b3b6'} />
      <Rect name={boxBorderBottom} height={2} width={40} fill={'#a6b3b6'} />
      {/* Creates text labels of variable */}
      <Text name={valueName} contents={value} fontFamily={fontFamily} fontSize={'24px'} fill={'black'} />
      {/* Align text and border components to variable frame */}
      <Align bottomCenter={[<Ref to={boxBorderBottom} />, <Ref to={box} />]}></Align>
      <Align centerLeft={[<Ref to={boxBorderLeft} />, <Ref to={box} />]}></Align>
      <Align topCenter={[<Ref to={valueName} />, <Ref to={box} />]}></Align>
    </Group>
  );
});

export const GlobalFrame = withBluefish(function _GlobalFrame({ variables, opId }: { variables: any; opId: any }) {
  // References
  const frame = useName('frame');
  const opIdLabel = useName('opIdLabel');
  const frameVariables = useName('frameVariables');
  const frameBorder = useName('frameBorder');
  const groupName = useName(opId);

  // Font declaration
  const fontFamily = 'Andale mono, monospace';

  return (
    <Group name={groupName}>
      {/* Global Frame and relevant text */}
      <Rect name={frame} height={300} width={200} fill={'#e2ebf6'} />
      <Rect name={frameBorder} height={300} width={5} fill={'#a6b3b6'} />
      <Text name={opIdLabel} contents={'Global Frame'} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
      <Align topCenter={[<Ref to={opIdLabel} />, <Ref to={frame} />]}></Align>
      {/* TODO: this Space and Align should be a Col, but Col overwrites *all* placeable positions
            even though opIdLabel has already been placed */}
      <Space vertically by={10}>
        <Ref to={opIdLabel} />
        <Col name={frameVariables} spacing={10} alignment={'right'}>
          {variables.map((variable: any) => (
            <Variable data={variable} />
          ))}
        </Col>
      </Space>
      <Align right={[<Ref to={frameVariables} />, <Ref to={opIdLabel} />]}></Align>
      <Align centerLeft={[<Ref to={frameBorder} />, <Ref to={frame} />]}></Align>
    </Group>
  );
});

export const Objects = withBluefish(function _Objects({
  nextObject,
  objectType,
  value,
  opId,
  opIdString,
}: {
  nextObject: any;
  objectType: any;
  value: any;
  opId: any;
  opIdString?: any;
}) {
  const itemRefName = useName(`pointed${opIdString}`);
  const boxRefName = useName(`pointer${opIdString}`);
  const valueRefName = useName(`value_${opIdString}`);
  const labelRefName = useName(`label_${opIdString}`);
  const zeroRefName = useName(`zero_${opIdString}`);
  const oneRefName = useName(`one_${opIdString}`);
  const elemRefName = useName(`elem_${opIdString}`);

  console.log(
    'all refs of this object: ',
    itemRefName,
    boxRefName,
    valueRefName,
    labelRefName,
    zeroRefName,
    oneRefName,
    elemRefName,
  );

  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group name={opId}>
      <Text name={labelRefName} contents={objectType} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />

      {/* separate names for each rectangle so that the arrow can go from the center of pointer to the center left of pointed */}
      <Group name={elemRefName}>
        <Rect name={boxRefName} height={60} width={70} fill={'#ffffc6'} stroke={'grey'} />
        <Rect name={itemRefName} height={60} width={70} fill={'#ffffc6'} stroke={'grey'} />
        <Text name={valueRefName} contents={value} fontSize={'24px'} fill={'black'} />
        <Text name={zeroRefName} contents={'0'} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />
        <Text name={oneRefName} contents={'1'} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />

        <Align center={[<Ref to={valueRefName} />, <Ref to={itemRefName} />]}></Align>

        <Align left={[<Ref to={boxRefName} />, <Ref to={itemRefName} />]}></Align>

        <Align topLeft={[<Ref to={oneRefName} />, <Ref to={boxRefName} />]}></Align>
      </Group>

      <Space vertically by={10}>
        <Ref to={labelRefName} />
        <Ref to={elemRefName} />
      </Space>
    </Group>
  );
});

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

  const allNamesMap = new Map();

  const space1Name = useName('space1');
  const space2Name = useName('space2');
  const objectMatrixName = useName('objects-matrix');
  const rowsNames = useNameList(rows.map((row: any, index: any) => `row${index}`));
  const colsNames = useNameList(cols.map((col: any, index: any) => `col${index}`));

  const allRectNames = [];
  for (let i = 0; i < rows.length; i++) {
    let levels = rows[i].nodes;
    for (let j = 0; j < levels.length; j++) {
      allRectNames.push(`row${i}_col${j}`);
    }
  }
  const rectNames = useNameList(allRectNames);

  const groupName = useName(opId);
  const globalFrameName = useName('globalFrame');

  rows.forEach((row: any, index: any) => {
    allNamesMap.set(`row${index}`, rowsNames[index]);
  });

  cols.forEach((col: any, index: any) => {
    allNamesMap.set(`col${index}`, colsNames[index]);
  });

  const objectsWithActualNames: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    let levels = rows[i].nodes;
    for (let j = 0; j < levels.length; j++) {
      allNamesMap.set(`row${i}_col${j}`, rectNames[i * levels.length + j]);
      if (rows[i].nodes[j] !== '') {
        objectsWithActualNames.push(rows[i].nodes[j]);
      }
    }
  }

  const objectNamesList = useNameList(objectsWithActualNames);

  // push names to allNamesMap
  objectsWithActualNames.forEach((obj: any, index: any) => {
    allNamesMap.set(objectsWithActualNames[index], objectNamesList[index]);
    const ob = objMap.get(objectsWithActualNames[index]);
    objMap.set(objectsWithActualNames[index], { ...ob, opId: objectNamesList[index], opIdString: ob.opId });
  });

  console.log('allNamesMap', allNamesMap);
  console.log('colsNames', colsNames);
  console.log('cols', cols);

  return (
    <Group name={groupName}>
      <GlobalFrame variables={variables} opId={'globalFrame'} name={globalFrameName} />

      <Group name={objectMatrixName}>
        {rows.map((level: any, index: any) => (
          <Row name={rowsNames[index]} spacing={50} alignment={'middle'}>
            {level.nodes.map((obj: any, objIndex: any) =>
              obj == '' ? (
                <Rect
                  name={rectNames[level.depth * level.nodes.length + objIndex]}
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
          <Col name={colsNames[index]} spacing={50} alignment={'left'}>
            {columns.nodes.map((objectId: any) => (
              <Ref to={allNamesMap.get(objectId)} />
            ))}
          </Col>
        ))}
      </Group>

      <Space name={space1Name} horizontally by={60}>
        <Ref to={globalFrameName} />
        <Ref to={objectMatrixName} />
      </Space>

      <Space name={space2Name} vertically by={-250}>
        <Ref to={globalFrameName} />
        <Ref to={objectMatrixName} />
      </Space>

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

// TODO: Connector is throwing an error - finds ref object but cannot resolve ref
// Likely because of local ref issues
export const Link = withBluefish(function _Link({ opId, start, end }: { opId: any; start: any; end: any }) {
  const groupRef = useName(opId);
  const startName = useName(start.opId);
  const endName = useName(end.opId);
  return (
    <Group>
      <Connector
        name={groupRef}
        $from={'center'}
        $to={'centerLeft'}
        stroke={'cornflowerblue'}
        strokeWidth={3}
        strokeDasharray={0}
      >
        <Ref to={startName} />
        <Ref to={endName} />
      </Connector>
    </Group>
  );
});
