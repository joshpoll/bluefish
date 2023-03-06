import { TreeItem } from './TreeItem';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   Tree.js
 *
 *   Desc:   Tree widget that implements ARIA Authoring Practices
 *           for a tree being used as a file viewer
 */

/*
 *   @constructor
 *
 *   @desc
 *       Tree item object for representing the state and user interactions for a
 *       tree widget
 *
 *   @param node
 *       An element with the role=tree attribute
 */

type NodeType = 'chart' | 'xAxis' | 'yAxis' | 'data' | 'filteredData' | 'legend' | 'grid' | 'multiView';

export class Tree {
  domNode: any;
  treeItems: TreeItem[];
  rootTreeItem!: TreeItem;
  onFocus?: (el: HTMLElement) => void;

  constructor(node: HTMLElement, onFocus?: (el: HTMLElement) => void) {
    this.domNode = node;

    this.treeItems = [];

    this.onFocus = onFocus;
  }

  init(): void {
    function findTreeitems(node: any, tree: Tree, group: TreeItem | undefined) {
      let elem = node.firstElementChild;
      let ti = group;

      while (elem) {
        if (['li', 'table', 'tr', 'th', 'td'].includes(elem.tagName.toLowerCase())) {
          ti = new TreeItem(elem, tree, group);
          ti.init();
          if (group) {
            group.children.push(ti);
          }
          tree.treeItems.push(ti);
        }

        if (elem.firstElementChild) {
          findTreeitems(elem, tree, ti);
        }

        elem = elem.nextElementSibling;
      }
    }

    findTreeitems(this.domNode, this, undefined);

    this.updateVisibleTreeItems();
    this.rootTreeItem.domNode.tabIndex = 0;
  }

  setFocusToItem(treeitem: TreeItem) {
    for (var i = 0; i < this.treeItems.length; i++) {
      var ti = this.treeItems[i];

      if (ti === treeitem) {
        ti.domNode.tabIndex = 0;
        ti.domNode.focus();
        ti.domNode.setAttribute('aria-selected', 'true');
        if (this.onFocus) {
          this.onFocus(ti.domNode);
        }
      } else {
        ti.domNode.tabIndex = -1;
        ti.domNode.setAttribute('aria-selected', 'false');
      }
    }
  }

  setFocusToNextItem(currentItem: TreeItem) {
    if (currentItem.parent) {
      const nodeIndex = currentItem.parent.children.indexOf(currentItem);
      if (nodeIndex < currentItem.parent.children.length - 1) {
        this.setFocusToItem(currentItem.parent.children[nodeIndex + 1]);
      }
    }
  }

  setFocusToPreviousItem(currentItem: TreeItem) {
    if (currentItem.parent) {
      let nodeIndex = currentItem.parent.children.indexOf(currentItem);
      if (nodeIndex > 0) {
        this.setFocusToItem(currentItem.parent.children[nodeIndex - 1]);
      }
    }
  }

  setFocusToNextLayer(currentItem: TreeItem) {
    if (currentItem.lastVisitedChild) {
      this.setFocusToItem(currentItem.lastVisitedChild);
    } else {
      this.setFocusToItem(currentItem.children[0]);
    }
  }

  setFocusToParentItem(currentItem: TreeItem) {
    if (currentItem.parent) {
      currentItem.parent.lastVisitedChild = currentItem;
      this.setFocusToItem(currentItem.parent);
      // if (currentItem.isExpandable && currentItem.isExpanded()) this.collapseTreeItem(currentItem);
      if (currentItem.parent.isExpandable && currentItem.parent.isExpanded()) this.collapseTreeItem(currentItem.parent);
    }
  }

  setFocusToFirstInLayer(currentItem: TreeItem) {
    if (currentItem.parent) {
      this.setFocusToItem(currentItem.parent.children[0]);
    }
  }

  setFocusToLastInLayer(currentItem: TreeItem) {
    if (currentItem.parent) {
      this.setFocusToItem(currentItem.parent.children[currentItem.parent.children.length - 1]);
    }
  }

