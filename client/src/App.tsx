import { Fragment } from 'react';
import { Box } from '@mui/material';

import dashbuddyLogo from '/dashbuddy.svg';

import type { FunctionComponent } from 'react';

import Calendar from './components/Calendar/Calendar';

import './App.css';

const App: FunctionComponent = () => {
  return (
    <Fragment>
      <Box>
        <img src={dashbuddyLogo} className="logo" alt="Dashbuddy logo" />
      </Box>
      <Box>Dashbuddy AI</Box>
      <Box className="card">
        <Calendar />
      </Box>
    </Fragment>
  );
}

export default App;
