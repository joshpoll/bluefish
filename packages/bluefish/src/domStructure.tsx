import { useEffect } from 'react';
import { Tree } from './Tree';

export function DomStructure() {
  const idToElemMap = new Map();

  /* 
  Structure of JSON object:
  {
    nodeId: number
    nodeDescription: string
    nodeChildren: []
    nodeIsLink: boolean
    nodeHref: string
    childIndex: number
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
    if (domElement.tagName === 'a') {
      const linkObject = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: true,
        nodeHref: domElement.getAttribute('href'),
        childIndex: null,
      };

      idToElemMap.set(linkObject.nodeId, linkObject);
      return linkObject;
    }

    // Group object
    if (domElement.tagName === 'g') {
      // Base case: group is ref or hidden from screen reader
      if (domElement.classList.contains('ref') || domElement.getAttribute('aria-hidden') === 'true') {
        return null;
      }

      const groupObject: {
        nodeId: any;
        nodeDescription: any;
        nodeIsLink: boolean;
        nodeChildren: any[];
        nodeHref: any;
        childIndex: any;
      } = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: false,
        nodeHref: null,
        childIndex: null,
      };

      // Add to idToElemMap
      idToElemMap.set(groupObject.nodeId, groupObject);

      // Process Children
      const children = Array.from(domElement.childNodes);
      const numChildren = children.length;

      children.forEach((child, index) => {
        const childJSON = parseDOMtoJSON(child);
        if (childJSON !== null) {
          childJSON.childIndex = index;
          groupObject.nodeChildren.push(childJSON);
        }
      });

      groupObject.nodeDescription = groupObject.nodeDescription + ` with ${groupObject.nodeChildren.length} refs`;

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
      const groupNode = document.createElement('g');
      groupNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

      // set text of group node to nodeDescription
      const textNode = document.createTextNode(diagramJSON.nodeDescription);
      groupNode.appendChild(textNode);

      return groupNode;
    }

    // recursive case
    const groupNode = document.createElement('g');
    groupNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);
    groupNode.setAttribute('aria-label', diagramJSON.nodeDescription);

    // create paragraph node with nodedescription text
    const textNode = document.createElement('p');
    textNode.appendChild(document.createTextNode(diagramJSON.nodeDescription));
    textNode.setAttribute('aria-hidden', 'true');
    groupNode.appendChild(textNode);

    // create UL node to contain all the children
    const ulNode = document.createElement('ul');
    ulNode.setAttribute('style', 'list-style-type: none;');

    diagramJSON.nodeChildren.forEach((child: any) => {
      const liNode = document.createElement('li');
      const childNode = parseJSONtoDOM(child);

      liNode.appendChild(childNode);
      ulNode.appendChild(liNode);
    });

    groupNode.appendChild(ulNode);

    return groupNode;
  }

  useEffect(() => {
    // put timer for 1 second
    setTimeout(() => {
      // ~~~~ Modifies DOM to create links ~~~~
      const allRefs = Array.from(document.querySelectorAll('.ref'));

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
          linkChild.setAttribute('aria-label', `Go to element with ID ${to}`);
          (domObjectFrom as any).appendChild(linkChild);
        }

        if (domObjectTo) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${parent}`);
          linkChild.setAttribute('aria-label', `Go to element with ID ${parent}`);
          (domObjectTo as any).appendChild(linkChild);
        }
      });

      // ~~~~ Creates JSON object from SVG ~~~~

      const allJSONs = createJSONfromBluefish();
      // console.log('allJSONs', allJSONs);

      // ~~~~ Creates DOM structure from JSON ~~~~

      const diagramNode = parseJSONtoDOM(allJSONs[0]);
      // console.log('diagramNode: ', diagramNode);

      // append diagramNode to body
      document.body.appendChild(diagramNode);
    }, 1000);
  }, []);

  return null;
}
