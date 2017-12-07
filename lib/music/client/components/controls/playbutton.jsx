/* PlayButton - Play/Pause button to start/stop playback */

import React from 'react';
import {render} from 'react-dom';

class PlayButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.playing) {
      return <a onClick={this.props.onTogglePlay} className="btn-sm btn-a smooth">▶</a>
    } else {
      return <a onClick={this.props.onTogglePlay} className="btn-sm btn-a smooth">❚❚</a>
    }
  }
}

export default PlayButton
