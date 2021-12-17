import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RecordRTC from 'recordrtc';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import {
  uploadVideoBlob,
  createSession,
  createMoment,
  endSession,
} from '../../app/api';
import { useDebouncedEffect } from '../../app/useDebouncedEffect';

export const Recorder = () => {
  const navigate = useNavigate();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [videoRecorder, setVideoRecorder] = useState<RecordRTC | null>(null);
  const [recordingInterval, setRecordingInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const video = useRef<any>(null);

  useDebouncedEffect(
    () => {
      Notification.requestPermission();
      if (ws) {
        ws.close();
        setWs(null);
      }
      const localWs = new WebSocket(
        'wss://elecdesign.org.aalto.fi/nr2/ws/focuser'
      );
      setWs(localWs);
      localWs.onopen = () => {
        localWs.send('Ping from React');
      };

      localWs.onmessage = async (event) => {
        console.log(event);
        console.log('Got message: ', event.data);
        if (event.data === 'capture') {
          const noti = new Notification('Screenshot captured');
          setTimeout(() => {
            noti.close();
          }, 1000);
          await createMoment(sessionId);
        }
      };

      return () => {
        if (ws) {
          ws.close();
          setWs(null);
        }
      };
    },
    500,
    [sessionId]
  );

  const startSession = async () => {
    setStarted(true);
    // @ts-ignore
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const tracks = audioStream.getAudioTracks();
    console.log(tracks);
    const audioTrack = tracks[0];
    stream.addTrack(audioTrack);

    if (video.current) {
      video.current.srcObject = stream;
    }
    const recorder = new RecordRTC(stream, {
      type: 'video',
      mimeType: 'video/webm',
    });
    recorder.startRecording();
    // setRecordingInterval(
    //   setInterval(async () => {
    //     const blob = recorder.getBlob();
    //     console.log(blob);
    //     await uploadVideoBlob(blob);
    //   }, 10000)
    // );
    setVideoRecorder(recorder);
    await createSession(sessionId);
  };
  const stopSession = async () => {
    if (videoRecorder) {
      setStarted(false);
      videoRecorder.stopRecording(async () => {
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
        const blob = videoRecorder.getBlob();
        await uploadVideoBlob(blob, sessionId);
      });
      video.current.srcObject.getTracks().forEach((track: any) => track.stop());
      video.current.srcObject = null;
      setProcessing(true);
      setTimeout(async () => {
        await endSession(sessionId);
        navigate(`/note/${sessionId}`);
      }, 15000); // Wait for 15 secs for the video to be updated correctly
    }
  };

  const captureMoment = async () => {
    //await createMoment();
    ws?.send('capture');
  };

  return (
    <>
      {processing ? (
        <>
          <CircularProgress />
          <Typography variant='h4'>Processing...</Typography>
        </>
      ) : (
        <Typography variant='h4'>Start a new session</Typography>
      )}
      <hr />
      <TextField
        value={sessionId}
        onChange={(event) => setSessionId(event.target.value)}
        label='Enter session ID'
        variant='outlined'
        disabled={started || processing}
      />{' '}
      <br />
      <Button
        onClick={startSession}
        disabled={started || processing || !sessionId}
      >
        Start
      </Button>{' '}
      <Button onClick={stopSession} disabled={!started}>
        Stop
      </Button>
      <Button onClick={captureMoment} disabled={!started}>
        Capture
      </Button>
      <br />
      <video
        ref={video}
        width='720'
        height='480'
        controls
        autoPlay
        muted
      ></video>
      {/* <video width='720' height='480' controls autoPlay>
        <source
          src='https://ememejistorage.blob.core.windows.net/focuser/hieu/neppi/test_session/video.webm'
          type='video/webm'
        />

        <source
          src='https://ememejistorage.blob.core.windows.net/focuser/hieu/neppi/test_session/video.webm'
          type='video/mp4'
        />
      </video> */}
    </>
  );
};
