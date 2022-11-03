import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'Bluefish',
    sourcemap: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      // canvas: 'canvas',
    },
  },
  external: ['react', 'react-dom' /* , 'canvas' */],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    nodePolyfills(),
    typescript({
      outputToFilesystem: true,
    }),
    json(),
    commonjs(),
    nodeResolve(),
  ],
};

/* 
Let's define comics!

proposal: sequential art
but: There are a lot of different kinds of art. How about something a little more specific?
thought: the difference is we want to focus on _visual_ art.

proposal: sequential visual art
but: What about animation? Isn't animated film just visual art in sequence?
thought: I guess the basic difference is that animation is sequential in time, but not spatially
juxtaposed as comics are. Space does for comics what time does for film!

proposal: juxtaposed sequential visual art
but: Does it have to say "art"? Doesn't that imply some sort of value judgement?
thought: I guess we can replace "art"

proposal: juxtaposed sequential static images


*/
