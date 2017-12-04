/* Playlist - a list of queued
 */

import React from 'react';
import {render} from 'react-dom';

import Song from './song.jsx';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Parse the array of songs and generate list items
    this.songlist = this.props.songs.map((song) =>
      <Song key={song} song={song} selected={song == this.props.currentVideo} onTrackChange={() => this.props.onTrackChange(song)} />
    );

    return(<ol id='playlist'>
              {this.songlist}
          </ol>);
  }
}

export default Playlist
