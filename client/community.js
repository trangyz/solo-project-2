import React from 'react';
import { render } from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import Forum from './components/Forum.jsx';
import styles from './scss/app.scss';

render(
      <Forum />,
    document.getElementById('forum')
  );
  