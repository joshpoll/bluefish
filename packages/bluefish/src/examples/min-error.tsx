import { Plot2 as Plot, Plot2 } from './grammars/gog/Plot';
import { SVG } from '../components/SVG';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import _ from 'lodash';
import { Col, Group, Line, Padding } from '../main';
import { NewDot } from './grammars/gog/marks/NewDot';
import { NewLine } from './grammars/gog/marks/NewLine';
import { useName } from '../bluefish';
import { Text } from '../components/Text';

export const MinError: React.FC<{}> = () => {
  return (
    <SVG width={500} height={500}>
      <Group>
        <Group>
          <Col spacing={5} alignment={'center'}>
            <Line x1={20} y1={20} x2={20} y2={30} strokeWidth={2} stroke={'black'} />
            {/* <Text contents={'1'} /> */}
          </Col>
        </Group>
        {/* <Group>
          <Col spacing={5} alignment={'center'}>
            <Line x1={50} y1={20} x2={50} y2={30} strokeWidth={2} />
            <Text contents={'2'} />
          </Col>
        </Group> */}
      </Group>
    </SVG>
  );
};
