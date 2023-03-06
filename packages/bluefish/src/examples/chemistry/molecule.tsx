import React, { useRef } from 'react';
import { withBluefish, useName } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';
import { Atom } from './Atom';
import { Bond } from './Bond';

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
        sourceId: `vertex-${edgeObject.sourceId}`,
        destId: `vertex-${edgeObject.targetId}`,
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
        isTerminal: vObject.isTerminal(),
      };
    });

    const rings = drawer.preprocessor.rings.map((ringObject: any) => {
      return {
        ...ringObject,
        id: `ring-${ringObject.id}`,
      };
    });

    return [edges, vertices, rings];
  }

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

  console.log('the edges');
  console.log(edges);
  console.log('the vertices');
  console.log(vertices);
  console.log('the rings');
  console.log(rings);

  return (
    <SVG width={500} height={500}>
      <Group>
        {vertices.map((v) => (
          <Atom
            name={v.id}
            cx={(v.xLoc + 35) * 1.5}
            cy={(v.yLoc + 35) * 1.5}
            r={8}
            fill={'black'}
            content={v.value.element}
            curId={v.id}
            isTerminal={v.isTerminal}
            bondCount={v.value.bondCount}
          />
        ))}

        {edges.map((e) => (
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
          >
            <Ref to={e.sourceId} />
            <Ref to={e.destId} />
          </Bond>
        ))}

        {vertices.map((v) => (
          <Atom
            cx={(v.xLoc + 35) * 1.5}
            cy={(v.yLoc + 35) * 1.5}
            r={8}
            fill={'black'}
            content={v.value.element}
            curId={v.id}
            isTerminal={v.isTerminal}
            bondCount={v.value.bondCount}
          />
        ))}
      </Group>
    </SVG>
  );
});