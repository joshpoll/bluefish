import { withBluefish } from '../../bluefish';
import { Align } from '../../components/Align';
import { Col } from '../../components/Col';
import { Distribute } from '../../components/Distribute';
import { Group } from '../../components/Group';
import { Rect } from '../../components/Rect';
import { Ref } from '../../components/Ref';
import { Variable } from './Variable';
import { Text } from '../../components/Text';

export const GlobalFrame = withBluefish(function _GlobalFrame({ variables, opId }: { variables: any; opId: any }) {
  // References
  const frame = `frame_${opId}`;
  const opIdLabel = `opIdLabel_${opId}`;
  const frameVariables = `frameVariables_${opId}`;
  const frameBorder = `frameBorder_${opId}`;
  const groupName = opId;

  console.log('creating global frame:', opId);

  // Font declaration
  const fontFamily = 'Andale mono, monospace';

  return (
    <Group name={groupName}>
      {/* Global Frame and relevant text */}
      <Rect name={frame as any} height={300} width={200} fill={'#e2ebf6'} />
      <Rect name={frameBorder as any} height={300} width={5} fill={'#a6b3b6'} />
      <Text
        name={opIdLabel as any}
        contents={'Global Frame'}
        fontSize={'24px'}
        fontFamily={fontFamily}
        fill={'black'}
      />
      <Align alignment="topCenter">
        <Ref to={opIdLabel} />
        <Ref to={frame} />
      </Align>
      {/* TODO: this Space and Align should be a Col, but Col overwrites *all* placeable positions
            even though opIdLabel has already been placed */}
      <Distribute direction="vertical" spacing={10}>
        <Ref to={opIdLabel} />
        <Col name={frameVariables as any} spacing={10} alignment={'right'}>
          {variables.map((variable: any) => (
            <Variable data={variable} />
          ))}
        </Col>
      </Distribute>
      <Align alignment="right">
        <Ref to={frameVariables} />
        <Ref to={opIdLabel} />
      </Align>
      <Align alignment="centerLeft">
        <Ref to={frameBorder} />
        <Ref to={frame} />
      </Align>
    </Group>
  );
});
