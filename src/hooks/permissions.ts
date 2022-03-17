import { useEffect, useState } from 'react';

export function useRequestWebcamAndMicrophonePermissions() {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    async function handle() {
      const stream = await request();
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setRequested(true);
      }

      async function request() {
        try {
          return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (error: any) {
          if (error?.message === 'Requested device not found') {
            return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          }
        }
      }
    }

    handle();
  }, []);

  return requested;
}
