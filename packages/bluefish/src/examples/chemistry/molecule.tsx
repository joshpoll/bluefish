import React, { useRef } from 'react';
import { withBluefish, useName } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Circle } from '../../components/Circle';
import { Connector } from '../../components/Connector';
import { Ref } from '../../components/Ref';

const SmilesDrawer = require('smiles-drawer/app.js');
const SvgDrawer = require('smiles-drawer/src/SvgDrawer');
const ThemeManager = require('smiles-drawer/src/ThemeManager');
const SvgWrapper = require('smiles-drawer/src/SvgWrapper');

export const Molecule = withBluefish((props: any) => {
  let options = {};
  let edges: any[] = [];
  let vertices: any[] = [];

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

    determineDimensions(chemicalDrawer.svgWrapper, preprocessor.graph.vertices);

    let [tempEdges, tempVertices] = extractVerticeEdgeInformation(chemicalDrawer);

    edges = edges.concat(tempEdges);
    vertices = vertices.concat(tempVertices);
  });

  function extractVerticeEdgeInformation(drawer: any) {
    const graph = drawer.preprocessor.graph;
    const edges = graph.edges.map((edgeObject: any) => {
      return {
        ...edgeObject,
        id: `edge-${edgeObject.id}`,
        sourceId: `vertex-${edgeObject.sourceId}`,
        destId: `vertex-${edgeObject.targetId}`,
        ref: `edge-${edgeObject.id}`,
      };
    });
    const vertices = graph.vertices.map((vObject: any) => {
      return {
        ...vObject,
        xLoc: vObject.position.x,
        yLoc: vObject.position.y,
        id: `vertex-${vObject.id}`,
      };
    });

    return [edges, vertices];
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

  console.log('the edges');
  console.log(edges);
  console.log('the vertices');
  console.log(vertices);

  return (
    <SVG width={300} height={300}>
      <Group>
        {vertices.map((v) => (
          <Circle name={v.id} cx={v.xLoc} cy={v.yLoc} r={5} fill={'black'} />
        ))}

        {edges.map((e) => (
          <Connector $from={'center'} $to={'center'} stroke={'black'} strokeWidth={2}>
            <Ref to={e.sourceId} />
            <Ref to={e.destId} />
          </Connector>
        ))}
      </Group>
    </SVG>
  );
});
