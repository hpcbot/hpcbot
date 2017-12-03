/* Player - Video player that displays a youtube video */

import React from 'react';
import {render} from 'react-dom';

import YouTube from 'react-youtube'

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        player: null
    };
    // this.play = this.play.bind(this);
    this._onReady = this._onReady.bind(this);
  }

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

    // Handle play/pause changes from parent
    if(this.props.playing) {
      if(this.state.player) {
        this.state.player.playVideo();
      }
    } else {
      if(this.state.player) {
        this.state.player.pauseVideo();
      }
    }

    return(<YouTube
        videoId={this.props.videoId}
        opts={options}
        onReady={this._onReady}
      />);
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    this.setState({player: event.target});
  }

  _onEnd(event) {
    // Notify parent when the song ends
    console.log('end');
    // this.props.onToggle();
  }
}

export default Player
