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
        videoId: 'A2h2YrfcJ4Y'
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
              <Playlist playing={this.state.playing} videoId={this.state.videoId} onTrackChange={(song) => this.trackChange(song)} />
            </div>);
  }

  toggle() {
    this.setState({playing: !this.state.playing});
  }

  trackChange(song) {
    console.log('track changed to:' + song);
    this.setState({
      playing: true,
      videoId: song});
  }

}

render(<MusicPlayer/>, document.getElementById('music'));
