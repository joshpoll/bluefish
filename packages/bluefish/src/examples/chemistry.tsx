import { withBluefish } from '../bluefish';
import SmilesDrawer from '../../node_modules/smiles-drawer/app';

export const Polio = withBluefish((props: any) => {
  let input = document.getElementById('example-input');
  let options = {};

  // Initialize the drawer to draw to canvas
  let smilesDrawer = new SmilesDrawer.Drawer(options);
  // Alternatively, initialize the SVG drawer:
  // let svgDrawer = new SmilesDrawer.SvgDrawer(options);

  input.addEventListener('input', function () {
    // Clean the input (remove unrecognized characters, such as spaces and tabs) and parse it
    SmilesDrawer.parse(input.value, function (tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'example-canvas', 'light', false);
      // Alternatively, draw to SVG:
      // svgDrawer.draw(tree, 'output-svg', 'dark', false);
    });
  });

  return (
    <div>
      <head>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Smiles Drawer Example</title>
        <meta name="description" content="A minimal smiles drawer example." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link href="https://fonts.googleapis.com/css?family=Droid+Sans:400,700" rel="stylesheet" />
      </head>
      <body>
        <input id="example-input" name="example-input" />
        <canvas id="example-canvas" width="500" height="500"></canvas>

        <script src="https://unpkg.com/smiles-drawer@1.0.10/dist/smiles-drawer.min.js"></script>
      </body>
    </div>
  );
});
