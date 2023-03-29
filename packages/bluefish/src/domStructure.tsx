import React from 'react';
import { useEffect } from 'react';

export function DomStructure() {
  const domNodeRef = React.useRef<any>(null);

  let rectangleBBox = null;
  let highlightRectangleId = 'highlight-rectangle';

  const idToElemMap = new Map();

  // event handler to handle focus by screen reader
  function handleFocus(e: any) {
    e.classList.add('focus');

    const eId = e.getAttribute('id');
    const idSplit = eId.split('-');
    const targetId = idSplit[0];
    const target = document.getElementById(targetId);

    rectangleBBox = (target as any).getBBox();

    // Get rectangle for highlighting
    let highlightRectangle = document.getElementById(highlightRectangleId);

    if ((rectangleBBox.x === 0 || rectangleBBox.x < 0) && (rectangleBBox.y === 0 || rectangleBBox.y < 0)) {
      const targetWidth = target?.getAttribute('width') as any;
      const targetHeight = target?.getAttribute('height') as any;

      highlightRectangle?.setAttribute('x', `${rectangleBBox.width - targetWidth}`);
      highlightRectangle?.setAttribute('y', `${rectangleBBox.height - targetHeight}`);
      highlightRectangle?.setAttribute('width', targetWidth);
      highlightRectangle?.setAttribute('height', targetHeight);
    } else {
      const rectWidth = rectangleBBox.width < 5 ? 5 : rectangleBBox.width;
      const rectHeight = rectangleBBox.height < 5 ? 5 : rectangleBBox.height;

      console.log('this is the width: ', rectWidth, 'this is the height: ', rectHeight);

      highlightRectangle?.setAttribute('x', rectangleBBox.x);
      highlightRectangle?.setAttribute('y', rectangleBBox.y);
      highlightRectangle?.setAttribute('width', rectWidth);
      highlightRectangle?.setAttribute('height', rectHeight);
    }

    highlightRectangle?.setAttribute('opacity', '0.5');
    highlightRectangle?.setAttribute('fill', 'red');

    console.log('targetid: ', targetId);
    console.log('target: ', target);
    console.log('boundingbox: ', rectangleBBox);
    console.log('successfully added focus to: ', e.getAttribute('id'));
  }

  // event handler to remove focus by screen reader
  function handleBlur(e: any) {
    e.classList.remove('focus');

    const eId = e.getAttribute('id');
    const idSplit = eId.split('-');
    const targetId = idSplit[0];
    const target = document.getElementById(targetId);
    rectangleBBox = (target as any).getBBox();

    // Get rectangle for highlighting
    let highlightRectangle = document.getElementById(highlightRectangleId);
    highlightRectangle?.setAttribute('fill', 'none');

    console.log('successfully removed focus from: ', e.getAttribute('id'));
  }

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
    const allSVGS = Array.from(document.querySelectorAll('svg'));
    const allRootGroups = allSVGS.map((svg) => svg.querySelector('g'));
    const allJSON = allRootGroups.map((rootGroup) => parseDOMtoJSON(rootGroup));
    return allJSON;
  }

  /* Recurive helper function that creates JSON object from SVG */
  function parseDOMtoJSON(domElement: any) {
    // Base case: Link Object
    if (domElement.tagName === 'a') {
      const linkObject = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: true,
        nodeHrefSource: domElement.getAttribute('data-parent'),
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
      // Edge case: group is ref or hidden from screen reader, then don't include
      if (domElement.classList.contains('ref') || domElement.getAttribute('aria-hidden') === 'true') {
        return null;
      }

      // Initialize group object
      const groupObject: {
        nodeId: any;
        nodeDescription: any;
        nodeIsLink: boolean;
        nodeChildren: any[];
        nodeHref: any;
        childIndex: any;
        totalNodes: any;
        nodeCategory: string;
        nodeHrefSource: any;
      } = {
        nodeId: domElement.getAttribute('id'),
        nodeDescription: domElement.getAttribute('aria-label'),
        nodeChildren: [],
        nodeIsLink: false,
        nodeHref: null,
        childIndex: null,
        totalNodes: null,
        nodeCategory: domElement.getAttribute('aria-label'),
        nodeHrefSource: null,
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

      if (groupObject.nodeChildren.length !== 0) {
        groupObject.nodeDescription = groupObject.nodeDescription + ` with ${groupObject.nodeChildren.length} refs`;
      }

      return groupObject;
    }

    return null;
  }

  /*
  Parses JSON object and creates DOM structure
  */
  function parseJSONtoDOM(diagramJSON: any) {
    // Base case: node is link or has no children
    if (diagramJSON.nodeIsLink) {
      const linkNode = document.createElement('a');
      linkNode.setAttribute('id', `${diagramJSON.nodeHrefSource}-link_${diagramJSON.nodeId}`);
      linkNode.setAttribute('href', `${diagramJSON.nodeHref}-desc`);
      const linkTarget = idToElemMap.get(diagramJSON.nodeHref.substring(1));

      // Add hyperlink text & return
      const linkDescription = `${diagramJSON.childIndex} of ${diagramJSON.totalNodes}. Go to ${linkTarget.nodeCategory} (${linkTarget.childIndex} of ${linkTarget.totalNodes})`;
      const textNode = document.createTextNode(linkDescription);
      linkNode.appendChild(textNode);

      linkNode.addEventListener('focus', () => handleFocus(linkNode));
      linkNode.addEventListener('blur', () => handleBlur(linkNode));
      return linkNode;
    } else if (diagramJSON.nodeChildren.length == 0) {
      const groupNode = document.createElement('div');
      groupNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

      // set text of group node to nodeDescription
      const groupDescription = `${diagramJSON.childIndex} of ${diagramJSON.totalNodes}. ${diagramJSON.nodeDescription}`;
      const textNode = document.createTextNode(groupDescription);
      groupNode.appendChild(textNode);
      groupNode.setAttribute('tabindex', '0');

      groupNode.addEventListener('focus', () => handleFocus(groupNode));
      groupNode.addEventListener('blur', () => handleBlur(groupNode));

      return groupNode;
    }

    // recursive case
    const groupNode = document.createElement('div');
    groupNode.setAttribute('id', `${diagramJSON.nodeId}-desc`);

    let groupDescription = `${diagramJSON.childIndex} of ${diagramJSON.totalNodes}. ${diagramJSON.nodeDescription}`;

    if (diagramJSON.childIndex === null || diagramJSON.totalNodes === null) {
      groupDescription = `${diagramJSON.nodeDescription}`;
    }

    groupNode.setAttribute('aria-label', groupDescription);

    // create paragraph node with nodedescription text
    const textNode = document.createElement('p');
    textNode.setAttribute('style', 'text-align: left;');

    textNode.appendChild(document.createTextNode(groupDescription));
    textNode.setAttribute('aria-hidden', 'true');
    groupNode.appendChild(textNode);

    // create UL node to contain all the children
    const ulNode = document.createElement('ul');
    ulNode.setAttribute('style', 'list-style-type: none;');

    diagramJSON.nodeChildren.forEach((child: any) => {
      const liNode = document.createElement('li');
      liNode.setAttribute('style', 'text-align: left;');

      const childNode = parseJSONtoDOM(child);

      liNode.appendChild(childNode);
      ulNode.appendChild(liNode);
    });

    groupNode.appendChild(ulNode);
    groupNode.setAttribute('tabindex', '0');

    groupNode.addEventListener('focus', () => handleFocus(groupNode));
    groupNode.addEventListener('blur', () => handleBlur(groupNode));
    return groupNode;
  }

  useEffect(() => {
    // put timer for 1 second
    setTimeout(() => {
      if (domNodeRef.current) {
        return;
      }
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
          linkChild.setAttribute('aria-label', `Link to ${to}`);
          linkChild.setAttribute('data-parent', `${parent}`);
          (domObjectFrom as any).appendChild(linkChild);
        }

        if (domObjectTo) {
          const linkChild = document.createElementNS('http://www.w3.org/2000/svg', 'a');
          linkChild.setAttribute('href', `#${parent}`);
          linkChild.setAttribute('aria-label', `Link to ${parent}`);
          linkChild.setAttribute('data-parent', `${to}`);
          (domObjectTo as any).appendChild(linkChild);
        }
      });

      // add rectangle to DOM for highlighting
      const highlightRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      highlightRect.setAttribute('aria-hidden', 'true');
      highlightRect.setAttribute('id', highlightRectangleId);
      highlightRect.setAttribute('x', '0');
      highlightRect.setAttribute('y', '0');
      highlightRect.setAttribute('width', '0');
      highlightRect.setAttribute('height', '0');
      highlightRect.setAttribute('fill', 'none');
      const root = document.getElementById('root');
      const app = root?.firstChild;
      const molecule = app?.firstChild;
      const moleculeSVG = molecule?.firstChild;
      moleculeSVG?.appendChild(highlightRect);

      // ~~~~ Creates JSON object from SVG ~~~~

      const allJSONs = createJSONfromBluefish();
      console.log('the map: ', idToElemMap);

      // ~~~~ Creates DOM structure from JSON ~~~~

      const diagramNode = parseJSONtoDOM(allJSONs[0]);
      diagramNode.setAttribute('style', 'overflow: auto; height: 550px; width: 500px;');
      // diagramNode.style. = '';

      domNodeRef.current = diagramNode;
      app?.appendChild(diagramNode);

      // document.body.appendChild(diagramNode);
    }, 1000);
  }, []);

  return null;
}
