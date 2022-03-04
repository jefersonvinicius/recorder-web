import BaseModal from 'components/BaseModal';
import React, { ChangeEvent } from 'react';
import { ModalSelectorContent } from './styles';

type Item = {
  id: string;
  label: string;
};

type Props<T> = {
  isOpen: boolean;
  selectedValue: string;
  items: T[];
  onSelect: (selected: T) => void;
  valueAttr: keyof T;
  textAttr: keyof T;
};

export default function ModalSelector<T>({ isOpen, items, selectedValue, onSelect, valueAttr, textAttr }: Props<T>) {
  function handleOnChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = items.find((item) => String(item[valueAttr]) === event.target.value)!;
    onSelect(selected);
  }

  return (
    <BaseModal isOpen={isOpen}>
      <ModalSelectorContent>
        <select value={selectedValue} onChange={handleOnChange}>
          {items.map((item) => (
            <option key={String(item[valueAttr])} value={String(item[valueAttr])}>
              {item[textAttr]}
            </option>
          ))}
        </select>
      </ModalSelectorContent>
    </BaseModal>
  );
}
