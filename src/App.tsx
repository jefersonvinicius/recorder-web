import ButtonBasic from 'components/Buttons/Basic';
import React, { useEffect, useRef, useState } from 'react';
import { useAudioInputs, useVideosInputs } from './hooks/media-devices';
import {
  Container,
  Footer,
  FooterLeftSide,
  FooterRightSide,
  RecordingVideo,
  VideoArea,
  VideoPlaceholder,
  VideoPlaceholderText,
} from './styles';
import { BsCameraVideo, BsChevronDown, BsDownload } from 'react-icons/bs';
import { BiMicrophone } from 'react-icons/bi';
import Theme from 'config/theme';
import RecordingButton from 'components/Buttons/RecordingButton';
import MediaDeviceSelector from 'components/MediaDeviceSelector';
import ReactTooltip from 'react-tooltip';
import { useStream } from 'hooks/stream';
import { useCallback } from 'react';
import { getAudioStream, getVideoStream } from 'utils/streams';
import { useRequestWebcamAndMicrophonePermissions } from 'hooks/permissions';
import AudioControl from 'components/AudioControl';

const DownArrayIcon = () => <BsChevronDown size={20} color={Theme.pallet.primaryDark} />;

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  const [videoInputSelectorIsOpen, setVideoInputSelectorIsOpen] = useState(false);
  const [audioInputSelectorIsOpen, setAudioInputSelectorIsOpen] = useState(false);
  const [selectedAudioInput, setSelectedAudioInput] = useState<MediaDeviceInfo | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<MediaDeviceInfo | null>(null);
  const [isRecordingRunning, setIsRecordingRunning] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [downloadFileName, setDownloadFileName] = useState('file.webm');
  const [isDisplayResult, setIsDisplayResult] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const { audioInputs } = useAudioInputs();
  const { videosInputs } = useVideosInputs();

  useRequestWebcamAndMicrophonePermissions();

  const setupVideoPreview = useCallback((streamToSetup: MediaStream | null) => {
    if (streamToSetup) setAudioStream(new MediaStream(streamToSetup.getAudioTracks()));
    else setAudioStream(null);

    const onlyVideo = new MediaStream(streamToSetup?.getVideoTracks() ?? []);
    if (videoRef.current) videoRef.current.srcObject = onlyVideo;
  }, []);

  const onStreamChange = useCallback(
    (stream: MediaStream | null) => {
      console.log('Stream Changes!');
      setupVideoPreview(stream);
      setIsDisplayResult(false);
    },
    [setupVideoPreview]
  );

  const { stream, replaceVideoTracks, replaceAudioTracks, muteAudioTracks, unmuteAudioTracks } = useStream({
    onStreamChange,
  });

  useEffect(() => {
    const _video = videoRef.current;
    return () => {
      mediaRecorder.current?.stop();
      (_video?.srcObject as MediaStream)?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function handleStartRecordingClick() {
    if (!selectedVideo) {
      alert('Is required select video input');
      return;
    }

    setIsDisplayResult(false);

    const previewVideoStream = videoRef.current!.srcObject as MediaStream;

    const audioStream = selectedAudioInput ? await getAudioStream(selectedAudioInput) : null;
    const videoStream = previewVideoStream.active ? previewVideoStream : await getVideoStream(selectedVideo);

    if (audioStream) replaceAudioTracks(audioStream);
    replaceVideoTracks(videoStream);

    mediaRecorder.current = new MediaRecorder(stream.current!);
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
      setDownloadLink(url);
      setIsRecordingRunning(false);
      setDownloadFileName(`${new Date().toISOString()}.webm`);
      videoStream.getTracks().forEach((track) => track.stop());
      setRecordingTime(0);
      recordingChunks.current = [];
      mediaRecorder.current = null;
      setIsDisplayResult(true);
    }
  }

  function handleStopRecording() {
    mediaRecorder.current?.stop();
  }

  function handleSelectVideoInput(videoInput: MediaDeviceInfo) {
    setVideoInputSelectorIsOpen(false);
    setSelectedVideo(videoInput);

    getVideoStream(videoInput).then(replaceVideoTracks);
  }

  function handleSelectAudioInput(audioInput: MediaDeviceInfo) {
    setAudioInputSelectorIsOpen(false);
    setSelectedAudioInput(audioInput);

    getAudioStream(audioInput).then(replaceAudioTracks);
  }

  function handlePauseAudioClick() {
    if (isAudioPaused) unmuteAudioTracks();
    else muteAudioTracks();

    setIsAudioPaused(!isAudioPaused);
  }

  return (
    <Container>
      <ReactTooltip />
      <VideoArea>
        {selectedVideo || (isDisplayResult && downloadLink) ? (
          <RecordingVideo src={downloadLink ?? undefined} ref={videoRef} autoPlay controls={isDisplayResult} />
        ) : (
          <VideoPlaceholder>
            <VideoPlaceholderText>Selecione um vídeo</VideoPlaceholderText>
          </VideoPlaceholder>
        )}
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
            label={selectedVideo?.label ?? 'Não selecionado'}
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
          {selectedAudioInput && audioStream && (
            <AudioControl stream={audioStream} isPaused={isAudioPaused} onClick={handlePauseAudioClick} />
          )}
          <RecordingButton
            onClick={isRecordingRunning ? handleStopRecording : handleStartRecordingClick}
            isRecording={isRecordingRunning}
            currentSeconds={recordingTime}
            data-tip={isRecordingRunning ? 'Parar' : 'Iniciar'}
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
