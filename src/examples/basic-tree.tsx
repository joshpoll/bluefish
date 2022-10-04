import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import { Align } from '../components/Align';
import {
    BBoxWithChildren,
    Measure,
    useBluefishLayout,
    withBluefish,
    withBluefishComponent,
    useBluefishContext,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import { Rectangle } from 'paper/dist/paper-core';

export type NodeProps = {
    value: string;
    opId: string;
};

export const Node = forwardRef(({ value, opId }: NodeProps, ref: any) => {
    const nodeCircle = useRef(null);
    const letter = useRef(null);
    // const opIdRef = useRef(opId)
    return (
        // TODO: use x and y to position the group
        <Group ref={ref} name={opId}>
            <Rect ref={nodeCircle} height={100} width={100} rx={40} fill={'#ADD8E6'} />
            <Text
                ref={letter}
                contents={value.toString()}
                fontSize={'50px'}
                fontWeight={'normal'}
                fontStyle={'normal'}
            />
            <Align center>
                <Ref to={letter} />
                <Ref to={nodeCircle} />
            </Align>
        </Group>
    );
});

export type LinksProps = {
    parent: { opId: string };
    child: { opId: string };
    opId: string;
};

export type TreeProps = {
    nodes: NodeProps[];
    parentChild: LinksProps[];
    opId: string;
};

export const Tree = forwardRef(({ nodes, opId, parentChild }: TreeProps, ref: any) => {
    const nodesRef = useRef(null);
    console.log("this is the parentChild");
    console.log(parentChild);
    return (
        <SVG width={1000} height={1000}>
            <Group>
                <Row name={'nodes'} ref={nodesRef} spacing={50} alignment={'middle'}>
                    {
                        nodes.map((node) => (
                            <Node {...node} />
                        ))
                    }
                </Row>
                <Connector $from={'centerRight'} $to={'centerLeft'} stroke={'#0000FF'} strokeWidth={5} strokeDasharray={3}>
                    <Ref to={parentChild[0].parent.opId} />
                    <Ref to={parentChild[0].child.opId} />
                </Connector>

            </Group>
        </SVG>
    );
});