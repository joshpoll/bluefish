import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Rect } from '../components/Rect';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import {
  BBoxWithChildren,
  Measure,
  useBluefishLayoutInternal,
  withBluefish,
  useBluefishContext,
  Constraints,
  useBluefishLayout,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import _ from 'lodash';
import { rasterize } from '../rasterize';

// https://www.bram.us/2022/02/13/log-images-to-the-devtools-console-with-console-image/
function getBox(width: number, height: number) {
  return {
    string: '+',
    style:
      'font-size: 1px; padding: ' +
      Math.floor(height / 2) +
      'px ' +
      Math.floor(width / 2) +
      'px; line-height: ' +
      height +
      'px;',
  };
}

(console as any).image = function (url: any, scale: any) {
  scale = scale || 1;
  var img = new Image();

  img.onload = function () {
    var dim = getBox((this as any).width * scale, (this as any).height * scale);
    console.log(
      '%c' + dim.string,
      dim.style +
        'background: url(' +
        url +
        '); background-size: ' +
        (this as any).width * scale +
        'px ' +
        (this as any).height * scale +
        'px; color: transparent;',
    );
  };

  img.src = url;
};

export type LabelProps = {};

const labelMeasurePolicy =
  (options: LabelProps): Measure =>
  (measurables, constraints: Constraints) => {
    const { width, height } = constraints;
    const [label] = measurables;
    const { width: labelWidth, height: labelHeight } = label.measure(constraints);
    const domRef: SVGElement | null = (label as any).domRef;

    console.log('[label test]', domRef);

    async function render() {
      if (domRef === null) {
        return;
      }
      const canvas = await rasterize(domRef, { width: labelWidth!, height: labelHeight! });
      const blob = await canvas.convertToBlob();
      const pngUrl = URL.createObjectURL(blob);
      console.log('[label test]', (label as any).domRef, pngUrl);
      (console as any).image(pngUrl);
    }

    render();

    return {
      width: Math.min(width!, labelWidth!),
      height: Math.min(height!, labelHeight!),
    };
  };

export const Label = withBluefish((props: LabelProps) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, labelMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      {children}
    </g>
  );
});
Label.displayName = 'Label';

export type LabelTestProps = {};

export const LabelTest = forwardRef(function LabelTest(props: LabelTestProps, ref: any) {
  return (
    <SVG width={500} height={500}>
      <Group ref={ref}>
        <Label>
          <Rect height={65} width={50} rx={5} fill={'#eee'} />
        </Label>
      </Group>
    </SVG>
  );
});
