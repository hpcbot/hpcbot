/* Player - Video player that displays a youtube video */

import React from 'react';
import {render} from 'react-dom';

import YouTube from 'react-youtube'

class Player extends React.Component {

  render() {
    const options = {
  			width: '320',
        height: '195',
        playerVars: {
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        }
    };

    return(
      <YouTube
          videoId='A2h2YrfcJ4Y'
          opts={options}
          onReady={this._onReady}
        />
    );
  };
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

export default Player
