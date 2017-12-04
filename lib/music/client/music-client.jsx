import React from 'react';
import {render} from 'react-dom';

// Components
import Player from './components/player.jsx'
import Controls from './components/controls/controls.jsx'
// import PlayButton from './components/playbutton.jsx'
// import AddButton from './components/addbutton.jsx'
import Playlist from './components/playlist.jsx'


class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playing: false,
        videoId: 'A2h2YrfcJ4Y',
        songs: [
        'A2h2YrfcJ4Y',
        '8GBlK8gbu6U',
        'cAMLa5ZC-B4']
    };

    this.playPause = this.playPause.bind(this);
    this.trackChange = this.trackChange.bind(this);
    this.skip = this.skip.bind(this);
    this.add = this.add.bind(this);
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

  playPause() {
    this.setState({playing: !this.state.playing});
  }

  trackChange(song) {
    this.setState({
      playing: true,
      videoId: song});
  }

  skip() {
    let nextVideo;
    let index = this.state.songs.indexOf(this.state.videoId);

    if (index >= 0 && index < this.state.songs.length - 1) {
      nextVideo = this.state.songs[index + 1];
    } else {
      nextVideo  = this.state.songs[0];
    }

    this.setState({
      videoId: nextVideo
    });
  }

  add(song) {
    if(song) {
      // Workaround because just pushing the array leads to an improper output
      let _songs = this.state.songs;
      _songs.push(song);

      this.setState({
        songs: _songs
      });
    }
  }
}


render(<MusicPlayer/>, document.getElementById('music'));
