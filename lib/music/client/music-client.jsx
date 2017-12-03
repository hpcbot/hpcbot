import React from 'react';
import {render} from 'react-dom';

// Components
import Player from './components/player.jsx'
import PlayButton from './components/playbutton.jsx'
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

    this.toggle = this.toggle.bind(this);
    this.trackChange = this.trackChange.bind(this);
  }

  render () {
    // Controls
    //   Skip button
    // Youtube video
    // Track metadata
    // Playlist
    // * Tracks
    return( <div>
              <Player videoId={this.state.videoId} playing={this.state.playing} onToggle={() => this.toggle()}/>
              <PlayButton playing={this.state.playing} onToggle={() => this.toggle()}/>
              <button onClick={() => this.skip()}>▶❚</button>
              <Playlist playing={this.state.playing} currentVideo={this.state.videoId} songs = {this.state.songs} onTrackChange={(song) => this.trackChange(song)} />
            </div>);
  }

  toggle() {
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
      console.log('got here');
    } else {
      nextVideo  = this.state.songs[0];
    }

    this.setState({
      videoId: nextVideo
    });
  }
}


render(<MusicPlayer/>, document.getElementById('music'));
