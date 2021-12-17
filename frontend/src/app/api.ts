import axios from 'axios';
import { SessionNote } from '../types/session';

const serverUrl = process.env.REACT_APP_API_URL;

export const uploadVideoBlob = async (blob: Blob, sessionId: string) => {
  const formData = new FormData();
  formData.append('file', blob);

  try {
    await axios.post(
      `${serverUrl}/video/upload?session=${sessionId}`,
      formData
    );
  } catch (error) {
    console.error(error);
  }
};

export const createSession = async (sessionId: string) => {
  try {
    await axios.post(`${serverUrl}/session?session=${sessionId}`);
  } catch (error) {
    console.error(error);
  }
};

export const createMoment = async (sessionId: string) => {
  try {
    await axios.post(`${serverUrl}/session/moment?session=${sessionId}`);
  } catch (error) {
    console.error(error);
  }
};

export const endSession = async (sessionId: string) => {
  try {
    await axios.post(`${serverUrl}/session/end?session=${sessionId}`);
  } catch (error) {
    console.error(error);
  }
};

export const getSessionNote = async (sessionId: string) => {
  try {
    const response = await axios.get<SessionNote>(
      `${serverUrl}/session/note?session=${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
