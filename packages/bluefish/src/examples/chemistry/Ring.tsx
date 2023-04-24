import React, { forwardRef, PropsWithChildren, useRef } from 'react';
import { Measure, NewPlaceable, PropsWithBluefish, useBluefishLayout, withBluefish } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';
import _ from 'lodash';

export type RingProps = {
  ring: any;
  vertexNameList: any;
  edgeNameList: any;
};

export const Ring = forwardRef(function Ring({ ring, vertexNameList, edgeNameList }: RingProps, ref: any) {
  let vertices = ring.vertices;
  let edges = ring.edges;

  return (
    <RingAux ref={ref}>
      {vertices.map((v: any) => (
        <Ref to={vertexNameList[v.idNum]} />
      ))}
      {edges.map((e: any) => (
        <Ref to={edgeNameList[e.idNum]} />
      ))}
    </RingAux>
  );
});

export const RingAux = withBluefish((props: PropsWithChildren<{}>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, groupMeasurePolicy);
  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
      aria-label={'Ring'}
    >
      <rect x={bbox?.left ?? 0} y={bbox?.top ?? 0} width={bbox?.width ?? 0} height={bbox?.height ?? 0} fill={'none'} />
      {children}
    </g>
  );
});

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable, idx) => {
    // console.log('[set to] name', measurable.name);
    // console.log(`measurable ${idx}`, measurable);
    const placeable = measurable.measure(constraints);
    // console.log(`placed measurable ${idx}`, placeable);
    return placeable;
  });
  placeables.forEach((placeable, idx) => {
    // console.log(`placeable ${idx}`, placeable);
    if (placeable.left === undefined) {
      // console.log('placeable.left set to before', placeable.left);
      placeable.left = 0;
      // console.log('placeable.left set to after', placeable.left);
    }
    if (placeable.top === undefined) {
      placeable.top = 0;
    }
    // console.log(`group after: placed placeable ${idx}`, placeable);
  });

  // TODO: might need to preserve "natural" position so I can figure out what the translation should be.

  const left = _.min(_.map(placeables, 'left')) ?? 0;
  const top = _.min(_.map(placeables, 'top')) ?? 0;
  const right = _.max(_.map(placeables, 'right')) ?? 0;
  const bottom = _.max(_.map(placeables, 'bottom')) ?? 0;
  console.log('asdfs', 'left', _.map(placeables, 'left'), _.min(_.map(placeables, 'left')));
  console.log('asdfs', 'group bbox', { left, top, right, bottom });
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
  // const width = _.max(_.map(placeables, 'width')) ?? 0;
  // const height = _.max(_.map(placeables, 'height')) ?? 0;
  // return { width, height };
};

// export const Ring = withBluefish((props: any) => {
//   let ring = props.ring;
//   let vertices = ring.vertices;
//   let edges = ring.edges;
//   let vertexNames = props.vertexNameList;
//   let edgeNames = props.edgeNameList;

//   console.log('inside the ring');
//   console.log('vertices: ', vertices);
//   console.log('edges: ', edges);
//   console.log('the ring: ', ring);

//   console.log('vertexNames: ', vertexNames);
//   console.log('edgeNames: ', edgeNames);

//   return (
//     <Group aria-label={'Ring'}>
//       {vertices.map((v: any) => (
//         <Ref to={vertexNames[v.idNum]} />
//       ))}

//       {edges.map((e: any) => (
//         <Ref to={edgeNames[e.idNum]} />
//       ))}
//     </Group>
//   );
// });
