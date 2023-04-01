/* Copied from https://github.com/marigold-ui/marigold/pull/1798, which fixes a bug in
react-keyed-flatten-children (see below) */
import { ReactNode, ReactElement, Children, isValidElement, cloneElement } from 'react';
import { isContextProvider, isFragment } from 'react-is';
import { Fragment } from './components/Fragment';
import { LayoutGroup } from './components/LayoutGroup';

// jmp addition: inlining b/c ReactChild is deprecated
export type ReactChild = ReactElement | string | number;

/**
 * Similar to [React's built-in `Children.toArray` method](https://reactjs.org/docs/react-api.html#reactchildrentoarray),
 * this utility takes children and returns them as an array for introspection or filtering.
 *
 * Different from `Children.toArray`, it will flatten arrays and `React.Fragment`s into a regular, one-dimensional
 * array while ensuring element and fragment keys are preserved, unique, and stable between renders.
 *
 * Copied from https://github.com/grrowl/react-keyed-flatten-children (since ESM import doesn't work with the module)
 */
export const flattenChildren = (children: ReactNode, depth: number = 0, keys: (string | number)[] = []): ReactChild[] =>
  Children.toArray(children).reduce((acc: ReactChild[], node) => {
    if (isFragment(node)) {
      acc.push.apply(
        acc,
        flattenChildren(
          node.props.children,
          depth + 1,
          /**
           * No need for index fallback, React will always assign keys
           * See: https://reactjs.org/docs/react-api.html#reactchildrentoarray
           */
          keys.concat(node.key!),
        ),
      );
    } else if (isContextProvider(node)) {
      // like fragment case, but still renders the provider
      // acc.push(
      //   cloneElement(node, {
      //     key: keys.concat(String(node.key)).join('.'),
      //     children: flattenChildren(node.props.children, depth + 1, keys.concat(node.key!)),
      //   }),
      // );
      acc.push.apply(
        acc,
        flattenChildren(
          node.props.children,
          depth + 1,
          /**
           * No need for index fallback, React will always assign keys
           * See: https://reactjs.org/docs/react-api.html#reactchildrentoarray
           */
          keys.concat(node.key!),
        ),
      );
    } else {
      if (isValidElement(node)) {
        acc.push(
          cloneElement(node, {
            key: keys.concat(String(node.key)).join('.'),
          }),
        );
      } else if (typeof node === 'string' || typeof node === 'number') {
        acc.push(node);
      }
    }
    return acc;
  }, []);

export type ChildGroup =
  // single child
  | ReactChild
  // LayoutGroup with no key
  | ChildGroup[]
  // LayoutGroup with key
  | { key: string; value: ChildGroup[] };

// TODO: the way layoutKeys should work is that we need to use it to index into the returned
// object later... I think?
export const flattenChildrenToGroups = (
  children: ReactNode,
  depth: number = 0,
  keys: (string | number)[] = [],
  // layoutKeys: (string | number)[] = [],
): ChildGroup[] => {
  const result = Children.toArray(children).reduce((acc: ChildGroup[], node) => {
    if (isFragment(node)) {
      acc.push.apply(
        acc,
        flattenChildrenToGroups(
          node.props.children,
          depth + 1,
          /**
           * No need for index fallback, React will always assign keys
           * See: https://reactjs.org/docs/react-api.html#reactchildrentoarray
           */
          keys.concat(node.key!),
          // layoutKeys,
        ),
      );
    }
    // else if (isContextProvider(node)) {
    //   // like fragment case, but still renders the provider
    //   // TODO: I'm not sure this actually works correctly since the children of the provider are
    //   // never added to the map...
    //   acc.push(
    //     cloneElement(node, {
    //       key: keys.concat(String(node.key)).join('.'),
    //       children: flattenChildrenToGroups(node.props.children, depth + 1, keys.concat(node.key!) /* layoutKeys */),
    //     }),
    //   );
    // }
    else {
      if (isValidElement(node)) {
        const newNode = cloneElement(node, {
          key: keys.concat(String(node.key)).join('.'),
        });
        if (node.type === LayoutGroup && 'props' in node && 'children' in (node.props as any)) {
          if ('id' in (node.props as any) && (node.props as any).id !== undefined) {
            // named key
            const layoutKey = (node.props as any).id;
            // if (layoutKeys.indexOf(layoutKey) === -1) {
            //   layoutKeys.push(layoutKey);
            // }
            acc.push({
              key: layoutKey,
              value: flattenChildrenToGroups(
                (node.props as any).children,
                depth + 1,
                keys.concat(node.key!),
                // layoutKeys,
              ),
            });
          } else {
            // anonymous key
            acc.push(
              flattenChildrenToGroups(
                (node.props as any).children,
                depth + 1,
                /**
                 * No need for index fallback, React will always assign keys
                 * See: https://reactjs.org/docs/react-api.html#reactchildrentoarray
                 */
                keys.concat(node.key!),
                // layoutKeys,
              ),
            );
          }
        } else {
          acc.push(newNode);
        }
      } else if (typeof node === 'string' || typeof node === 'number') {
        acc.push(node);
      }
    }
    return acc;
  }, []);
  return result;
};

