import React, { useRef } from 'react';
import { withBluefish, useName } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';
import { Atom } from './Atom';
import { Bond } from './Bond';

export const Ring = withBluefish((props: any) => {
  let ring = props.ring;
  let vertices = ring.vertices;
  let edges = ring.edges;

  return (
    <g aria-label={ring.id}>
      <g aria-label={'Ring Vertices'}>
        {vertices.map((v: any) => (
          <Ref to={v.name} />
        ))}
      </g>

      <g aria-label={'Ring Edges'}>
        {edges.map((e: any) => (
          <Ref to={e.name} />
        ))}
      </g>
    </g>
  );
});
