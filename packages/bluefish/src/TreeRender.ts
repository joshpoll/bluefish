// Adapted from: https://w3c.github.io/aria-practices/examples/treeview/treeview-1/treeview-1b.html

type OlliValue = string | number | Date;

interface OlliDatum {
  [key: string]: OlliValue;
}

type NodeType = 'chart' | 'xAxis' | 'yAxis' | 'data' | 'filteredData' | 'legend' | 'grid' | 'multiView';

type EncodingFilterValue = string | [number | Date, number | Date];
type GridFilterValue = [EncodingFilterValue, EncodingFilterValue];
type FilterValue = EncodingFilterValue | GridFilterValue;

type AccessibilityTreeNode = {
  type: NodeType;
  parent: AccessibilityTreeNode | null;
  selected: OlliDatum[];
  description: string;
  children: AccessibilityTreeNode[];
  tableKeys?: string[];
  filterValue?: FilterValue;
  gridIndex?: {
    i: number;
    j: number;
  };
};

type AccessibilityTree = {
  root: AccessibilityTreeNode;
  fieldsUsed: string[];
};

const fmtValue = (value: OlliValue): string => {
  if (value instanceof Date) {
    return value.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } else if (typeof value !== 'string' && !isNaN(value) && value % 1 != 0) {
    return Number(value).toFixed(2);
  }
  return String(value);
};

/**
 *
 * @param node A {@link AccessibilityTreeNode} to generate a navigable tree view from
 * @returns An {@link HTMLElement} ARIA TreeView of the navigable tree view for a visualization
 */
export function DomStructure(tree: AccessibilityTree): any {
  const namespace = (Math.random() + 1).toString(36).substring(7);

  const node = tree.root;

  const root = document.createElement('ul');
  const labelId = `${namespace}-${node.type}-label`;

  root.setAttribute('role', 'tree');
  root.setAttribute('aria-labelledby', labelId);

  root.appendChild(_renderTree(node, namespace, 1, 1, 1));
  root.querySelector('span')?.setAttribute('id', labelId);

  return root;

  function _renderTree(
    node: AccessibilityTreeNode,
    namespace: string,
    level: number,
    posinset: number,
    setsize: number,
  ): HTMLElement {
    const item = document.createElement('li');
    item.setAttribute('role', 'treeitem');
    item.setAttribute('aria-level', String(level));
    item.setAttribute('aria-setsize', String(setsize));
    item.setAttribute('aria-posinset', String(posinset));
    item.setAttribute('aria-expanded', 'false');
    item.setAttribute('data-nodetype', node.type);
    if (node.gridIndex) {
      item.setAttribute('data-i', String(node.gridIndex.i));
      item.setAttribute('data-j', String(node.gridIndex.j));
    }

    const label = document.createElement('span');
    label.textContent = node.description;
    item.appendChild(label);

    if (node.children.length) {
      const dataChildren = node.children.filter((n: any) => n.type === 'data');
      const treeChildren = node.children.filter((n: any) => n.type !== 'data');

      const childContainer = document.createElement('ul');
      childContainer.setAttribute('role', 'group');

      if (dataChildren.length) {
        childContainer.appendChild(createDataTable(dataChildren, level + 1));
      } else {
        treeChildren.forEach((n: any, index: any, array: any) => {
          childContainer.appendChild(_renderTree(n, namespace, level + 1, index + 1, array.length));
        });
      }
      item.appendChild(childContainer);
    }

    return item;
  }

  function createDataTable(dataNodes: AccessibilityTreeNode[], level: number) {
    const table = document.createElement('table');
    table.setAttribute('aria-label', `Table with ${dataNodes.length} rows`);
    table.setAttribute('aria-level', String(level));
    table.setAttribute('aria-posinset', '1');
    table.setAttribute('aria-setsize', '1');

    const thead = document.createElement('thead');
    const theadtr = document.createElement('tr');
    theadtr.setAttribute('aria-label', `${dataNodes[0].tableKeys?.join(', ')}`);

    dataNodes[0].tableKeys?.forEach((key: string) => {
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.innerText = key;
      theadtr.appendChild(th);
    });

    thead.appendChild(theadtr);
    table.appendChild(thead);

    const tableBody = document.createElement('tbody');

    dataNodes.forEach((node) => {
      const dataRow = document.createElement('tr');
      dataRow.setAttribute(
        'aria-label',
        `${node.tableKeys?.map((key: any) => `${key}: ${fmtValue(node.selected[0][key])}`).join(', ')}`,
      );
      node.tableKeys?.forEach((key: string) => {
        const td = document.createElement('td');
        const value = fmtValue(node.selected[0][key]);
        td.innerText = value;
        dataRow.appendChild(td);
      });
      tableBody.appendChild(dataRow);
    });

    table.appendChild(tableBody);

    return table;
  }
}
