// prototype of potential new hook API

import { useContext } from 'react';
import { Constraints, Measurable, useBluefishLayout2, MeasureResult, RefContext, withBluefish3 } from '../bluefish';

export type useConstraintsType = () => Constraints;

export type useLayout = (measurables: Measurable[]) => MeasureResult;

// or maybe a special component like in Jetpack Compose
export type LayoutType = (props: { children: any[]; layout: useLayout }) => JSX.Element;
// but that won't work b/c we need to pass ref and bbox to rendering...
// that is, it would have to look like this:
export type Layout2 = (props: {
  children: any[];
  layout: useLayout;
  render: (props: any) => JSX.Element;
}) => JSX.Element;
// but actually we wouldn't need to do this is if we always assume that `render` is just a simple
// <g> wrapper
// in that way, Layout is almost like a special Group component

// Now that Layout isn't a hook, I'm not sure we have many issues with combining useConstraints and
// Layout components. I can't find an instance of a layout component currently that _doesn't_ act
// like a <g> wrapper (except base components with no children, which we may need to handle
// differently.)

// It looks like Jetpack Compose handles basic components also using Layout, but I'm not sure it
// makes sense for us since they basically have an escape hatch that uses "paint." On the other
// hand, we do have an equivalent of paint here: raw SVG. So maybe we should just use Layout for
// everything. We can add a special case for base components with no children, in which case we have
// to give it a "paint" or "render" function that just returns the raw SVG.

export const Layout = withBluefish3((props: React.PropsWithChildren<{ layout: useLayout; parentProps: any }>) => {
  const { domRef, bbox, children } = useBluefishLayout2({}, props.parentProps, (measurables, _constraints) =>
    props.layout(measurables),
  );

  return (
    <g ref={domRef} transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}>
      {children}
    </g>
  );
});

export const useConstraints = (): Constraints => {
  const { ref: contextRef } = useContext(RefContext);
  console.log('useConstraints', contextRef?.current);
  return (contextRef?.current as any)?.constraints ?? {};
};

/* 
kinds of workflows

smilesDrawer:
  - formula -> chemical structure graph (positions of vertices/atoms, edges, wedges, rings, etc.) ->
      SVG
  - formula -> construct graph -> place graph -> measure parent -> SVG
  (formula) => {
      const graph = constructGraph(formula);
      const placedGraph = placeGraph(graph);
      return <svg>{placedGraph}</svg>;
  }
  with useConstraint and/or Layout:
  (formula) => {
      const graph = constructGraph(formula);
      return <Layout layout={placeGraph}>{graph}</Layout>;
  }

vega-label:
  - existing placed marks and unplaced labels -> determine label positions and decide which labels to
      show -> place labels -> measure parent -> SVG
  (marks, labels) => {
      const placedLabels = placeLabels(marks, labels);
      return <svg>{placedLabels}</svg>;
  }
  with useConstraint and/or Layout:
  (marks, labels) => {
      return <Layout layout={placeLabels}>{marks}{labels}</Layout>;
  }

Layout has to use paint/render in cases where we need to produce a new relational structure b/c the
children we pass into Layout are not the same as the children we want to render. This is the case
for vega-label, but not for smilesDrawer. So we need to be able to pass in a paint/render function
that takes the children and produces the new relational structure. Here it is

  (marks, labels) => {
      return <Layout layout={placeLabels} paint={(children) =>
      <svg>{children}</svg>}>{marks}{labels}</Layout>;   
  }

If we allow the paint function to return Bluefish components (e.g. a Layout component), we need to be careful about the order
that measure functions are called in. If paint returns a Layout component, then the outer Layout
component and its children are executed first before the paint call. But what happens to the
bounding box computation of the outer Layout? If it is getting replaced with the body of paint, then 
how do we make any guarantees about the bounding box of the outer Layout? I think we need to
guarantee that the bounding box of the outer Layout is the bounding box of the body of paint. We can
do this by passing the outer Layout's dimensions as constraints to the inner Layout.

What makes this weird is that the paint function is receiving the outer layout's children, right?

The reason why I want to be able to return Bluefish components from paint is so that we can get some
parallels between passing in position values directly and using Layout. For example, if we want to
place a label at a specific position, we could pass that position into the label props. If instead
we were to create a paint function because we wanted to change the structure, now we're popping out
of the Bluefish world to do that.


*/

/* 


Parent:
<>
  <Child1 constraints={} />
  <Child2 constraints={} />
  <Child3 constraints={} />
</>

Child:
const constraints = ...;

<Layout constraints={constraints} layout={placeChild} paint={(children) => <g>{children}</g>} />


information is passed down through props
and up through refs? context?

*/
