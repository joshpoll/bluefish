import { lookup, useName, useNameList, withBluefish } from '../bluefish';
import { AlignNew } from '../components/AlignNew';
import { Distribute } from '../components/Distribute';
import { Group, Padding, Rect, Ref } from '../main';
import { Math } from './math';

export const MathExample = withBluefish(() => {
  const math = useName('math');
  const highlight = useName('highlight');
  const nodes = useNameList(['1', '2', '3', '4', '5', '6']); // names for nodes in math expression

  return (
    <Group>
      <Group>
        <Math name={math} guidePrimary={'center'} latex={'y = mx + b'} names={nodes} />
      </Group>

      <Rect guidePrimary={'center'} name={highlight} width={15} height={20} x={35} fill={'pink'} opacity={0.7} />
      {/* <AlignNew>
        <Ref to={highlight} />
        <Ref to={nodes[3]} />
      </AlignNew> */}
    </Group>
  );
});
