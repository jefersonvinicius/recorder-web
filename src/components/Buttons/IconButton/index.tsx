import React, { HTMLAttributes } from 'react';
import { IconButtonContainer } from './styles';

type Props = HTMLAttributes<HTMLButtonElement> & {
  size: number;
};

export default function IconButton(props: Props) {
  return <IconButtonContainer {...props} style={{ ...props.style, width: props.size, height: props.size }} />;
}
