import React from 'react';
import {render} from 'react-dom';

// Components
import Player from './components/player.jsx'

class MusicPlayer extends React.Component {
  render () {
    // Controls
    //   Play/pause button
    //   Skip button
    // Youtube video
    // Track metadata
    // Playlist
    // * Tracks

    return <Player videoId='A2h2YrfcJ4Y' playing='false'/>;
  }
}

render(<MusicPlayer/>, document.getElementById('music'));
