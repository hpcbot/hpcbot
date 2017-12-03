import React from 'react';
import {render} from 'react-dom';

// Components
import Player from './components/player.jsx'
import PlayButton from './components/playbutton.jsx'

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playing: false
    };

    this.toggle = this.toggle.bind(this);
  }
  // OnPlay: () => this.refs.player.play()

  // OnPAuse: () => this.refs.player.pause()
  render () {
    // Controls
    //   Play/pause button
    //   Skip button
    // Youtube video
    // Track metadata
    // Playlist
    // * Tracks
    return( <div>
              <Player videoId='A2h2YrfcJ4Y' playing={this.state.playing} onToggle={() => this.toggle()}/>
              <PlayButton playing={this.state.playing} onToggle={() => this.toggle()}/>
            </div>);
  }

  toggle() {
    this.setState({playing: !this.state.playing});
  }
}

render(<MusicPlayer/>, document.getElementById('music'));
