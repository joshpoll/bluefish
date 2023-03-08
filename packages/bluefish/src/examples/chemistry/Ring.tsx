import React, { useRef } from 'react';
import { withBluefish, useName } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';
import { Atom } from './Atom';
import { Bond } from './Bond';

export const Ring = withBluefish((props: any) => {
  let vertices = props.vertices;
  let edges = props.edges;
  let minXOffset = props.minXOffset;
  let minYOffset = props.minYOffset;
  let getLocationVertexWithId = props.getLocationVertexWithId;

  return (
    <Group>
      {vertices.map((v: any) => (
        <Atom
          name={v.id}
          cx={(v.xLoc + minXOffset + 10) * 1.2}
          cy={(v.yLoc + minYOffset + 10) * 1.2}
          r={8}
          fill={'black'}
          content={v.value.element}
          curId={v.id}
          isTerminal={v.isTerminal}
          bondCount={v.value.bondCount}
        />
      ))}

      {edges.map((e: any) => (
        <Bond
          $from={'center'}
          $to={'center'}
          stroke={'black'}
          strokeWidth={2}
          content={'Bond'}
          name={e.id}
          bondType={e.bondType}
          ringCenterX={e.lcr ? e.lcr.center.x : 0}
          ringCenterY={e.lcr ? e.lcr.center.y : 0}
          startLocationX={getLocationVertexWithId(e.sourceId, vertices).xLoc}
          startLocationY={getLocationVertexWithId(e.sourceId, vertices).yLoc}
          endLocationY={getLocationVertexWithId(e.destId, vertices).yLoc}
          endLocationX={getLocationVertexWithId(e.destId, vertices).xLoc}
          curId={e.id}
        >
          <Ref to={e.sourceId} />
          <Ref to={e.destId} />
        </Bond>
      ))}

      {vertices.map((v: any) => (
        <Atom
          cx={(v.xLoc + minXOffset + 10) * 1.2}
          cy={(v.yLoc + minYOffset + 10) * 1.2}
          r={8}
          fill={'black'}
          content={v.value.element}
          curId={v.id}
          isTerminal={v.isTerminal}
          bondCount={v.value.bondCount}
        />
      ))}
    </Group>
  );
});
