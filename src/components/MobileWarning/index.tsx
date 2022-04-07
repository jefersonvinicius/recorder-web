import React from 'react';
import { MobileWarningContainer, MobileWarningText } from './styles';

export default function MobileWarning() {
  return (
    <MobileWarningContainer>
      <MobileWarningText>Desculpe! Mas o RecordWeb funciona apenas em desktop :)</MobileWarningText>
    </MobileWarningContainer>
  );
}
