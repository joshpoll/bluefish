import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import {
  BBoxWithChildren,
  Measure,
  useBluefishLayoutInternal,
  withBluefish,
  useBluefishContext,
  useName,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import _ from 'lodash';
import { Align } from '../components/Align';

export type TreeProps<T> = {
  name: string;
  value: T;
  treeChildren?: TreeProps<T>[];
};

// <Group name={name + '-subtree-' + i}>
{
  /* <Connector from={name + '-node'} to={child.name + '-node'} /> */
}
{
  /* <Connector $from={'centerLeft'} $to={'centerLeft'} stroke={'#ddd'} strokeWidth={1} strokeDasharray={3}>
              <Ref to={name + '-node'} />
              <Ref to={child.name + '-node'} />
            </Connector> */
}

// </Group>

export const Tree = forwardRef(function TreeFn<T>({ name, value, treeChildren }: TreeProps<T>, ref: any) {
  const tile = useName('tile');
  const letter = useName('letter');
  const opIdLabel = useName('opIdLabel');

  const node = useName('node');
  const subtree = useName('subtree');

  return (
    <Group ref={ref}>
      <Group symbol={node}>
        <Rect symbol={tile} height={65} width={50} rx={5} fill={'#eee'} />
        <Text symbol={letter} contents={value === ' ' ? '␣' : `${value}`} fontSize={'30px'} />
        <Align center={[<Ref to={letter} />, <Ref to={tile} />]} />
        <Align
          topCenter={[<Text symbol={opIdLabel} contents={name} fontSize={'12px'} fill={'#999'} />, <Ref to={tile} />]}
        />
        {/* <Align center to={'centerLeft'}>
        <Ref to={leftHandle} />
        <Ref to={tile} />
      </Align>
      <Align center to={'centerRight'}>
        <Ref to={rightHandle} />
        <Ref to={tile} />
      </Align> */}
      </Group>
      <Row /* debug={false} */ symbol={subtree} alignment={'top'} spacing={10}>
        {(treeChildren ?? []).map((child, i) => (
          <Tree {...child} />
        ))}
      </Row>
      {treeChildren ? (
        <Col alignment={'center'} spacing={10}>
          <Ref to={name + '-node'} />
          <Ref to={name + '-subtree'} />
        </Col>
      ) : null}
      {(treeChildren ?? []).map((child, i) => (
        <Connector $from={'bottomCenter'} $to={'topCenter'} stroke={'#ddd'} strokeWidth={1} strokeDasharray={3}>
          <Ref to={name + '-node'} />
          <Ref to={child.name + '-node'} />
        </Connector>
      ))}
      {/* {treeChildren ? (
        <Row alignment={'top'} spacing={10}>
          <Ref to={name + '-node'} />
          <Ref to={name + '-subtree'} />
        </Row>
      ) : null} */}
    </Group>
  );
});

export type MarkOpProps = {
  action: string;
  markType: string;
  backgroundColor: string;
  borderColor: string;
  opId: string;
  start: { opId: string };
  end: { opId: string };
};

export type GoTreeProps<T> = {
  tree: TreeProps<T>;
};

// TODO: put generic in the right place
export const GoTree: React.FC<GoTreeProps<any>> = ({ tree }) => {
  const charsRef = useRef(null);
  const markOpsRef = useRef(null);

  const context = useBluefishContext();

  return (
    <SVG width={1000} height={500}>
      <Group>
        <Tree {...tree} />
        {/* <Row name={'chars'} ref={charsRef} spacing={10} alignment={'middle'}>
          {chars.map((char) => (
            <Tree {...char} />
          ))}
        </Row> */}
      </Group>
    </SVG>
  );
};
