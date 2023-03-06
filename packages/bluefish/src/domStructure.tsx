import { useEffect } from 'react';
// import { renderTree } from './TreeRender';

export function DomStructure() {
  useEffect(() => {
    // put timer for 1 second
    setTimeout(() => {
      const allRefs = Array.from(document.querySelectorAll('.ref'));
      // for each ref in allRefs, get the data-to attribute

      // for each ref in allRefs, get the parent node of the ref
      const allRefsParent = allRefs.map((ref) => ref.parentNode);
      const allRefsTo = allRefs.map((ref) => ref.getAttribute('data-to'));

      const refs = allRefs.map((ref) => ({
        parent: (ref.parentNode as any).getAttribute('id'),
        to: ref.getAttribute('data-to'),
      }));
      // console.log(
      //   'allRefs',
      //   Array.from(allRefs).map((ref: any) => {
      //     return ref.innerHTML;
      //   }),
      // );
      // console.log(`allRefs`, allRefs);
      // console.log('allRefsTo', allRefsTo);
      refs.forEach(({ parent, to }) => {
        if (!parent || !to) {
          return;
        }

        const domObjectFrom = window[parent as any];
        const domObjectTo = window[to as any];
        // console.log('dom objects');
        // console.log(domObject);

        if (domObjectFrom) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${to}`);
          // create SVG text node
          const textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          linkChild.appendChild(textNode);
          linkChild.setAttribute('aria-label', `Link to ${to}`);
          // console.log(linkChild);
          (domObjectFrom as any).appendChild(linkChild);
        }

        if (domObjectTo) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${parent}`);
          // create SVG text node
          const textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          linkChild.appendChild(textNode);
          linkChild.setAttribute('aria-label', `Link to ${parent}`);
          // console.log(linkChild);
          (domObjectTo as any).appendChild(linkChild);
        }

        // console.log(domObject);
      });

      // console.log(allRefsTo);
    }, 1000);
  }, []);

  return null;
}
