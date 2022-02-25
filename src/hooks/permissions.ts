import { useEffect } from 'react';

export function useRequestWebcamAndMicrophonePermissions() {
  useEffect(() => {
    async function handle() {
      const stream = await request();
      stream?.getTracks().forEach((t) => t.stop());

      async function request() {
        try {
          return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (error: any) {
          if (error?.message === 'Requested device not found') {
            return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          }
        }
      }
    }

    handle();
  }, []);
}
