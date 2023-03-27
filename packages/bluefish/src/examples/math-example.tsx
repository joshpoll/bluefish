import { lookup, useName, withBluefish } from '../bluefish';
import { AlignNew } from '../components/AlignNew';
import { Distribute } from '../components/Distribute';
import { Group, Padding, Rect, Ref } from '../main';
import { Math } from './math';

export const MathExample = withBluefish(() => {
  const math = useName('math');
  const highlight = useName('highlight');
  return (
    <Group>
      <Math guidePrimary={'center'} name={math} latex={'y = mx + b'} />
      <Rect guidePrimary={'center'} name={highlight} width={20} height={20} fill={'yellow'} opacity={0.4} />
      <AlignNew>
        <Ref to={lookup(math)} />
        <Ref to={highlight} />
      </AlignNew>
    </Group>
  );
});
