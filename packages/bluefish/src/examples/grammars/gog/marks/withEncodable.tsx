// A version of Krist Wongsuphasawat's Encodable for Bluefish.
// Closer to Observable Plot API where data types are inferred from the mark type.
// Maybe we'll change this to be more like Vega-Lite...

import { useContext } from 'react';
import { withBluefish } from '../../../../bluefish';
import { PlotContext } from '../Plot';

type Literal = string | number | symbol;

type Field<T> = keyof T;

type Fn<T> = (data: T) => any;

export type Encoding<T> = Field<T> | Fn<T> | Literal;

export const createSelector = <T,>(input?: Encoding<T>, defaultValue?: any): Fn<T> => {
  if (input === undefined) {
    return () => defaultValue;
  }
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'symbol') {
    return (data: any) => (input in data ? data[input] : input);
  } else {
    return input;
  }
};

export const withEncodable = <T extends {}>(encodingChannels: string[], Component: React.ComponentType<T>) => {
  return (props: any) => {
    const context = useContext(PlotContext);

    const data = props.data ?? context.data;

    const reifiedEncoding = encodingChannels.reduce((acc, channel) => {
      const selector = createSelector(props[channel]);
      return {
        ...acc,
        [channel]: data.map(selector),
      };
    }, {});

    return <Component {...props} data={data} {...reifiedEncoding} />;
  };
};
