import { useCallback, useEffect, useState } from 'react';
import { screenDevice } from 'utils/devices';

export function useDevicesSelector(kindToSelect: MediaDeviceKind) {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const filterDevices = useCallback(
    (devices: MediaDeviceInfo[]) => {
      return devices.filter((d) => d.kind === kindToSelect && !!d.label);
    },
    [kindToSelect]
  );

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setDevices(filterDevices(devices));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filterDevices]);

  useEffect(() => {
    function handleDeviceChange() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setDevices(filterDevices(devices));
      });
    }

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }, [filterDevices]);

  return { isLoading, devices };
}

export function useAudioInputs() {
  const { devices, ...rest } = useDevicesSelector('audioinput');
  return { audioInputs: devices, ...rest };
}

export function useVideosInputs() {
  const { devices, ...rest } = useDevicesSelector('videoinput');

  return { videosInputs: [screenDevice, ...devices], ...rest };
}
