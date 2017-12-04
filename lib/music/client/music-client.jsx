import React from 'react';
import {render} from 'react-dom';

// Libraries
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000'); // Connect to the server to get client updates

// Components
import Player from './components/player.jsx'
import Controls from './components/controls/controls.jsx'
import Playlist from './components/playlist.jsx'


class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playing: false,
        videoId: null,
        songs: []
    };

    this.playPause = this.playPause.bind(this);
    this.trackChange = this.trackChange.bind(this);
    this.skip = this.skip.bind(this);
    this.add = this.add.bind(this);
    this.updateState = this.updateState.bind(this);
    socket.on('state', this.updateState); // Receive state updates from server
  }

  render () {
    // Controls
    //   Skip button
    // Youtube video
    // Track metadata
    // Playlist
    // * Tracks
    return( <div>
              <Player videoId={this.state.videoId} playing={this.state.playing} onToggle={this.toggle} />
              <Controls playing={this.state.playing} onPlayPause={() => this.playPause()} onSkip = {this.skip} onAdd={(song) => this.add(song)} />
              <Playlist playing={this.state.playing} currentVideo={this.state.videoId} songs={this.state.songs} onTrackChange={(song) => this.trackChange(song)} />
            </div>);
  }

  updateState(state) {
    console.log(state);
    this.setState(state);
  }

  playPause() {
    this.setState({playing: !this.state.playing});
  }

  trackChange(song) {
    socket.emit('playSong', song);  // Tell the server to update the current song

    this.setState({
      playing: true
    });
  }

  skip() {
    socket.emit('skipSong');
  }

  add(song) {
    if(song) {
      socket.emit('addSong', song);
    }
  }
}


render(<MusicPlayer/>, document.getElementById('music'));
