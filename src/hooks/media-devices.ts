import { useEffect, useState } from 'react';
import { screenDevice } from 'utils/devices';

export function useDevicesSelector(kindToSelect: MediaDeviceKind) {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setDevices(devices.filter((d) => d.kind === kindToSelect));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [kindToSelect]);

  useEffect(() => {
    function handleDeviceChange() {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setDevices(devices.filter((d) => d.kind === kindToSelect));
      });
    }

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }, [kindToSelect]);

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
