import { useName, withBluefish } from '../../bluefish';
import { Group } from '../../components/Group';
import { ElmTuple } from './ElmTuple';
import { Text } from '../../components/Text';
import { Ref } from '../../components/Ref';
import { Distribute } from '../../components/Distribute';
import { Row } from '../../components/Row';
import { Align } from '../../components/Align';

export type ObjectProps = {
  objectType: string;
  objectValues: any[];
  objectId: string;
};

export const Objects = withBluefish(function ({ objectType, objectValues, objectId }: any) {
  // objectValues: list of values for different parts of object

  const objectTypeRef = useName('objectTypeLabel');
  const objectRef = useName('objectGroup');

  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  console.log('creating an object with id: ', objectId, objectType, objectValues);

  return (
    <Group name={objectId}>
      <Text name={objectTypeRef} contents={objectType} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />
      <Row name={objectRef} spacing={0} alignment={'middle'}>
        {objectValues.map((elementData: any, index: any) => (
          <ElmTuple tupleIndex={index} tupleData={elementData} objectId={objectId} />
        ))}
      </Row>

      <Distribute direction={'vertical'} spacing={10}>
        <Ref to={objectTypeRef} />
        <Ref to={objectRef} />
      </Distribute>
      <Align alignment={'left'}>
        <Ref to={objectTypeRef} />
        <Ref to={objectRef} />
      </Align>
    </Group>
  );
});
