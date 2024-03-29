/* 
macro-style scopes
*/

import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Ref } from '../main';

const WorldComponent = () => {
  // @ts-ignore
  return <Text name={'x'} contents={'world'} />;
};

const TestComponent = () => {
  return (
    <>
      {/* @ts-ignore */}
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

Now at this point you could wrap every component in a UseContext and tie names to the closest
context. This works, except now deeply nested definitions aren't tied to their parent component anymore.

*/

export {};
