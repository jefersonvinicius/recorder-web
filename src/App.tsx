import ButtonBasic from 'components/Buttons/Basic';
import React, { useEffect, useRef, useState } from 'react';
import { useAudioInputs, useVideosInputs } from './hooks/media-devices';
import { Container, Footer, FooterLeftSide, FooterRightSide, RecordingVideo, VideoArea } from './styles';
import { BsCameraVideo, BsChevronDown, BsDownload } from 'react-icons/bs';
import { BiMicrophone } from 'react-icons/bi';
import Theme from 'config/theme';
import RecordingButton from 'components/Buttons/RecordingButton';
import MediaDeviceSelector from 'components/MediaDeviceSelector';
import { screenDevice } from 'utils/devices';
import ReactTooltip from 'react-tooltip';
import { useRequestWebcamAndMicrophonePermissions } from 'hooks/permissions';

const DownArrayIcon = () => <BsChevronDown size={20} color={Theme.pallet.primaryDark} />;

function getStream(videoInput: MediaDeviceInfo) {
  if (videoInput.deviceId === 'screen') {
    return navigator.mediaDevices.getDisplayMedia();
  }
  return navigator.mediaDevices.getUserMedia({ video: { deviceId: videoInput.deviceId } });
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  const [videoInputSelectorIsOpen, setVideoInputSelectorIsOpen] = useState(false);
  const [audioInputSelectorIsOpen, setAudioInputSelectorIsOpen] = useState(false);
  const [selectedAudioInput, setSelectedAudioInput] = useState<MediaDeviceInfo | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<MediaDeviceInfo>(screenDevice);
  const [isRecordingRunning, setIsRecordingRunning] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [downloadFileName, setDownloadFileName] = useState('file.webm');

  const { audioInputs } = useAudioInputs();
  const { videosInputs } = useVideosInputs();

  const requested = useRequestWebcamAndMicrophonePermissions();

  useEffect(() => {
    if (!requested) return;

    const _video = videoRef.current;

    getStream(selectedVideo).then(setStream);

    function setStream(stream: MediaStream) {
      videoRef.current!.srcObject = stream;
    }

    return () => {
      mediaRecorder.current?.stop();
      (_video?.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    };
  }, [selectedVideo, requested]);

  async function handleStartRecordingClick() {
    if (!selectedVideo) {
      alert('Is required select video input');
      return;
    }

    let videoStream = videoRef.current?.srcObject as MediaStream;
    if (!videoStream.active) {
      videoStream = await getStream(selectedVideo);
      videoRef.current!.srcObject = videoStream;
    }

    mediaRecorder.current = new MediaRecorder(videoStream);
    mediaRecorder.current.addEventListener('dataavailable', handleMediaRecorderDataAvailable);
    mediaRecorder.current.addEventListener('stop', handleMediaRecorderStop);
    mediaRecorder.current.start(1000);
    setIsRecordingRunning(true);

    function handleMediaRecorderDataAvailable(event: BlobEvent) {
      const chunk = event.data;
      recordingChunks.current.push(chunk);
      setRecordingTime((old) => old + 1);
    }

    function handleMediaRecorderStop() {
      const blob = new Blob(recordingChunks.current);
      const url = URL.createObjectURL(blob);
      console.log({ url });
      setDownloadLink(url);
      setIsRecordingRunning(false);
      setDownloadFileName(`${new Date().toISOString()}.webm`);
      videoStream.getTracks().forEach((track) => track.stop());
      setRecordingTime(0);
      recordingChunks.current = [];
      mediaRecorder.current = null;
    }
  }

  function handleStopRecording() {
    mediaRecorder.current?.stop();
  }

  function handleSelectVideoInput(videoInput: MediaDeviceInfo) {
    setVideoInputSelectorIsOpen(false);
    setSelectedVideo(videoInput);
  }

  function handleSelectAudioInput(audioInput: MediaDeviceInfo) {
    setAudioInputSelectorIsOpen(false);
    setSelectedAudioInput(audioInput);
  }

  return (
    <Container>
      <ReactTooltip />
      <VideoArea>
        <RecordingVideo ref={videoRef} autoPlay />
      </VideoArea>
      <Footer>
        <FooterLeftSide>
          <ButtonBasic
            data-tip="Selecionar"
            LeftIcon={<BiMicrophone size={20} color={Theme.pallet.primaryDark} />}
            disabled={audioInputs.length === 0}
            label={selectedAudioInput?.label ?? 'Não selecionado'}
            onClick={() => setAudioInputSelectorIsOpen(true)}
            RightIcon={<DownArrayIcon />}
            width={200}
            maxWidth={250}
          />
          <ButtonBasic
            LeftIcon={<BsCameraVideo size={20} color={Theme.pallet.primaryDark} />}
            label={selectedVideo?.label ?? ''}
            RightIcon={<DownArrayIcon />}
            onClick={() => setVideoInputSelectorIsOpen(true)}
            width={200}
            maxWidth={250}
          />
          {downloadLink && (
            <ButtonBasic
              LeftIcon={<BsDownload size={20} color={Theme.pallet.primaryDark} />}
              label="Baixar Gravação"
              asLink
              href={downloadLink}
              filenameDownload={downloadFileName}
              width={200}
              maxWidth={250}
            />
          )}
        </FooterLeftSide>
        <FooterRightSide>
          <RecordingButton
            onClick={isRecordingRunning ? handleStopRecording : handleStartRecordingClick}
            isRecording={isRecordingRunning}
            currentSeconds={recordingTime}
          />
        </FooterRightSide>
      </Footer>
      <MediaDeviceSelector
        isOpen={videoInputSelectorIsOpen}
        devices={videosInputs}
        onClose={() => setVideoInputSelectorIsOpen(false)}
        onSelect={handleSelectVideoInput}
      />
      <MediaDeviceSelector
        isOpen={audioInputSelectorIsOpen}
        devices={audioInputs}
        onClose={() => setAudioInputSelectorIsOpen(false)}
        onSelect={handleSelectAudioInput}
      />
    </Container>
  );
}

export default App;
