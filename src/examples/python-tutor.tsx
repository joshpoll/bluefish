import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import { Align, Alignment2D, splitAlignment } from '../components/Align';
import {
    BBoxWithChildren,
    Measure,
    useBluefishLayout,
    withBluefish,
    withBluefishComponent,
    useBluefishContext,
    withBluefishFn,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import { Rectangle } from 'paper/dist/paper-core';
import { NewBBox } from '../NewBBox';

export type Point = {
    pointObject: { opId: string };
    value: string;
    opId: string;
};

export const Variable = forwardRef(({ pointObject, value, opId }: Point, ref: any) => {
    const textRef = useRef(null);
    const boxRef = useRef(null);
    return (
        <Group ref={ref} name={opId}>
            <Rect ref={boxRef} height={40} width={40} fill={'#e2ebf6'} stroke={'grey'} />
            <Text ref={textRef} contents={value.toString()} fontSize={'24px'} fill={'black'} />
            <Align centerLeft>
                <Ref to={boxRef} />
                <Ref to={textRef} />
            </Align>
        </Group>
    );
});

// Global frame contains list of variables
// Each variable has either reference to object or value
export type GlobalFrameProps = {
    variables: Point[];
    opId: string;
};

export const GlobalFrame = forwardRef(({ variables, opId }: GlobalFrameProps, ref: any) => {
    const frame = useRef(null);
    const opIdLabel = useRef(null);
    const frameVariables = useRef(null);

    return (
        <SVG width={500} height={500}>
            <Group ref={ref} name={opId}>
                <Rect ref={frame} height={300} width={200} fill={'#e2ebf6'} />
                <Text ref={opIdLabel} contents={'Global Frame'} fontSize={'24px'} fill={'black'} />
                <Col name={`frameVariables`} ref={frameVariables} spacing={20} alignment={'center'}>
                    {variables.map(
                        (point) => (<Variable {...point} />)
                    )}
                </Col>

                <Align topCenter>
                    <Ref to={opIdLabel} />
                    <Ref to={frame} />
                </Align>
                <Align centerRight>
                    <Ref to={frameVariables} />
                    <Ref to={frame} />
                </Align>
            </Group>
        </SVG>
    );
});