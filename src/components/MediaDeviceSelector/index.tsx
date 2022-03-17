import ModalSelector from 'components/ModalSelector';
import React, { useCallback } from 'react';
import { ItemBox, ItemText } from './styles';
import { CgScreen, CgWebcam } from 'react-icons/cg';
import { TiMicrophone } from 'react-icons/ti';
import { screenDevice } from 'utils/devices';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  devices: MediaDeviceInfo[];
  onSelect: (device: MediaDeviceInfo) => void;
};

export default function MediaDeviceSelector({ devices, isOpen, onClose, onSelect }: Props) {
  const icon = useCallback((item: MediaDeviceInfo) => {
    if (item.deviceId === screenDevice.deviceId) return <CgScreen />;
    if (item.kind === 'videoinput') return <CgWebcam />;
    return <TiMicrophone />;
  }, []);

  return (
    <ModalSelector
      isOpen={isOpen}
      items={devices}
      onClose={onClose}
      onItemRender={(item) => {
        return (
          <ItemBox onClick={() => onSelect(item)} key={item.deviceId}>
            <ItemText>{item.label}</ItemText>
            {icon(item)}
          </ItemBox>
        );
      }}
    />
  );
}
