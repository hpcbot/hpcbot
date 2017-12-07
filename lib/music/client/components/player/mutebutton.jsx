/* MuteButton - Mute/unmute button to (locally) adjust the volume */

import React from 'react';
import {render} from 'react-dom';

class MuteButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.muted) {
      return <a onClick={this.props.onToggleMute} className="btn btn-a smooth">🔊</a>
    } else {
      return <a onClick={this.props.onToggleMute} className="btn btn-a smooth">🔇</a>
    }
  }
}

export default MuteButton
