import { PropsWithChildren } from 'react';

type FragmentProps = PropsWithChildren<{
  layoutKey?: string;
}>;

export const Fragment = (props: FragmentProps) => {
  return <>{props.children}</>;
};
