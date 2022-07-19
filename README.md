# TODO:

short-term goals:
- boundary paths for boundary labels
  - some questions about data dependencies for this... probably need to pass boundary as an argument
    to layout and/or paint.
  - but could also pass boundary after the first object is painted...
  - just pick one and figure it out later
- working group primitive
- bracket

# DONE (mostly):
- references for arrows (just hack it in the easiest possible way for now)
  - most bang for the buck b/c broader applicability
  - but potentially harder than boundary paths...
  - see what swiftui/flutter do for references. ok... they use either explicitly position data in
    nodes or abuse the 'preferences' upwards data movement. neither of these is particularly
    compelling to me
  - I will keep an in-memory representation of the view tree after _layout_, which can be used by
    later steps. in this case arrows will be able to read layout of other nodes before placement

# broader plans:
- group, stack, choice. start with more limited expressiveness for now
- general layout pass + reference + dodge structure (similar to ggplot2 layering)
- goals: graphviz, tidy tree, LaTeX web implementation, occupancy bitmap labeling, math augmentation
  benchmarks, GoG(s), pretty printer
- benchmark examples????
  - pretty-printed code with highlighting and annotations
  - LaTeX with highlighting and annotations
  - auto-labeling on something other than a chart
  - nudging and bracketing and underlining latex after the fact
  - blobby diagram using occupancy bitmap (or similar) placement of diagram pieces inside
- stretch-ish goal: polar coordinate stuff? reviewers will ask about it

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
