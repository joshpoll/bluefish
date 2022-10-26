# GoG in Bluefish

This is a proof-of-concept Grammar of Graphics (GoG) library written in Bluefish. It's user-facing
API is modeled after Observable Plot's. This is because (i) Plot was designed for JS syntax, (ii)
the Plot codebase is pretty small and readable, (iii) I wrote a blog post about how it works.


Some key features (some aren't implemented yet):
- using `Row` and `Col` components instead of ordinal scales
- using `Group`, `Row`, `Col`, grid, and ravel components for layering, faceting, concatenation,
  etc. instead of built-in operators
- using `Padding` instead of built-in margins
- using `Align` to place axes relative to chart instead of defining positions with code
- using `Label` for labels, which implements the Vega Label algorithm. However, this component is
  not unique to this GoG library and can be reused in other diagrams.
- fully recursive grammar rather than stopping at two levels of nesting
- coordinate transformations piggy back on Bluefish's coordinate transformations (maybe?)
- Legends are placed using a variation of `Label` that tries to place the legend in a particular
  spot while avoiding data.
- (stretch goal b/c may require re-architecting the system) features a SwiftCharts-like (also like
  Victory charts?) component modifier API for customizing e.g. axes.
- (stretch goal b/c feasibility is uncertain) features a `Dodge` component that behaves like ggplot
- (stretch goal b/c requires dynamic behavior) uses rxjs/mobx/preact signals to achieve a Vega-style
 selection system. This system is modular and can be easily reused
