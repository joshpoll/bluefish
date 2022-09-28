//@ts-nocheck

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
import { first } from 'lodash';

const ModelDerivation: React.FC = () => {};
const ModelApplication: React.FC = () => {};
const StatisticalCharts: React.FC = () => {};
const LociGraphic: React.FC = () => {};
const GeneGraphic: React.FC = () => {};
const ScanEdge: React.FC = () => {};

export const PatternDiagram: React.FC<{}> = () => {
  return (
    <SVG width={1000} height={500}>
      {/* headers */}
      <Col>
        <Row>
          <Col name={'prev individuals'}>
            <Text>4,511</Text>
            <Text>individuals with previously quantified liver fat</Text>
          </Col>
          <Col name={'MRI images'}>
            <Text>32,192</Text>
            <Text>raw MRI images analyzed by machine-learning model</Text>
          </Col>
          <Col name={'total individuals'}>
            <Text>36,703</Text>
            <Text>total individuals with liver fat quantified</Text>
          </Col>
        </Row>
        <Row>
          <Text name={'loci'}>
            Common variant association study of <b>9.8 million</b> DNA variants identified <b>8 loci</b>
          </Text>
          <Text name={'gene'}>
            Rare variant association study of <b>3,384 genes</b>
            identified <b>1 gene</b>
          </Text>
        </Row>
      </Col>
      {/* equation */}
      <Group>
        <Text name={'plus'}> + </Text>
        <Align>
          <Ref verticalCenter to={'prev individuals'} at={first('Text')} />
          <Ref verticalCenter to={'plus'} />
        </Align>
        <Align>
          <Ref right to={'prev individuals'} />
          <Ref horizontalCenter to={'plus'} />
        </Align>
        <Text name={'equals'}> = </Text>
        <Align>
          <Ref verticalCenter to={'MRI images'} at={first('Text')} />
          <Ref verticalCenter to={'equals'} />
        </Align>
        <Align>
          <Ref right to={'MRI images'} />
          <Ref horizontalCenter to={'equals'} />
        </Align>
      </Group>
      {/* graphics */}
      <Group>
        <Col>
          <Ref to={'prev individuals'} />
          <ModelDerivation />
        </Col>
        <Col>
          <Ref to={'MRI images'} />
          <ModelApplication />
        </Col>
        <Col>
          <Ref to={'total individuals'} />
          <StatisticalCharts />
        </Col>
        <Col>
          <Ref to={'loci'} />
          <LociGraphic />
        </Col>
        <Col>
          <Ref to={'gene'} />
          <GeneGraphic />
        </Col>
      </Group>
      {/* edge */}
      <ScanEdge from={'ModelApplication'} to={['loci', 'gene']} />
    </SVG>
  );
};

export const PatternDiagramRearranged: React.FC<{}> = () => {
  return (
    <SVG width={1000} height={500}>
      {/* headers */}
      <Col>
        <Row>
          <Col name={'prev individuals'}>
            <Text>4,511</Text>
            <Text>individuals with previously quantified liver fat</Text>
          </Col>
          <Col name={'MRI images'}>
            <Text>32,192</Text>
            <Text>raw MRI images analyzed by machine-learning model</Text>
          </Col>
          <Col name={'total individuals'}>
            <Text>36,703</Text>
            <Text>total individuals with liver fat quantified</Text>
          </Col>
        </Row>
        <Row>
          <Text name={'loci'}>
            Common variant association study of <b>9.8 million</b> DNA variants identified <b>8 loci</b>
          </Text>
          <Text name={'gene'}>
            Rare variant association study of <b>3,384 genes</b>
            identified <b>1 gene</b>
          </Text>
        </Row>
      </Col>
      {/* equation */}
      <Group>
        <Text name={'plus'}> + </Text>
        <Align>
          <Ref verticalCenter to={'prev individuals'} at={first('Text')} />
          <Ref verticalCenter to={'plus'} />
        </Align>
        <Align>
          <Ref right to={'prev individuals'} />
          <Ref horizontalCenter to={'plus'} />
        </Align>
        <Text name={'equals'}> + </Text>
        <Align>
          <Ref verticalCenter to={'MRI images'} at={first('Text')} />
          <Ref verticalCenter to={'equals'} />
        </Align>
        <Align>
          <Ref right to={'MRI images'} />
          <Ref horizontalCenter to={'equals'} />
        </Align>
      </Group>
      {/* graphics */}
      <Group>
        <Col>
          <Ref to={'prev individuals'} />
          <ModelDerivation />
        </Col>
        <Col>
          <Ref to={'MRI images'} />
          <ModelApplication />
        </Col>
        <Col>
          <Ref to={'total individuals'} />
          <StatisticalCharts />
        </Col>
        <Col>
          <Ref to={'loci'} />
          <LociGraphic />
        </Col>
        <Col>
          <Ref to={'gene'} />
          <GeneGraphic />
        </Col>
      </Group>
      {/* edge */}
      <ScanEdge from={'ModelApplication'} to={['loci', 'gene']} />
    </SVG>
  );
};
