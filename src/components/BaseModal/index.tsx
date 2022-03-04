import React, { ReactNode } from 'react';
import Modal from 'react-modal';

type Props = Modal.Props & {
  children: ReactNode;
};

const customStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function BaseModal({ children, ...props }: Props) {
  return (
    <Modal style={customStyle} {...props}>
      {children}
    </Modal>
  );
}