export type StructureChildrenResult = {
  object: { [key: string]: ReactChild[] };
  array: ReactChild[];
};

// export type StructuredChildren =
//   | {
//       [key: string]: StructuredChildren;
//     }
//   | StructuredChildren[]
//   | ReactChild;

// type IntermediateStructuredChildrenResult = {
//   object: { [key: string]: StructuredChildren };
//   array: StructuredChildren[];
// };

export const structureChildren = (
  children: ReactNode,
  depth: number = 0,
  keys: (string | number)[] = [],
): StructureChildrenResult =>
  Children.toArray(children).reduce(
    (acc: StructureChildrenResult, node) => {
      if (isFragment(node)) {
        const childrenRes = structureChildren(
          node.props.children,
          depth + 1,
          /**
           * No need for index fallback, React will always assign keys
           * See: https://reactjs.org/docs/react-api.html#reactchildrentoarray
           */
          keys.concat(node.key!),
        );
        acc.array.push.apply(acc.array, childrenRes.array);
        // merge the childrenRes.object arrays into the acc.object arrays
        Object.keys(childrenRes.object).forEach((key) => {
          if (acc.object[key]) {
            acc.object[key].push.apply(acc.object[key], childrenRes.object[key]);
          }
        });
      } else if (isContextProvider(node)) {
        // TODO: I'm not sure this actually works correctly since the children of the provider are
        // never added to the map...
        acc.array.push(
          cloneElement(node, {
            key: keys.concat(String(node.key)).join('.'),
            // children: structureChildren(node.props.children, depth + 1, keys.concat(node.key!)),
          }),
        );
      } else {
        if (isValidElement(node)) {
          const newNode = cloneElement(node, {
            key: keys.concat(String(node.key)).join('.'),
          });
          if (node.type === Fragment && 'props' in node && 'children' in (node.props as any)) {
            if ('layoutKey' in (node.props as any) && (node.props as any).layoutKey !== undefined) {
              if (acc.object[(node.props as any).layoutKey] === undefined) {
                acc.object[(node.props as any).layoutKey] = [];
              }
              acc.object[(node.props as any).layoutKey].push(newNode);
            } else {
              const childrenRes = structureChildren(
                (node.props as any).children,
                depth + 1,
                /**
                 * No need for index fallback, React will always assign keys
                 * See: https://reactjs.org/docs/react-api.html#reactchildrentoarray
                 */
                keys.concat(node.key!),
              );
              // TODO: add this back once type is better
              // acc.array.push(childrenRes.array);
            }
          } else {
            acc.array.push(newNode);
          }
        } else if (typeof node === 'string' || typeof node === 'number') {
          acc.array.push(node);
        }
      }
      return acc;
    },
    {
      object: {},
      array: [],
    },
  );
