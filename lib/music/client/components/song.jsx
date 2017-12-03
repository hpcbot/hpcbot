/* Playlist - an individual song */

import React from 'react';
import {render} from 'react-dom';

class Song extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(<li>
             {this.props.active && <b><a href="#" onClick={(song) => this.props.onTrackChange(song)}>{this.props.song}</a></b>}
             {!this.props.active && <a href="#" onClick={(song) => this.props.onTrackChange(song)}>{this.props.song}</a>}
           </li>
         );
  }
}

export default Song
