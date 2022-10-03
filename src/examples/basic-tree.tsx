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

    return (
        // TODO: use x and y to position the group
        <SVG width={500} height={500}>
            <Group ref={ref} name={opId}>
                <Rect ref={nodeCircle} height={100} width={100} rx={40} fill={'#ADD8E6'} />
                <Text
                    ref={letter}
                    contents={value.toString()}
                    fontSize={'50px'}
                    fontWeight={'bold'}
                    fontStyle={'normal'}
                />
                <Align center>
                    <Ref to={letter} />
                    <Ref to={nodeCircle} />
                </Align>
            </Group>
        </SVG>
    );
});