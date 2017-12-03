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

    this.options = {  // Options to initialize the youtube player
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


    this._onReady = this._onReady.bind(this);
    this._onChangeVideo = this._onChangeVideo.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
  }

  render() {

    // Handle play/pause changes from parent
    if(this.state.player) {
      if(this.props.playing) {
        this.options.playerVars.autoplay = 1;  // Needed for when we change tracks via playlist
        this.state.player.playVideo();
      } else {
         this.state.player.pauseVideo();
       }
    }

    return(<div id='player'>
              <YouTube
                videoId={this.props.videoId}
                opts={this.options}
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

    console.log('ready');
    // Set a timer to poll the api for metadata changes
    setInterval(this.updateMetadata, 60);
  }

  _onChangeVideo(event) {
    this.setState({
      title: this.state.player.getVideoData().title
    });
    this.state.player.playvideo();
  }

  _onEnd(event) {
    // Notify parent when the song ends
    console.log('end');
    // this.props.onToggle();
  }

  updateMetadata() {
    let data = this.state.player.getVideoData();
    let time = this.state.player.getCurrentTime();
    let duration = this.state.player.getDuration();

    if(data && time && duration) {
      this.setState({
        title: data.title,
        duration: data.duration,
        minutes: this.parseMinutes(time),
        seconds: this.parseSeconds(time),
        progress: this.parsePercentage(time, duration)
      })
    }
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
