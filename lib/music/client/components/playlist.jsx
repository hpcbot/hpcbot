/* Playlist - a list of queued songs */

import React from 'react';
import {render} from 'react-dom';

import Song from './song.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [
      'A2h2YrfcJ4Y',
      '8GBlK8gbu6U',
      'cAMLa5ZC-B4']
    };
  }

  render() {
    // Parse the array of songs and generate list items
    this.songlist = this.state.songs.map((song) =>
      <Song key={song} song={song} selected={song == this.props.currentVideo} onTrackChange={() => this.props.onTrackChange(song)} />
    );

    return(<ul id='playlist'>
              {this.songlist}
          </ul>);
  }
}

export default Playlist
