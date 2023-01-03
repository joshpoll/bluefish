/* 
macro-style scopes
*/

import { Col } from '../components/Col2';
import { Rect } from '../components/Rect2';
import { Text } from '../components/Text2';
import { Ref } from '../main';

const WorldComponent = () => {
  return <Text name={'x'} contents={'world'} />;
};

const TestComponent = () => {
  return (
    <>
      <Text name={'x'} contents={'hello'} />
      <WorldComponent />
      <Col spacing={10} alignment={'left'}>
        <Ref to={'x'} />
        <Rect fill={'#eee'} />
      </Col>
    </>
  );
};

/* 
The problem with this approach is that the above component gets elaborated to
<>
  <Text name={'x'} contents={'hello'} />
  <Text name={'x'} contents={'world'} />
  <Col spacing={10} alignment={'left'}>
    <Ref to={'x'} />
    <Rect fill={'#eee'} />
  </Col>
</>

and now there are two elements with the same name.

This is very similar to the hygiene problem in macros. We can solve it similarly by introducing
scopes that are tied to the components themselves, rather than to the document, since each component
is effectively a macro.
*/

export {};
