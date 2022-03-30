import { useCallback, useRef } from 'react';

type Props = {
  onStreamChange?: (stream: MediaStream | null) => void;
};

export function useStream({ onStreamChange }: Props) {
  const stream = useRef<MediaStream | null>(null);

  const setStream = useCallback(
    (streamParam: MediaStream) => {
      stream.current = streamParam;
      onStreamChange?.(stream.current);
    },
    [onStreamChange]
  );

  const replaceAudioTracks = useCallback(
    (audioStream: MediaStream) => {
      if (!stream.current) stream.current = new MediaStream();

      console.log('Replacing Audio Tracks');
      stream.current?.getAudioTracks().forEach((s) => {
        s.stop();
        stream.current?.removeTrack(s);
      });
      audioStream.getAudioTracks().forEach((s) => {
        stream.current?.addTrack(s);
      });
      onStreamChange?.(stream.current);
    },
    [onStreamChange]
  );

  const replaceVideoTracks = useCallback(
    (videoStream: MediaStream) => {
      if (!stream.current) stream.current = new MediaStream();

      console.log('Replacing Video Tracks');
      stream.current?.getVideoTracks().forEach((s) => {
        s.stop();
        stream.current?.removeTrack(s);
      });
      videoStream.getVideoTracks().forEach((s) => {
        stream.current?.addTrack(s);
      });
      onStreamChange?.(stream.current);
    },
    [onStreamChange]
  );

  const _changeEnabledStatusOfAudios = useCallback(({ enabled }: { enabled: boolean }) => {
    stream.current?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }, []);

  const muteAudioTracks = useCallback(() => {
    _changeEnabledStatusOfAudios({ enabled: false });
    onStreamChange?.(stream.current);
  }, [_changeEnabledStatusOfAudios, onStreamChange]);

  const unmuteAudioTracks = useCallback(() => {
    _changeEnabledStatusOfAudios({ enabled: true });
    onStreamChange?.(stream.current);
  }, [_changeEnabledStatusOfAudios, onStreamChange]);

  return {
    stream,
    setStream,
    replaceAudioTracks,
    replaceVideoTracks,
    muteAudioTracks,
    unmuteAudioTracks,
  };
}
