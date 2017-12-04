/* Controls - Wrapper for the video player controlsk */

import React from 'react';
import {render} from 'react-dom';

import PlayButton from './playbutton.jsx'
import AddButton from './addbutton.jsx'

class Controls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="controls">
        <PlayButton playing={this.props.playing} onToggle={this.props.onPlayPause} />
        <button onClick={this.props.onSkip}>▶❚</button>
        <AddButton onAdd={(song) => this.props.onAdd(song)} />
      </div>
    );
  }
}

export default Controls
