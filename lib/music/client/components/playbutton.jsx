/* PlayButton - Play/Pause button to start/stop playback */

import React from 'react';
import {render} from 'react-dom';

class PlayButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.playing) {
      return <button onClick={this.props.onToggle}>▶</button>
    } else {
      return <button onClick={this.props.onToggle}>❚❚</button>
    }
  }
}

export default PlayButton
