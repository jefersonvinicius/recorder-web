import { useEffect, useState } from 'react';

export enum WebcamAndMicrophoneStatuses {
  Checking = 'checking',
  Granted = 'granted',
  Denied = 'denied',
  NotFound = 'not-found',
}

export function useRequestWebcamAndMicrophonePermissions() {
  const [status, setStatus] = useState(WebcamAndMicrophoneStatuses.Checking);

  useEffect(() => {
    async function handle() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (devices.length === 0) {
        setStatus(WebcamAndMicrophoneStatuses.NotFound);
        return;
      }
      const hasPermission = devices.every((device) => !!device.label);
      console.log({ hasPermission });
      console.log({ devices });
      if (hasPermission) return;

      const stream = await requestPermission();
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStatus(WebcamAndMicrophoneStatuses.Granted);
      }

      async function requestPermission() {
        try {
          return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (error: any) {
          console.log({ errorMessage: error.message });
          if (error?.message === 'Permission denied') {
            setStatus(WebcamAndMicrophoneStatuses.Denied);
          } else if (error?.message === 'Requested device not found') {
            return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          }
        }
      }
    }

    handle();
  }, []);

  return status;
}
