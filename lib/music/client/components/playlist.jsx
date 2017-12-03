/* Playlist - a list of queued songs */

import React from 'react';
import {render} from 'react-dom';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [
      'A2h2YrfcJ4Y',
      '8GBlK8gbu6U',
      'cAMLa5ZC-B4']
    };

    // this.trackChange.bind(this);
  }

  render() {
    // Parse the array of songs and generate list items
    this.songlist = this.state.songs.map((song) =>
    <li key={song.toString()}>
      <a href="#" onClick={() => this.props.onTrackChange(song)}>{song}</a>
    </li>);

    return(<ul id='playlist'>
              {this.songlist}
          </ul>);
  }
}

export default Playlist
