import React, { CSSProperties, ReactNode } from 'react';
import Modal from 'react-modal';

type Props = Modal.Props & {
  children: ReactNode;
  style?: CSSProperties;
  overlayStyle?: CSSProperties;
  width?: string | number;
  height?: string | number;
};

const contentCustomStyle = {
  top: '50%',
  left: '50%',
  right: 'auto',
  bottom: 'auto',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
};

const overlayCustomStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
};

export default function BaseModal({ children, ...props }: Props) {
  const localStyle = { width: props.width, height: props.height };

  return (
    <Modal
      {...props}
      style={{
        content: { ...contentCustomStyle, ...localStyle, ...props.style },
        overlay: { ...overlayCustomStyle, ...props.overlayStyle },
      }}
    >
      {children}
    </Modal>
  );
}
