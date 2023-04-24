/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   Treeitem.js
 *
 *   Desc:   Treeitem widget that implements ARIA Authoring Practices
 *           for a tree being used as a file viewer
 */

import { Tree } from './Tree';

/*
 *   @constructor
 *
 *   @desc
 *       Treeitem object for representing the state and user interactions for a
 *       treeItem widget
 *
 *   @param node
 *       An element with the role=tree attribute
 */

export class TreeItem {
  tree: Tree;
  domNode: HTMLElement;
  isExpandable: boolean;
  isVisible: boolean;
  inGroup: boolean;

  parent?: TreeItem;
  children: TreeItem[];
  lastVisitedChild?: TreeItem;

  keyCode!: Readonly<{
    RETURN: number;
    SPACE: number;
    PAGEUP: number;
    PAGEDOWN: number;
    END: number;
    HOME: number;
    LEFT: number;
    UP: number;
    RIGHT: number;
    DOWN: number;
    X: number;
    Y: number;
    G: number;
    L: number;
    W: number;
    A: number;
    S: number;
    D: number;
    ESCAPE: number;
    PLUS: number;
    MINUS: number;
  }>;

  constructor(node: HTMLElement, treeObj: Tree, parent?: TreeItem) {
    node.tabIndex = -1;
    this.tree = treeObj;
    this.domNode = node;

    this.isExpandable = false;
    this.isVisible = false;
    this.inGroup = false;

    if (parent) {
      this.inGroup = true;
    }

    this.parent = parent;
    this.children = [];

    let elem = node.firstElementChild;

    while (elem) {
      // if (['ul', 'table', 'th', 'td'].includes(elem.tagName.toLowerCase())) {

      if (
        ['ul', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'g', 'circle', 'text', 'rect', 'line', 'a'].includes(
          elem.tagName.toLowerCase(),
        )
      ) {
        // if (['ul', 'table'].includes(elem.tagName.toLowerCase())) {
        this.isExpandable = true;
        break;
      }

      elem = elem.nextElementSibling;
    }

    this.keyCode = Object.freeze({
      RETURN: 13,
      SPACE: 32,
      PAGEUP: 33,
      PAGEDOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      X: 88,
      Y: 89,
      L: 76,
      G: 71,
      W: 87,
      A: 65,
      S: 83,
      D: 68,
      ESCAPE: 27,
      PLUS: 107,
      MINUS: 189,
    });
  }

  init() {
    this.domNode.tabIndex = -1;

    this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
    this.domNode.addEventListener('click', this.handleClick.bind(this));
    this.domNode.addEventListener('focus', this.handleFocus.bind(this));
    this.domNode.addEventListener('blur', this.handleBlur.bind(this));

    if (!this.isExpandable) {
      this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
      this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }
  }

  isExpanded() {
    if (this.isExpandable) {
      return this.domNode.getAttribute('aria-expanded') === 'true';
    }
    return false;
  }

  /* EVENT HANDLERS */
  handleKeydown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    // TODO this was lateral nav

    // if (event.shiftKey) {
    //     let root = this.getRootNode();
    //     if (event.keyCode == this.keyCode.SPACE || event.keyCode == this.keyCode.RETURN) {
    //         event.stopPropagation();
    //     } else if (root.label.includes('nested charts') && event.target === this.domNode) {
    //         const nodePosition = (item: TreeItem): number[] => {
    //             let arr: number[] = [];
    //             let node: TreeItem = item
    //             while (node !== undefined) {
    //                 if (node.parent) {
    //                     let index: number = node.parent.children.indexOf(node);
    //                     if (index !== -1) {
    //                         arr.push(index)
    //                     }
    //                 }
    //                 node = node.parent
    //             }
    //             return arr
    //         }

    //         if (event.keyCode === this.keyCode.LEFT) {
    //             let pos: number[] = nodePosition(this).reverse()
    //             pos[0] = pos[0] - 1
    //             if (pos[0] >= 0) {
    //                 this.shiftToNode(pos)
    //             }
    //         } else if (event.keyCode === this.keyCode.RIGHT) {
    //             let pos: number[] = nodePosition(this).reverse()
    //             pos[0] = pos[0] + 1
    //             if (pos[pos.length - 1] < root.children.length) {
    //                 this.shiftToNode(pos)
    //             }
    //         }
    //     }
    // } else {
    //     this.checkBaseKeys(event)
    // }

    this.checkBaseKeys(event);
  }

  checkBaseKeys(event: KeyboardEvent) {
    let flag = false;
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (this.isExpandable) {
          if (this.isExpanded()) {
            this.tree.collapseTreeItem(this);
          } else {
            this.tree.expandTreeItem(this);
          }
        }
        flag = true;
        break;
      case 'ArrowDown':
        if (this.children.length > 0) {
          if (this.isExpandable) {
            this.tree.expandTreeItem(this);
            this.tree.setFocusToNextLayer(this);
          }
        }
        flag = true;
        break;
      case 'Escape':
      case 'ArrowUp':
        // if (this.isExpandable && this.isExpanded()) {
        // this.tree.setFocusToParentItem();
        // this.tree.collapseTreeItem(this);
        // flag = true;
        // } else {
        if (this.inGroup) {
          this.tree.setFocusToParentItem(this);
          flag = true;
        }
        // }
        break;
      case 'ArrowLeft':
        this.tree.setFocusToPreviousItem(this);
        flag = true;
        break;
      case 'ArrowRight':
        this.tree.setFocusToNextItem(this);
        flag = true;
        break;
      case 'Home':
        if (this.parent) {
          this.tree.setFocusToFirstInLayer(this);
          flag = true;
        }
        break;

      case 'End':
        if (this.parent) {
          this.tree.setFocusToLastInLayer(this);
          flag = true;
        }
        break;
      case 'x':
        this.tree.focusOnNodeType('xAxis', this);
        break;
      case 'y':
        this.tree.focusOnNodeType('yAxis', this);
        break;
      case 'l':
        this.tree.focusOnNodeType('legend', this);
        break;
      case 'w':
        this.tree.setFocusGridUp(this);
        break;
      case 'a':
        this.tree.setFocusGridLeft(this);
        break;
      case 's':
        this.tree.setFocusGridDown(this);
        break;
      case 'd':
        this.tree.setFocusGridRight(this);
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleClick(event: MouseEvent) {
    if (this.isExpandable) {
      if (this.isExpanded()) {
        this.tree.collapseTreeItem(this);
      } else {
        this.tree.expandTreeItem(this);
      }
      event.stopPropagation();
    } else {
      this.tree.setFocusToItem(this);
      event.stopPropagation();
    }
  }

  handleFocus() {
    let node: any = this.domNode;
    if (this.isExpandable) {
      node = node.firstElementChild;
    }
    node.classList.add('focus');
  }

  handleBlur() {
    let node: any = this.domNode;
    if (this.isExpandable) {
      node = node.firstElementChild;
    }
    node.classList.remove('focus');
  }

  handleMouseOver(event: any) {
    event.currentTarget.classList.add('hover');
  }

  handleMouseOut(event: any) {
    event.currentTarget.classList.remove('hover');
  }
}
