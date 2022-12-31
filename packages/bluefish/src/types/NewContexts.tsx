// we're gonna try to excise as much React ref as possible.
// we're gonna replace them with contexts
// this is because refs have a _much_ more complicated rendering semantics that is getting
// cumbersome to reason about. they are synchronous, and don't necessarily update their
// dependencies. they are often a step behind the rest of the render pipeline, which causes a lot of
// unnecessary re-renders. It also causes us to "track" dependencies via useEffect calls rather than
// updating props, which is ugly and not idiomatic. again, harder to reason about than the
// alternative of contexts.
// contexts also support naming scopes nicely (via jotai molecule interface, e.g.) and can be used
// to emulate svelte stores and two-way bindings.
// the straw that broke the camel's back was trying to implement constraints in user space (i.e.
// change the rendered components based on constraint values) the problem was that constraints are
// stored on the ref, but the ref basically only works "on the way up" from the child whereas
// constraints are actually passed down. we have no way to "intercept" this passage downwards. the
// alternative would be to pass the constraints as props, but we don't want users to have to manage
// constraint props explicitly. that's why we use contexts instead.

/* 

Grandparent --constraints-> Parent <-measurables-- Child

*/

/* 
steps
- wrap all the children in context providers that link the constraints to state in the parent
- wrap all the children in context providers that link the measurables to state in the parent
- have some way to grab the measurables from the parent for layout purposes
- children can look up their constraints from the context for rendering
- children can look up their measurables from the context for rendering(?)
- children can push measurable information to the parent context for layout purposes

I think this is similar to the solution grant came up with many months ago... lol. lmao.

The problem is going to be using information from one child to inform another in a way that is
idiomatic to React. I think I can use callbacks in contexts to mutate state synchronously. This is a
little bit like using refs, but I have more control over when they are executed (I think). I think I
should be able to batch update everything once the synchronous part is done.

I think the behavior I really want is that any time you call measure, execution suspends and runs
the child, then execution resumes. It's actually ok at that point to "restart" the entire parent
layout since React caches the results assuming the constraints don't change. This assumes that the
layout isn't expensive to recompute though...
*/

export {};
