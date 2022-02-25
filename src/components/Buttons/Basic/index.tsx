import React, { ReactNode } from 'react';
import { ButtonContainer } from './styles';

type Props = {
  label: string;
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
};

export default function Button({ label, LeftIcon, RightIcon }: Props) {
  return (
    <ButtonContainer>
      {LeftIcon && <div>{LeftIcon}</div>}
      <span>{label}</span>
      {RightIcon && <div>{RightIcon}</div>}
    </ButtonContainer>
  );
}
