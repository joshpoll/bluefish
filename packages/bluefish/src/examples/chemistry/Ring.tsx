import React, { useRef } from 'react';
import { withBluefish, useName } from '../../bluefish';
import { SVG } from '../../components/SVG';
import { Group } from '../../components/Group';
import { Ref } from '../../components/Ref';
import { Atom } from './Atom';
import { Bond } from './Bond';

export const Ring = withBluefish((props: any) => {
  let options = {};
  let edges: any[] = [];
  let vertices: any[] = [];
  let rings: any[] = [];

  return (
    <SVG width={500} height={500}>
      <Group></Group>
    </SVG>
  );
});
