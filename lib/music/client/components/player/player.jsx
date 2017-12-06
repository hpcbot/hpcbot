/* Player - Video player that displays a youtube video */

import React from 'react';
import {render} from 'react-dom';

import YouTube from 'react-youtube'

import Volume from './volume.jsx'
import MuteButton from './mutebutton.jsx'
import Clients from './clients.jsx'

import css from './player.css'

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        player: null,
        title: null,
        duration: null,
        minutes: null,
        seconds: null,
        progress: null,
        muted: false,
        volume: 100
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
              rel: 1,
              showinfo: 0
            }
        };

    this._onReady = this._onReady.bind(this);
    this._onStateChange = this._onStateChange.bind(this);
    this._onChangeVideo = this._onChangeVideo.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
    this.onMuteUnmute = this.onMuteUnmute.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  render() {
    if(this.props.playing) {
      // If we join a session that's already going, start playing on load
      this.options.playerVars.autoplay = 1;
    }

    // Handle play/pause changes from parent
    if(this.state.player) {
      // Play/pause
      if(this.props.playing) {
        this.options.playerVars.autoplay = 1;  // Needed for when we change tracks via playlist
        this.state.player.playVideo();
      } else {
         this.state.player.pauseVideo();
       }

       // Mute/unmute
       if(this.state.muted) {
         this.state.player.mute();
       } else {
         this.state.player.unMute();
       }
    }

    return(<div id="player" className="row">
              <div id="youtube" className="col c3">
                <YouTube
                videoId={this.props.videoId}
                opts={this.options}
                onReady={this._onReady}
                onChangeVideo={this._onChangeVideo}
                onStateChange={this._onStateChange}
                />
              </div>
              <div id="metadata" className="col c5">
                <h3>{this.state.title}</h3>
                <p>{this.state.minutes}:{this.state.seconds} ({this.state.progress})</p>
                <div className="left" title="Mute audio (only for your computer)"><MuteButton muted={this.state.muted} onToggleMute={this.onMuteUnmute} /></div>
                <Volume muted={this.state.muted} value={this.state.volume} onChange={this.onVolumeChange} />
              </div>
              <div id="clients" className="col c2">
                <Clients clients={this.props.clients} />
              </div>
          </div>);
  }

  _onReady(event) {
    this.setState({
      player: event.target,   // Keep track of the player so we can access it
    });

    // Set a timer to poll the api for metadata changes
    setInterval(this.updateMetadata, 500);
  }

  _onStateChange(event) {
    // Listen for video to end
    if(event.data == YT.PlayerState.ENDED) {
        this.props.onEnd();
    }

  }

  _onChangeVideo(event) {
    this.setState({
      title: this.state.player.getVideoData().title
    });
    this.state.player.playvideo();
  }

  onMuteUnmute() {
    let muted = this.state.muted;
    this.setState({muted: !muted});
  }

  onVolumeChange(value) {
    this.setState({
      volume: value
    });
    console.log(value);
    this.state.player.setVolume(value);
    console.log(this.state.player.getVolume());
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

    // // Send current time to server
    // this.props.sendCurrentTime(time);
    //
    // // Report back with current time to sync w/ server
    // if(time != this.props.currentTime) {
    //   // Received new time from server
    //   this.state.player.seekTo(this.props.currentTime(), true);
    // }
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
