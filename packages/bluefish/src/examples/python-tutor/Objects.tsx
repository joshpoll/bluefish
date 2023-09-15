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

export const Objects = withBluefish(function ({ objectType, objectValues, id }: any) {
  const objectTypeLabel = useName('objectTypeLabel');
  const objects = useName('objects');

  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group name={id}>
      <Text name={objectTypeLabel} contents={objectType} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />
      <Row name={objects} spacing={0} alignment={'middle'}>
        {objectValues.map((tupleData: any, index: any) => (
          <ElmTuple tupleIndex={index} tupleData={tupleData} parentObject={id} />
        ))}
      </Row>

      <Distribute direction={'vertical'} spacing={10}>
        <Ref to={objectTypeLabel} />
        <Ref to={objects} />
      </Distribute>
      <Align alignment={'left'}>
        <Ref to={objectTypeLabel} />
        <Ref to={objects} />
      </Align>
    </Group>
  );
});
