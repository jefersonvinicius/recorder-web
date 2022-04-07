import { toast } from 'react-toastify';

export async function shareVideoFile(recordingBlob: Blob) {
  const file = new File([recordingBlob], 'file.webm', { type: 'video/webm' });
  const data: ShareData = {
    files: [file],
    text: 'Olha a gravação que fiz!!',
    title: 'Compartilhe seu vídeo!!',
  };

  try {
    if (navigator.canShare(data)) {
      await navigator.share(data);
    } else {
      throw new Error('We could not share!');
    }
  } catch (error) {
    toast.error('Desculpe, mas não conseguimos compartilhar seu vídeo.');
  }
}
