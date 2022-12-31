// mock-up of Bluefish grammar

// component-specific interfaces
type ComponentValue = {
  domRef: any /* also using this to "represent" the visual output, though that's not exactly right I don't think... */;
  bbox: Partial<{
    left: number;
    top: number;
    width: number;
    height: number;
    bottom: number;
    right: number;
  }>;
  boundary: any;
  transform: any;
};

type Component = {
  constructor: string;
  attrs: { [key: string]: any };
  children: Component[];
  view: (attrs: any, children: any) => ComponentValue;
  name: string; // maybe also has scoping information...
  transform: any; // maybe
  measure: any; // maybe. measure function may only update the bbox of its children monotonically. that is, values may only get from unset to set
};

// enable overlapping components
// special components. these components are special b/c they have different semantics than other
// components
type Ref = Component;
type Copy = Component;

// type CopyAttr = Component; /* maybe... it might also just be a special kind of attribute */
{
  /*
  <AlignAttr>
    <Ref to={'foooo'} props={['fill', 'stroke']} />
    <Circle name={'barrr'} r={20} fill={({fill}) => (...) => ...} stroke={({fill}) => ...} />
  </AlignAttr>
 */
}

export {};

/* 

Semantics:

- starting from the top, components' view functions are recursively called (look at how React does
  it...)
- actually, measurement happens first. and when does domRef get set? hmm... I think that domRef is
  set after rendering is called, which can happen bottom-up after measurement is called...
- oh wait, actually the domRef can be mutated later by other measurements of it. so once a bbox is
  fully set, _then_ the domRef is set.

*/

/* 
How do we make Copy parallel with other relations?

If I want to draw a link between two things I would do

<Connector>
  <Ref name={A} />
  <B />
</Connector>

But another way I could represent this relation between A and B would be to copy A and make it a
label for B like so:

<Label>
  <Copy name={A} />
  <B />
</Label>
*/

// TODO: look at Dan's post, which introduces some of the key data structure in React:
// https://overreacted.io/react-as-a-ui-runtime/
// note specifically that React Elements and React Components are different things
