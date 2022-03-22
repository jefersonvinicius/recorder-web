export function getVideoStream(videoInput: MediaDeviceInfo) {
  if (videoInput.deviceId === 'screen') {
    return navigator.mediaDevices.getDisplayMedia();
  }
  return navigator.mediaDevices.getUserMedia({ video: { deviceId: videoInput.deviceId } });
}

export function getAudioStream(audioInput: MediaDeviceInfo) {
  return navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioInput.deviceId } });
}
