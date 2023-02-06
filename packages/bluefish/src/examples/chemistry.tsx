import React from 'react';
import { withBluefish } from '../bluefish';
import { SVG } from '../components/SVG';
import { Group } from '../components/Group';

const SmilesDrawer = require('smiles-drawer/app.js');

export const ChemistryDiagram = withBluefish((props: any) => {
  let options = {};

  // Initialize the drawer to draw to canvas
  // let smilesDrawer = new SmilesDrawer.Drawer(options);
  // console.log('this is the drawer');
  // console.log(smilesDrawer);
  // Alternatively, initialize the SVG drawer:
  let svgDrawer = new SmilesDrawer.SvgDrawer(options);
  console.log("here's the svgDrawer");
  console.log(svgDrawer);

  SmilesDrawer.parse('CCCCCC', function (tree: any) {
    // Draw to the canvas
    console.log("here's the tree");
    console.log(tree);
    // smilesDrawer.draw(tree, 'example-canvas', 'light', false);
    // Alternatively, draw to SVG:
    svgDrawer.draw(tree, 'output-svg', 'dark', false);
  });

  return (
    <Group>
      <body>
        <div>
          <svg id="output-svg">Hi</svg>
        </div>

        <script src="https://unpkg.com/smiles-drawer@1.0.10/dist/smiles-drawer.min.js"></script>
      </body>
    </Group>
  );
});
