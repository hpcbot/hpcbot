/* Playlist - a list of queued
 */

import React from 'react'
import {render} from 'react-dom'

import Song from './song.jsx'

import css from './playlist.css'

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

    return( <table class="table" id="playlist">
              <tbody>
                {this.songlist}
              </tbody>
            </table>
          );
  }
}

export default Playlist
