import { PropsWithChildren, useId } from 'react';

type LayoutGroupProps = PropsWithChildren<{
  id?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}>;

export const LayoutGroup = (props: LayoutGroupProps) => {
  const id = useId();
  return (
    <g aria-label={props['aria-label'] ?? 'Layout Group'} aria-hidden={props['aria-hidden'] ?? false} id={props.id ?? id}>
      {props.children}
    </g>
  );
};
LayoutGroup.displayName = 'LayoutGroup';
