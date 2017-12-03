/* Player - Video player that displays a youtube video */

import React from 'react';
import {render} from 'react-dom';

import YouTube from 'react-youtube'

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        player: null,
        title: null,
        duration: null,
        minutes: null,
        seconds: null,
        progress: null
    };

    this._onReady = this._onReady.bind(this);
    this._onChangeVideo = this._onChangeVideo.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
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

    return(<div id='player'>
              <YouTube
                videoId={this.props.videoId}
                opts={options}
                onReady={this._onReady}
                onChangeVideo={this._onChangeVideo}
              />
              <p>{this.state.title}</p>
              <p>Time: {this.state.minutes}:{this.state.seconds} ({this.state.progress})</p>
          </div>);
  }

  _onReady(event) {
    this.setState({
      player: event.target,   // Keep track of the player so we can access it
    });

    // Set a timer to poll the api for metadata changes
    setInterval(this.updateMetadata, 60);
  }

  _onChangeVideo(event) {
    this.setState({
      title: this.state.player.getVideoData().title
    });
  }

  _onEnd(event) {
    // Notify parent when the song ends
    console.log('end');
    // this.props.onToggle();
  }

  updateMetadata() {
    this.setState({
      title: this.state.player.getVideoData().title,
      duration: this.state.player.getVideoData().duration,
      minutes: this.parseMinutes(this.state.player.getCurrentTime()),
      seconds: this.parseSeconds(this.state.player.getCurrentTime()),
      progress: this.parsePercentage(this.state.player.getCurrentTime(), this.state.player.getDuration())
    })
  }
  /* Metadata utility functions */

  parseMinutes(time) {
    var minutes = Math.round(time/60);
    return(minutes);
  }

  parseSeconds(time) {
    var seconds = Math.round(time % 60);

    // Fix some weirdness with the youtube timestamp
		if(seconds == 60) {
			// For some reason 60 shows up on the seconds count
			seconds = '00';
		} else if(seconds >= 0 && seconds < 10) {
			// Prepend zero
			seconds = 0 + seconds.toString();
		}

		return seconds;
  }

  parsePercentage(time, duration) {
    var percentage = Math.round(time / duration * 100);
    percentage = percentage.toString() + '%';
    return(percentage);
  }
}

export default Player
