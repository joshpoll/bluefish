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
  parentObject: string;
};

export const ElmTuple = withBluefish(({ tupleIndex, tupleData, parentObject }: ElmTupleProps) => {
  const fontFamily = 'verdana, arial, helvetica, sans-serif';
  return (
    <Group name={`${parentObject}_tuple${tupleIndex}` as any}>
      <Rect
        name={`${parentObject}_tuple${tupleIndex}_box` as any}
        height={60}
        width={70}
        fill={'#ffffc6'}
        stroke={'grey'}
      />
      <Padding left={5} right={0} top={0} bottom={0} name={`${parentObject}_tuple${tupleIndex}_label` as any}>
        <Text contents={`${tupleIndex}`} fontFamily={fontFamily} fontSize={'16px'} fill={'gray'} />
      </Padding>
      {tupleData.type === 'string' ? (
        <Text
          name={`${parentObject}_tuple${tupleIndex}_value` as any}
          contents={tupleData.value}
          fontSize={'24px'}
          fill={'black'}
        />
      ) : (
        <Text name={`${parentObject}_tuple${tupleIndex}_value` as any} contents={''} fill={'none'} />
      )}

      <Align alignment="center">
        <Ref to={`${parentObject}_tuple${tupleIndex}_value`} />
        <Ref to={`${parentObject}_tuple${tupleIndex}_box`} />
      </Align>

      <Align alignment="topLeft">
        <Ref to={`${parentObject}_tuple${tupleIndex}_label`} />
        <Ref to={`${parentObject}_tuple${tupleIndex}_box`} />
      </Align>
    </Group>
  );
});
