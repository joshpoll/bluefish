import { PropsWithChildren } from 'react';

type LayoutGroupProps = PropsWithChildren<{
  id?: string;
}>;

export const LayoutGroup = (props: LayoutGroupProps) => {
  return <g id={props.id}>{props.children}</g>;
};
LayoutGroup.displayName = 'LayoutGroup';
