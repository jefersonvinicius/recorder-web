import { useCallback, useEffect, useState } from 'react';
import { screenDevice } from '@app/utils/devices';

export function useDevicesSelector(kindToSelect: MediaDeviceKind) {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const refreshDevices = useCallback(async () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setDevices(devices.filter((d) => d.kind === kindToSelect && !!d.label));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [kindToSelect]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  useEffect(() => {
    function handleDeviceChange() {
      refreshDevices();
    }

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }, [refreshDevices]);

  return { isLoading, devices, refreshDevices };
}

export function useAudioInputs() {
  const { devices, refreshDevices, isLoading } = useDevicesSelector('audioinput');
  return { audioInputs: devices, refreshAudioInputs: refreshDevices, isLoadingAudioInputs: isLoading };
}

export function useVideoInputs() {
  const { devices, isLoading, refreshDevices } = useDevicesSelector('videoinput');

  return {
    videosInputs: [screenDevice, ...devices],
    refreshVideoInputs: refreshDevices,
    isLoadingVideoInputs: isLoading,
  };
}
