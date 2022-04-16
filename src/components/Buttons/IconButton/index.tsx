import React from 'react';
import { BasicButtonProps } from '../Basic';
import { IconButtonContainer } from './styles';

type Props = BasicButtonProps & {
  size: number;
};

export default function IconButton(props: Props) {
  return <IconButtonContainer {...props} style={{ ...props.style, width: props.size, height: props.size }} />;
}
