import { Col } from './Col2';
import { Rect } from './Rect2';
import { withBluefish } from '../bluefish';

export const Test2 = withBluefish(() => {
  return (
    <Col spacing={5} alignment={'center'}>
      <Rect width={20} height={10} fill="cornflowerblue" />
      <Rect width={10} height={20} fill="green" />
    </Col>
  );
});
