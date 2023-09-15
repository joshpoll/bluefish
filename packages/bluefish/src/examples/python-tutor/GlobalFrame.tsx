import { useName, withBluefish } from '../../bluefish';
import { Align } from '../../components/Align';
import { Col } from '../../components/Col';
import { Distribute } from '../../components/Distribute';
import { Group } from '../../components/Group';
import { Rect } from '../../components/Rect';
import { Ref } from '../../components/Ref';
import { Variable } from './Variable';
import { Text } from '../../components/Text';

export const GlobalFrame = withBluefish(function _GlobalFrame({ variables, id }: { variables: any; id: any }) {
  // References
  const frame = useName(`frame_${id}`);
  const frameLabel = useName(`frameLabel_${id}`);
  const frameVariables = useName(`frameVariables_${id}`);
  const frameBorder = useName(`frameBorder_${id}`);
  const fontFamily = 'Andale mono, monospace';

  return (
    <Group name={id}>
      <Rect name={frame} height={300} width={200} fill={'#e2ebf6'} />
      <Rect name={frameBorder} height={300} width={5} fill={'#a6b3b6'} />
      <Text name={frameLabel} contents={'Global Frame'} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
      <Align alignment="topCenter">
        <Ref to={frameLabel} />
        <Ref to={frame} />
      </Align>
      <Distribute direction="vertical" spacing={10}>
        <Ref to={frameLabel} />
        <Col name={frameVariables} spacing={10} alignment={'right'}>
          {variables.map((variable: any) => (
            <Variable data={variable} />
          ))}
        </Col>
      </Distribute>
      <Align alignment="right">
        <Ref to={frameVariables} />
        <Ref to={frameLabel} />
      </Align>
      <Align alignment="centerLeft">
        <Ref to={frameBorder} />
        <Ref to={frame} />
      </Align>
    </Group>
  );
});
