import BaseModal from 'components/BaseModal';
import React, { ReactNode } from 'react';
import { ModalSelectorContent } from './styles';

type Props<T> = {
  isOpen: boolean;
  items: T[];
  onItemRender: (item: T) => ReactNode;
  onClose: () => void;
};

export default function ModalSelector<T>({ isOpen, items, onClose, onItemRender }: Props<T>) {
  return (
    <BaseModal isOpen={isOpen} onRequestClose={onClose} height="fit-content" width="20%">
      <ModalSelectorContent>
        {items.map(onItemRender)}
        {!items.length && <span>Nenhuma opção encontrada</span>}
      </ModalSelectorContent>
    </BaseModal>
  );
}