  setFocusGridLeft(currentItem: TreeItem) {
    const i = currentItem.domNode.getAttribute('data-i');
    const j = currentItem.domNode.getAttribute('data-j');
    if (i && j) {
      const next = this.treeItems.find((item) => {
        return (
          item.domNode.getAttribute('data-i') === String(Number(i) - 1) &&
          item.domNode.getAttribute('data-j') === String(j)
        );
      });
      if (next) {
        this.setFocusToItem(next);
      }
    }
  }

  setFocusGridRight(currentItem: TreeItem) {
    const i = currentItem.domNode.getAttribute('data-i');
    const j = currentItem.domNode.getAttribute('data-j');
    if (i && j) {
      const next = this.treeItems.find((item) => {
        return (
          item.domNode.getAttribute('data-i') === String(Number(i) + 1) &&
          item.domNode.getAttribute('data-j') === String(j)
        );
      });
      if (next) {
        this.setFocusToItem(next);
      }
    }
  }

  setFocusGridUp(currentItem: TreeItem) {
    const i = currentItem.domNode.getAttribute('data-i');
    const j = currentItem.domNode.getAttribute('data-j');
    if (i && j) {
      const next = this.treeItems.find((item) => {
        return (
          item.domNode.getAttribute('data-i') === String(i) &&
          item.domNode.getAttribute('data-j') === String(Number(j) + 1)
        );
      });
      if (next) {
        this.setFocusToItem(next);
      }
    }
  }

  setFocusGridDown(currentItem: TreeItem) {
    const i = currentItem.domNode.getAttribute('data-i');
    const j = currentItem.domNode.getAttribute('data-j');
    if (i && j) {
      const next = this.treeItems.find((item) => {
        return (
          item.domNode.getAttribute('data-i') === String(i) &&
          item.domNode.getAttribute('data-j') === String(Number(j) - 1)
        );
      });
      if (next) {
        this.setFocusToItem(next);
      }
    }
  }

  expandTreeItem(currentItem: TreeItem) {
    if (currentItem.isExpandable) {
      if (currentItem.parent) {
        currentItem.parent.children.forEach((item) => {
          if (item !== currentItem) {
            item.domNode.setAttribute('aria-expanded', 'false');
          }
        });
      }
      currentItem.domNode.setAttribute('aria-expanded', 'true');
      this.updateVisibleTreeItems();
    }
  }

  collapseTreeItem(item: TreeItem): void {
    let group: TreeItem | undefined;

    if (item.isExpanded()) {
      group = item;
    } else if (item.parent) {
      group = item.parent;
    }

    if (group) {
      group.domNode.setAttribute('aria-expanded', 'false');
      this.updateVisibleTreeItems();
      this.setFocusToItem(group);
    }
  }

  updateVisibleTreeItems(): void {
    this.rootTreeItem = this.treeItems[0];

    for (let i = 0; i < this.treeItems.length; i++) {
      let ti = this.treeItems[i];

      let parent = ti.domNode.parentNode;

      ti.isVisible = true;

      while (parent && parent !== this.domNode) {
        if ((parent as any).getAttribute('aria-expanded') == 'false') {
          ti.isVisible = false;
        }
        parent = parent.parentNode;
      }
    }
  }

  focusOnNodeType(nodeType: NodeType, currentItem: TreeItem) {
    const expandParents = (node: TreeItem | undefined) => {
      if (node) {
        if (node.isExpandable && !node.isExpanded()) {
          this.expandTreeItem(node);
          expandParents(node.parent);
        }
      }
    };

    const collapseChildren = (node: TreeItem) => {
      node.children.forEach((child) => {
        if (child.isExpandable && child.isExpanded()) {
          collapseChildren(child);
          this.collapseTreeItem(child);
        }
      });
    };

    let iterNodeType: NodeType = currentItem.domNode.getAttribute('data-nodetype') as NodeType;
    let iterItem: TreeItem = currentItem;
    while (iterNodeType !== 'chart') {
      if (!iterNodeType) return;
      if (iterItem.parent) {
        iterItem = iterItem.parent;
        iterNodeType = iterItem.domNode.getAttribute('data-nodetype') as NodeType;
      } else return;
    }

    const targetItem = iterItem.children.find((item) => {
      const nt = item.domNode.getAttribute('data-nodetype') as NodeType;
      return nodeType === nt;
    });

    if (targetItem) {
      expandParents(targetItem);
      collapseChildren(targetItem);
      this.setFocusToItem(targetItem);
    }
  }
}
