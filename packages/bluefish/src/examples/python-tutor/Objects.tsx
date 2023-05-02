import { withBluefish } from '../../bluefish';
import { Group } from '../../components/Group';
import { ElmTuple } from './ElmTuple';
import { Variable } from './Variable';
import { Text } from '../../components/Text';

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
  let itemRefName = `pointed${opId}`;
  let boxRefName = `pointer${opId}`;
  let valueRefName = `value_${opId}`;
  let labelRefName = `label_${opId}`;
  let zeroRefName = `zero_${opId}`;
  let oneRefName = `one_${opId}`;
  let elemRefName = `elem_${opId}`;

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
      <Text name={labelRefName as any} contents={objectType} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />

      {/* separate names for each rectangle so that the arrow can go from the center of pointer to the center left of pointed */}
      <Group name={elemRefName as any}>
        <ElmTuple tupleIndex={'0'} tupleData={value} objectId={opId} />

        {/* <Rect name={boxRefName as any} height={60} width={70} fill={'#ffffc6'} stroke={'grey'} />
        <Rect name={itemRefName as any} height={60} width={70} fill={'#ffffc6'} stroke={'grey'} />
        <Text name={valueRefName as any} contents={value} fontSize={'24px'} fill={'black'} />
        <Text name={zeroRefName as any} contents={'0'} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />
        <Text name={oneRefName as any} contents={'1'} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />

        <Align alignment="center">
          <Ref to={valueRefName} />
          <Ref to={itemRefName} />
        </Align>

        <Distribute spacing={0} direction="horizontal">
          <Ref to={itemRefName} />
          <Ref to={boxRefName} />
        </Distribute>

        <Align alignment="centerVertically">
          <Ref to={boxRefName} />
          <Ref to={itemRefName} />
        </Align>

        <Align alignment="topLeft">
          <Ref to={oneRefName} />
          <Ref to={boxRefName} />
        </Align> */}
      </Group>

      {/* <Distribute direction="vertical" spacing={10}>
        <Ref to={labelRefName} />
        <Ref to={elemRefName} />
      </Distribute> */}
    </Group>
  );
});
