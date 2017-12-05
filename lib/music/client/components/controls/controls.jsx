/* Controls - Wrapper for the video player controlsk */

import React from 'react';
import {render} from 'react-dom';

import PlayButton from './playbutton.jsx'
import AddButton from './addbutton.jsx'

import css from './controls.css'

class Controls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="controls">
          <PlayButton playing={this.props.playing} onTogglePlay={this.props.onPlayPause} />
          <a onClick={this.props.onSkip} className="btn-sm btn-a smooth">▶❚</a>
          <div id="playlistControls">
            <AddButton onAdd={(song) => this.props.onAdd(song)} />
          </div>
      </div>
    );
  }
}

export default Controls
