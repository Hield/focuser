import React from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import { NavBar } from './features/global/NavBar';
import { Recorder } from './features/recorder/Recorder';
import { Note } from './features/note/Note';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Wrapper = styled.div`
  padding: 24px;
`;

function App() {
  return (
    <Router>
      <Box component='main' sx={{ flexGrow: 1 }}>
        <NavBar />
        <Wrapper>
          <Routes>
            <Route index element={<Recorder />} />
            <Route path='note/:sessionId' element={<Note />} />
          </Routes>
        </Wrapper>
      </Box>
    </Router>
  );
}

export default App;
