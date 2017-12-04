/* MuteButton - Mute/unmute button to (locally) adjust the volume */

import React from 'react';
import {render} from 'react-dom';

class MuteButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.muted) {
      return <button onClick={this.props.onToggleMute}>🔊</button>
    } else {
      return <button onClick={this.props.onToggleMute}>🔇</button>
    }
  }
}

export default MuteButton
