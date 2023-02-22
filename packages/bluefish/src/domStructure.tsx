import { useEffect } from 'react';

export function DomStructure() {
  useEffect(() => {
    // put timer for 1 second
    setTimeout(() => {
      const allRefs = Array.from(document.querySelectorAll('.ref'));
      // for each ref in allRefs, get the data-to attribute

      const allRefsTo = allRefs.map((ref) => ref.getAttribute('data-to'));
      // console.log(
      //   'allRefs',
      //   Array.from(allRefs).map((ref: any) => {
      //     return ref.innerHTML;
      //   }),
      // );
      // console.log(`allRefs`, allRefs);
      // console.log('allRefsTo', allRefsTo);
      allRefsTo.forEach((refTo) => {
        if (!refTo) {
          return;
        }
        const domObject = window[refTo as any];
        // console.log('dom objects');
        // console.log(domObject);

        if (domObject) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${refTo}`);
          // create SVG text node
          const textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          linkChild.appendChild(textNode);
          linkChild.setAttribute('aria-label', `Link to ${refTo}`);
          // console.log(linkChild);
          (domObject as any).appendChild(linkChild);
        }

        // console.log(domObject);
      });

      // console.log(allRefsTo);
    }, 1000);
  }, []);

  return null;
}
