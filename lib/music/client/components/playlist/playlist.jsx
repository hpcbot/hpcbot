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
    this.songlist = this.props.songs.map((song, index) =>
      <Song
        key={song}
        song={song}
        metadata={this.props.metadata[index]}
        selected={song == this.props.currentVideo}
        onTrackChange={() => this.props.onTrackChange(song)}
        onRemove={() => this.props.onRemove(song)}
      />
    );

    return(<ol id='playlist'>
              {this.songlist}
          </ol>);
  }
}

export default Playlist
