import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { SessionNote } from '../../types/session';
import { getSessionNote } from '../../app/api';
import { MomentNote } from '../../types/session';

const HalfWrapper = styled.div`
  height: 100%;
  width: 50%;
  position: fixed;
  z-index: -1;
  top 0;
  overflow-x: hidden:
  padding-top: 64px !important;
`;

const Left = styled(HalfWrapper)`
  left: 0;
`;

const Right = styled(HalfWrapper)`
  right: 0;
  overflow-y: scroll;
`;

const InnerWrapper = styled.div`
  padding: 24px;
  padding-top: 88px;
`;

export const Note = () => {
  const video = useRef<any>();
  const { sessionId } = useParams();
  const [note, setNote] = useState<SessionNote | null>(null);

  useEffect(() => {
    const getData = async () => {
      setNote((await getSessionNote(sessionId || 'test_session')) || null);
    };
    getData();
  }, []);

  return !note ? (
    <Typography variant='h4'>Loading...</Typography>
  ) : (
    <>
      <Left>
        <InnerWrapper>
          <Typography variant='h4'>Lecture</Typography>
          <video ref={video} width='640' controls>
            <source src={note.videoUrl} type='video/webm' />
            <source src={note.videoUrl} type='video/mp4' />
          </video>
        </InnerWrapper>
      </Left>
      <Right>
        <InnerWrapper>
          <Typography variant='h5'>Snapshots</Typography>
          {note.moments.map((moment) => (
            <Moment
              moment={moment}
              onClick={() => {
                if (video.current) {
                  video.current.currentTime = moment.videoTimestamp;
                }
              }}
            />
          ))}
        </InnerWrapper>
      </Right>
    </>
  );
};

const MomentWrapper = styled.div`
  padding-top: 12px;
`;

interface MomentProps {
  moment: MomentNote;
  onClick?: () => void;
}

const Moment = ({ moment, onClick }: MomentProps) => (
  <MomentWrapper>
    <img
      width='240'
      height='150'
      src={moment.imageUrl}
      alt='a snapshot'
      onClick={onClick}
    ></img>
    <Typography variant='body2'>
      {getVideoTimestamp(moment.videoTimestamp)}
    </Typography>
    <hr></hr>
  </MomentWrapper>
);

const getVideoTimestamp = (timestamp: number) => {
  const minutes = Math.floor(timestamp / 60);
  const seconds = Math.round(timestamp % 60);

  return `${minutes}:${seconds}`;
};
