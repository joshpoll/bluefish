import { useEffect } from 'react';
import { Tree } from './Tree';

export function DomStructure() {
  /* 
  Structure of JSON object:
  {
    nodeId: number
    nodeDescription: string
    nodeChildren: []
    nodeIsLink: boolean
  }
  */
  function createJSONfromBluefish() {
    // get all SVGS from the DOM
    const allSVGS = Array.from(document.querySelectorAll('svg'));

    // for each SVG, get the root group
    const allRootGroups = allSVGS.map((svg) => svg.querySelector('g'));

    // for each root group, call parseDOMtoJSON
    const allJSON = allRootGroups.map((rootGroup) => parseDOMtoJSON(rootGroup));

    return allJSON;
  }

  /* Recurive helper function that creates JSON object from SVG */
  function parseDOMtoJSON(domElement: any) {
    // Link object (base case)
    if (domElement.tagName === 'a') {
      const linkObject = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: true,
        nodeHref: domElement.getAttribute('href'),
      };

      return linkObject;
    }

    // Group object
    if (domElement.tagName === 'g') {
      // if group has class ref, then return null
      if (domElement.classList.contains('ref')) {
        return null;
      }

      const groupObject: {
        nodeId: any;
        nodeDescription: any;
        nodeIsLink: boolean;
        nodeChildren: any[];
        nodeHref: any;
      } = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: false,
        nodeHref: null,
      };

      // get all children of the group
      const children = Array.from(domElement.childNodes);

      // for each child, call parseDOMtoJSON
      children.forEach((child) => {
        const childJSON = parseDOMtoJSON(child);
        if (childJSON !== null) {
          groupObject.nodeChildren.push(childJSON);
        }
      });

      return groupObject;
    }

    return null;
  }

  /*
  Parses JSON object and creates DOM structure
  */
  function parseJSONtoDOM(diagramJSON: any) {
    // Base case: link or no children
    if (diagramJSON.nodeIsLink) {
      const linkNode = document.createElement('a');
      const linkTo = diagramJSON.nodeHref.substring(1, diagramJSON.nodeHref.length);

      linkNode.setAttribute('id', `${linkTo}-desc-link`);
      linkNode.setAttribute('href', `#${linkTo}-desc`);

      // add description to link
      const textNode = document.createTextNode(diagramJSON.nodeDescription);
      linkNode.appendChild(textNode);

      return linkNode;
    } else if (diagramJSON.nodeChildren.length == 0) {
      const divNode = document.createElement('div');
      divNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

      // set text of divNode to nodeDescription
      const textNode = document.createTextNode(diagramJSON.nodeDescription);
      divNode.appendChild(textNode);

      return divNode;
    }

    // recursive case
    const divNode = document.createElement('div');
    divNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

    // set text of divNode to nodeDescription
    const textNode = document.createTextNode(diagramJSON.nodeDescription);
    divNode.appendChild(textNode);

    // create UL node to contain all the children
    const ulNode = document.createElement('ul');

    diagramJSON.nodeChildren.forEach((child: any) => {
      // create new li node
      const liNode = document.createElement('li');
      const childNode = parseJSONtoDOM(child);

      liNode.appendChild(childNode);
      ulNode.appendChild(liNode);
    });

    divNode.appendChild(ulNode);

    return divNode;
  }

  useEffect(() => {
    // put timer for 1 second
    setTimeout(() => {
      // ~~~~ Modifies DOM to create links ~~~~
      const allRefs = Array.from(document.querySelectorAll('.ref'));

      // for each ref in allRefs, get the parent node of the ref
      const allRefsParent = allRefs.map((ref) => ref.parentNode);
      const allRefsTo = allRefs.map((ref) => ref.getAttribute('data-to'));

      const refs = allRefs.map((ref) => ({
        parent: (ref.parentNode as any).getAttribute('id'),
        to: ref.getAttribute('data-to'),
      }));
      refs.forEach(({ parent, to }) => {
        if (!parent || !to) {
          return;
        }

        const domObjectFrom = window[parent as any];
        const domObjectTo = window[to as any];

        if (domObjectFrom) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${to}`);
          linkChild.setAttribute('aria-label', `Link to element with ID ${to}`);
          (domObjectFrom as any).appendChild(linkChild);
        }

        if (domObjectTo) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${parent}`);
          linkChild.setAttribute('aria-label', `Link to element with ID ${parent}`);
          (domObjectTo as any).appendChild(linkChild);
        }
      });

      // ~~~~ Creates JSON object from SVG ~~~~

      const allJSONs = createJSONfromBluefish();
      console.log('allJSONs', allJSONs);

      // ~~~~ Creates DOM structure from JSON ~~~~

      const diagramNode = parseJSONtoDOM(allJSONs[0]);
      // console.log('diagramNode: ', diagramNode);

      // append diagramNode to body
      document.body.appendChild(diagramNode);
    }, 1000);
  }, []);

  return null;
}
