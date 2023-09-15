import { Group, Rect, Ref, Connector } from '../../main';
import { Col } from '../../components/Col';
import { Row } from '../../components/Row';
import { withBluefish } from '../../bluefish';
import { Distribute } from '../../components/Distribute';
import { GlobalFrame } from './GlobalFrame';
import { Objects } from './Objects';

export const variable = (variableName: string, variableValue: any) => {
  let notPointer = variableValue !== null && (typeof variableValue === 'string' || typeof variableValue === 'number');
  return {
    name: variableName,
    value: notPointer ? variableValue : '',
    pointObject: notPointer ? null : variableValue.pointObject,
  };
};

export const pointer = (targetId: any) => {
  return { pointObject: { id: `object${targetId}` } };
};

export const tuple = (objectList: any) => {
  let objectValues: any = [];
  objectList.forEach((object: any) => {
    let notPointer = object !== null && (typeof object === 'string' || typeof object === 'number');

    let tempTuple = {
      type: notPointer ? 'string' : 'pointer',
      value: notPointer ? object : '',
      pointId: notPointer ? '' : object.pointObject.id,
    };
    objectValues.push(tempTuple);
  });

  return {
    objectType: 'tuple',
    objectValues: objectValues,
  };
};

const formatRows = (objectList: any) => {
  let rows: any = [];
  objectList.forEach((object: any, index: any) => {
    let tempObject = {
      depth: index,
      nodes: object.map((element: any) => {
        return element === null ? '' : `object${element}`;
      }),
    };
    rows.push(tempObject);
  });
  return rows;
};

export const PythonTutor = withBluefish(function ({ variables, objects, rows }: any) {
  const globalFrame = 'globalFrame' as any;
  const objectMatrix = 'objectMatrix' as any;

  rows = formatRows(rows);

  // Add automatic naming based on indices
  variables = variables.map((v: any, index: any) => {
    return { ...v, id: `variable${index}` };
  });

  objects = objects.map((o: any, index: any) => {
    return { ...o, id: `object${index}` };
  });

  // Create lookup map for yellow objects by id
  const objMap = new Map();
  objects.forEach((obj: any) => objMap.set(obj.id, obj));

  // Create lookup map for yellow objects by column
  const objIdByCol = new Map();
  rows.forEach((rowObject: any) => {
    rowObject.nodes.forEach((node: any, index: any) => {
      objIdByCol.set(
        index,
        (objIdByCol.has(index) ? objIdByCol.get(index) : []).concat([
          // If node is empty, create a placeholder id for element
          node === '' ? `elementAt_row${rowObject.depth}col${index}` : node,
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
      return { ...element, parentObject: object.id, index: index };
    });
    return objectWithPointerInfo;
  });

  const objectValuesFlat = objectValues.flat();

  // Find start and end location for links between objects and objects
  const objectLinks = objectValuesFlat
    .filter((tupleObject: any) => tupleObject.type === 'pointer')
    .map((element: any, index: any) => {
      return {
        id: `objectLink${index}`,
        start: { id: `${element.parentObject}_tuple${element.index}` },
        end: { id: `${element.pointId}_tuple0` },
      };
    });

  // Find start and end locations for links between global frame and objects
  const variableLinks = variables
    .filter((variable: any) => variable.pointObject !== null)
    .map((variable: any, index: any) => {
      return {
        id: `variableLink${index}`,
        start: { id: variable.id },
        end: { id: `${variable.pointObject.id}_tuple0` },
      };
    });

  return (
    <Group>
      <GlobalFrame variables={variables} id={'globalFrame'} name={globalFrame} />

      <Group name={objectMatrix}>
        <Col alignment="left" spacing={75}>
          {rows.map((level: any, index: any) => (
            <Row name={`row${index}` as any} spacing={50} alignment={'bottom'}>
              {level.nodes.map((obj: any, objIndex: any) =>
                obj === '' ? (
                  <Rect
                    name={`elementAt_row${level.depth}col${objIndex}` as any}
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
        </Col>
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
        <Link {...link} />
      ))}

      {variableLinks.map((link: any) => (
        <Link {...link} />
      ))}
    </Group>
  );
});

export const Link = withBluefish(function _Link({ id, start, end }: { id: any; start: any; end: any }) {
  return (
    <Group>
      <Connector
        name={id}
        $from={'center'}
        $to={'centerLeft'}
        stroke={'cornflowerblue'}
        strokeWidth={3}
        strokeDasharray={0}
      >
        <Ref to={start.id} />
        <Ref to={end.id} />
      </Connector>
    </Group>
  );
});
