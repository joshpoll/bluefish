import { withBluefish } from '../../bluefish';
import { Align } from '../../components/Align';
import { Group } from '../../components/Group';
import { Rect } from '../../components/Rect';
import { Ref } from '../../components/Ref';
import { Text } from '../../components/Text';
import { Padding } from '../../main';

export type ElmTupleProps = {
  tupleIndex: string;
  tupleData: { type: string; value: string };
  objectId: string;
};

export const ElmTuple = withBluefish(({ tupleIndex, tupleData, objectId }: ElmTupleProps) => {
  const fontFamily = 'verdana, arial, helvetica, sans-serif';
  return (
    <Group name={`elm_${tupleIndex}_${objectId}` as any}>
      <Rect name={`elmBox_${tupleIndex}_${objectId}` as any} height={60} width={70} fill={'#ffffc6'} stroke={'grey'} />
      <Padding left={5} right={0} top={0} bottom={0} name={`elmLabel_${tupleIndex}_${objectId}` as any}>
        <Text
          // name={`elmLabel_${tupleIndex}_${objectId}` as any}
          contents={`${tupleIndex}`}
          fontFamily={fontFamily}
          fontSize={'16px'}
          fill={'gray'}
        />
        {/* <Rect name={`elmLabel_${tupleIndex}_${objectId}` as any} height={10} width={10} fill={'none'} stroke={'red'} /> */}
      </Padding>
      {tupleData.type === 'string' ? (
        <Text
          name={`elmVal_${tupleIndex}_${objectId}` as any}
          contents={tupleData.value}
          fontSize={'24px'}
          fill={'black'}
        />
      ) : (
        <Text name={`elmVal_${tupleIndex}_${objectId}` as any} contents={''} fill={'none'} />
      )}

      <Align alignment="center">
        <Ref to={`elmVal_${tupleIndex}_${objectId}`} />
        <Ref to={`elmBox_${tupleIndex}_${objectId}`} />
      </Align>

      <Align alignment="topLeft">
        <Ref to={`elmLabel_${tupleIndex}_${objectId}`} />
        <Ref to={`elmBox_${tupleIndex}_${objectId}`} />
      </Align>
    </Group>
  );
});
