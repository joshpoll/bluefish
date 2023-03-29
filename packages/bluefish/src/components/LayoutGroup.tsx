import { PropsWithChildren } from 'react';

type LayoutGroupProps = PropsWithChildren<{
  id?: string;
}>;

export const LayoutGroup = (props: LayoutGroupProps) => {
  const { id, ...rest } = props;
  return (
    <g aria-hidden={true} id={props.id}>
      {props.children}
    </g>
  );
};
LayoutGroup.displayName = 'LayoutGroup';
