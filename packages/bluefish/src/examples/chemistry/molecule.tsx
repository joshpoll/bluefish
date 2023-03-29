import React, { useRef, useState } from 'react';
import { withBluefish, useName, useNameList } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';
import { Atom } from './Atom';
import { Bond } from './Bond';
import { Ring } from './Ring';

const SmilesDrawer = require('smiles-drawer/app.js');
const SvgDrawer = require('smiles-drawer/src/SvgDrawer');
const ThemeManager = require('smiles-drawer/src/ThemeManager');
const SvgWrapper = require('smiles-drawer/src/SvgWrapper');
const ArrayHelper = require('smiles-drawer/src/ArrayHelper');

export const Molecule = withBluefish((props: any) => {
  let options = {};
  let edges: any[] = [];
  let vertices: any[] = [];
  let rings: any[] = [];

  let chemicalDrawer = new SvgDrawer(options);

  SmilesDrawer.parse(props.chemicalFormula, function (tree: any) {
    let preprocessor = chemicalDrawer.preprocessor;
    preprocessor.initDraw(tree, 'dark', false, []);

    if (!false) {
      chemicalDrawer.themeManager = new ThemeManager(chemicalDrawer.opts.themes, 'dark');
      if (chemicalDrawer.svgWrapper === null || chemicalDrawer.clear) {
        const fakeSvgWrapper = {
          maxX: -Number.MAX_VALUE,
          maxY: -Number.MAX_VALUE,
          minX: Number.MAX_VALUE,
          minY: Number.MAX_VALUE,
          opts: chemicalDrawer.opts,
          drawingWidth: 0,
          drawingHeight: 0,
        };
        chemicalDrawer.svgWrapper = fakeSvgWrapper;
      }
    }

    preprocessor.processGraph();
    console.log(preprocessor);

    determineDimensions(chemicalDrawer.svgWrapper, preprocessor.graph.vertices);

    let [tempEdges, tempVertices, tempRings] = extractVerticeEdgeRingInformation(chemicalDrawer);

    edges = edges.concat(tempEdges);
    vertices = vertices.concat(tempVertices);
    rings = rings.concat(tempRings);
  });

  function extractVerticeEdgeRingInformation(drawer: any) {
    const graph = drawer.preprocessor.graph;
    const edges = graph.edges.map((edgeObject: any) => {
      return {
        ...edgeObject,
        id: `edge-${edgeObject.id}`,
        idNum: edgeObject.id,
        sourceId: `vertex-${edgeObject.sourceId}`,
        sourceNum: edgeObject.sourceId,
        destId: `vertex-${edgeObject.targetId}`,
        destNum: edgeObject.targetId,
        ref: `edge-${edgeObject.id}`,
        lcr: drawer.preprocessor.areVerticesInSameRing(
          drawer.preprocessor.graph.vertices[edgeObject.sourceId],
          drawer.preprocessor.graph.vertices[edgeObject.targetId],
        )
          ? drawer.preprocessor.getLargestOrAromaticCommonRing(
              drawer.preprocessor.graph.vertices[edgeObject.sourceId],
              drawer.preprocessor.graph.vertices[edgeObject.targetId],
            )
          : null,
      };
    });

    const vertices = graph.vertices.map((vObject: any) => {
      return {
        ...vObject,
        xLoc: vObject.position.x,
        yLoc: vObject.position.y,
        id: `vertex-${vObject.id}`,
        idNum: vObject.id,
        isTerminal: vObject.isTerminal(),
      };
    });

    const rings = drawer.preprocessor.rings.map((ringObject: any) => {
      return {
        ...ringObject,
        id: `ring-${ringObject.id}`,
        idNum: ringObject.id,
      };
    });

    return [edges, vertices, rings];
  }

  // const vNames = vertices.map((v) => v.id);
  // console.log('names of vertices: ', vNames);
  const verticesName = useNameList(vertices.map((v) => v.id));
  const edgesName = useNameList(edges.map((e) => e.id));
  const ringsName = useNameList(rings.map((r) => r.id));

  // Remap the vertices and edges to include the names
  vertices = vertices.map((v, index) => {
    return {
      ...v,
      name: verticesName[index],
    };
  });

  edges = edges.map((e, index) => {
    return {
      ...e,
      name: edgesName[index],
    };
  });

  /**
   * Determine drawing dimensiosn based on vertex positions.
   *
   * @param {Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
   */
  function determineDimensions(svgWrapper: any, vertices: any) {
    for (var i = 0; i < vertices.length; i++) {
      if (!vertices[i].value.isDrawn) {
        continue;
      }

      let p = vertices[i].position;

      if (svgWrapper.maxX < p.x) svgWrapper.maxX = p.x;
      if (svgWrapper.maxY < p.y) svgWrapper.maxY = p.y;
      if (svgWrapper.minX > p.x) svgWrapper.minX = p.x;
      if (svgWrapper.minY > p.y) svgWrapper.minY = p.y;
    }

    // Add padding
    let padding = svgWrapper.opts.padding;
    svgWrapper.maxX += padding;
    svgWrapper.maxY += padding;
    svgWrapper.minX -= padding;
    svgWrapper.minY -= padding;

    svgWrapper.drawingWidth = svgWrapper.maxX - svgWrapper.minX;
    svgWrapper.drawingHeight = svgWrapper.maxY - svgWrapper.minY;
  }

  function getLocationVertexWithId(vertexId: any, vertices: any) {
    const vertex = vertices.filter((v: any) => {
      return v.id === vertexId;
    });
    return vertex[0];
  }

  function findOffsetsToFitDiagram(vertices: any) {
    let xOffsets: any[] = [];
    let yOffsets: any[] = [];

    for (let i = 0; i < vertices.length; i++) {
      let vertex = vertices[i];
      xOffsets.push(vertex.xLoc);
      yOffsets.push(vertex.yLoc);
    }

    let minX = Math.abs(Math.min(...xOffsets));
    let minY = Math.abs(Math.min(...yOffsets));

    return [minX, minY];
  }

  const [minXOffset, minYOffset] = findOffsetsToFitDiagram(vertices);

  function findEdgesVerticesOfRing(ringElm: any, edges: any, vertices: any) {
    let ringEdges: any[] = [];
    let ringVertices: any[] = [];

    let usedEdges: any[] = [];

    // filter vertices so that only the ones in ringElm are included
    ringVertices = vertices.filter((v: any) => {
      return ringElm.includes(v.id);
    });

    // filter edges, if source and destination of edge in ringElm, then include
    ringEdges = edges.filter((e: any) => {
      return ringElm.includes(e.sourceId) && ringElm.includes(e.destId);
    });

    usedEdges = ringEdges.map((e: any) => {
      return e.id;
    });

    return [{ edges: ringEdges, vertices: ringVertices }, usedEdges];
  }

  // function to separate list of edges, vertices, rings for rendering
  function separateEdgesVerticesRings(edges: any, vertices: any, rings: any) {
    let sepRings: any[] = [];
    let sepEdges: any[] = [];
    let sepVertices: any[] = [];

    let usedVertices: any[] = [];
    let usedEdges: any[] = [];

    for (let i = 0; i < rings.length; i++) {
      let ringElm = rings[i];

      let ringVertexIds = ringElm.members.map((v: any) => {
        return `vertex-${v}`;
      });

      let [ringObject, edgeUsed] = findEdgesVerticesOfRing(ringVertexIds, edges, vertices);
      sepRings.push({ ...ringObject, id: ringElm.id });

      usedVertices = usedVertices.concat(ringVertexIds);
      usedEdges = usedEdges.concat(edgeUsed);
    }

    sepVertices = vertices.filter((v: any) => {
      return !usedVertices.includes(v.id);
    });

    sepEdges = edges.filter((e: any) => {
      return !usedEdges.includes(e.id);
    });

    return [sepEdges, sepVertices, sepRings];
  }

  console.log('these are the vertices: ', vertices);
  console.log('these are the edges: ', edges);
  console.log('these are the rings: ', rings);

  const [renderEdges, renderVertices, renderRings] = separateEdgesVerticesRings(edges, vertices, rings);

  console.log('these are the render vertices: ', renderVertices);
  console.log('these are the render edges: ', renderEdges);
  console.log('these are the render rings: ', renderRings);

  return (
    <Group aria-label={props.ariaLabel} width={200} height={200}>
      {vertices.map((v, index) => (
        <Atom
          name={verticesName[index]}
          cx={(v.xLoc + minXOffset + 10) * 1.2}
          cy={(v.yLoc + minYOffset + 10) * 1.2}
          r={8}
          fill={'black'}
          content={v.value.element}
          curId={v.id}
          isTerminal={v.isTerminal}
          bondCount={v.value.bondCount}
          ariaHidden={false}
        />
      ))}

      {edges.map((e, index) => (
        <Bond
          $from={'center'}
          $to={'center'}
          stroke={'black'}
          strokeWidth={2}
          content={'Bond'}
          name={edgesName[index]}
          bondType={e.bondType}
          ringCenterX={e.lcr ? e.lcr.center.x : 0}
          ringCenterY={e.lcr ? e.lcr.center.y : 0}
          startLocationX={getLocationVertexWithId(e.sourceId, vertices).xLoc}
          startLocationY={getLocationVertexWithId(e.sourceId, vertices).yLoc}
          endLocationY={getLocationVertexWithId(e.destId, vertices).yLoc}
          endLocationX={getLocationVertexWithId(e.destId, vertices).xLoc}
          curId={e.id}
        >
          <Ref to={verticesName[e.sourceNum]} />
          <Ref to={verticesName[e.destNum]} />
        </Bond>
      ))}

      {vertices.map((v) => (
        <Atom
          cx={(v.xLoc + minXOffset + 10) * 1.2}
          cy={(v.yLoc + minYOffset + 10) * 1.2}
          r={8}
          fill={'black'}
          content={v.value.element}
          curId={v.id}
          isTerminal={v.isTerminal}
          bondCount={v.value.bondCount}
          ariaHidden={true}
        />
      ))}

      {renderRings.map((r) => (
        <Ring ring={r} vertexNameList={verticesName} edgeNameList={edgesName} />
      ))}
    </Group>
  );
});
