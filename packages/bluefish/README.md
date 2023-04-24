# Main Branch

Welcome to the main Bluefish example gallery artifact. This includes UpSet, Polio, Pythagorean
Theorem, Cars, Playfair, and GoTree.

To run this artifact, first install the dependencies by running `yarn` at top level (ensure you have
yarn installed first), then run `yarn start`. You should see the diagram appear in your browser,
typically at `localhost:3000`.

Note: Due to how Bluefish's layout engine is implemented, to see changes to a diagram you typically
have to hard refresh the page (e.g. cmd+shift+R in chrome on Mac)

All the important code is in the `src` directory.
The entrypoint to this example is in `App.tsx`. The Bluefish library can be found in `components`.
The examples can be in `examples`. Bluefish Plot and the GoTree example lie within the `grammars`
subdirectory.
