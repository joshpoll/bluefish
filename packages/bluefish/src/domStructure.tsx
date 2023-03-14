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
    nodeCategory: string
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
        totalNodes: null,
        nodeCategory: 'Ref',
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
        totalNodes: any;
        nodeCategory: string;
      } = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: false,
        nodeHref: null,
        childIndex: null,
        totalNodes: null,
        nodeCategory: domElement.getAttribute('aria-label'),
      };

      // Add to idToElemMap
      idToElemMap.set(groupObject.nodeId, groupObject);

      // Process Children
      const children = Array.from(domElement.childNodes);

      children.forEach((child) => {
        const childJSON = parseDOMtoJSON(child);
        if (childJSON !== null) {
          groupObject.nodeChildren.push(childJSON);
        }
      });

      const totalChildren = groupObject.nodeChildren.length;
      groupObject.nodeChildren.forEach((child, index) => {
        child.childIndex = index + 1;
        child.totalNodes = totalChildren;
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

      linkNode.setAttribute('id', `${diagramJSON.nodeDescription}-desc-link`);
      linkNode.setAttribute('href', `#${diagramJSON.nodeDescription}-desc`);

      const linkTarget = idToElemMap.get(diagramJSON.nodeDescription);

      // Add hyperlink text & return
      const linkString = `${diagramJSON.childIndex} of ${diagramJSON.totalNodes}. Go to ${linkTarget.nodeCategory} (${linkTarget.childIndex} of ${linkTarget.totalNodes})`;
      const textNode = document.createTextNode(linkString);
      linkNode.appendChild(textNode);
      return linkNode;
    } else if (diagramJSON.nodeChildren.length == 0) {
      const groupNode = document.createElement('g');
      groupNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

      // set text of group node to nodeDescription
      const linkString = `${diagramJSON.childIndex} of ${diagramJSON.totalNodes}. ${diagramJSON.nodeDescription}`;
      const textNode = document.createTextNode(linkString);
      groupNode.appendChild(textNode);

      return groupNode;
    }

    // recursive case
    const groupNode = document.createElement('g');
    groupNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

    const linkString = `${diagramJSON.childIndex} of ${diagramJSON.totalNodes}. ${diagramJSON.nodeDescription}`;
    groupNode.setAttribute('aria-label', linkString);

    // create paragraph node with nodedescription text
    const textNode = document.createElement('p');
    textNode.appendChild(document.createTextNode(linkString));
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
          linkChild.setAttribute('aria-label', `${to}`);
          (domObjectFrom as any).appendChild(linkChild);
        }

        if (domObjectTo) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${parent}`);
          linkChild.setAttribute('aria-label', `${parent}`);
          (domObjectTo as any).appendChild(linkChild);
        }
      });

      // ~~~~ Creates JSON object from SVG ~~~~

      const allJSONs = createJSONfromBluefish();
      console.log('the map: ', idToElemMap);

      // ~~~~ Creates DOM structure from JSON ~~~~

      const diagramNode = parseJSONtoDOM(allJSONs[0]);
      // console.log('diagramNode: ', diagramNode);

      // append diagramNode to body
      document.body.appendChild(diagramNode);
    }, 1000);
  }, []);

  return null;
}
