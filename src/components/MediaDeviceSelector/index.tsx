import ModalSelector from 'components/ModalSelector';
import React from 'react';
import { ItemBox, ItemText } from './styles';
import { CgScreen, CgWebcam } from 'react-icons/cg';
import { TiMicrophone } from 'react-icons/ti';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  devices: MediaDeviceInfo[];
  onSelect: (device: MediaDeviceInfo) => void;
};

export default function MediaDeviceSelector({ devices, isOpen, onClose, onSelect }: Props) {
  return (
    <ModalSelector
      isOpen={isOpen}
      items={devices}
      onClose={onClose}
      onItemRender={(item) => {
        return (
          <ItemBox onClick={() => onSelect(item)} key={item.deviceId}>
            <ItemText>{item.label}</ItemText>
            {item.deviceId === 'screen' ? <CgScreen /> : item.kind === 'videoinput' ? <CgWebcam /> : <TiMicrophone />}
          </ItemBox>
        );
      }}
    />
  );
}
