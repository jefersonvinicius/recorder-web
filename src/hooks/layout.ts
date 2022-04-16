import { useEffect } from 'react';

export function useCalculateVideoHeightOnWindowResize(params: { calculateFn: () => void }) {
  const { calculateFn } = params;

  useEffect(() => {
    function handle() {
      calculateFn();
    }
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('resize', handle);
    };
  }, [calculateFn]);
}
