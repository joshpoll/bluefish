import React, { useRef } from 'react';
import { withBluefish, useName } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';

export const Ring = withBluefish((props: any) => {
  let ring = props.ring;
  let vertices = ring.vertices;
  let edges = ring.edges;
  let vertexNames = props.vertexNameList;
  let edgeNames = props.edgeNameList;

  console.log('inside the ring');
  console.log('vertices: ', vertices);
  console.log('edges: ', edges);
  console.log('the ring: ', ring);

  console.log('vertexNames: ', vertexNames);
  console.log('edgeNames: ', edgeNames);

  return (
    <g aria-label={ring.id}>
      {vertices.map((v: any) => (
        <Ref to={vertexNames[v.idNum]} />
      ))}

      {edges.map((e: any) => (
        <Ref to={edgeNames[e.idNum]} />
      ))}
    </g>
  );
});
