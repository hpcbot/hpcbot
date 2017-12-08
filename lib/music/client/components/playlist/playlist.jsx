/* Playlist - a list of queued
 */

import React from 'react'
import {render} from 'react-dom'

import Song from './song.jsx'

import css from './playlist.css'

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songGrabbed: null
    }

    this.onGrab = this.onGrab.bind(this)
  }

  render() {
    // Parse the array of songs and generate list items
    this.songlist = this.props.songs.map((song, index) =>
      <Song
        key={song}
        song={song}
        index={index+1}
        metadata={this.props.metadata[index]}
        selected={song == this.props.currentVideo}
        onTrackChange={() => this.props.onTrackChange(song)}
        onRemove={() => this.props.onRemove(song)}
        onGrab={(start) => this.onGrab(start)}
        onDrop={(end) => this.onDrop(end)}
        // onReorder={() => this.props.onReorder(start, end)}
      />
    );

    return( <table className="table" id="playlist">
              <tbody>
                {this.songlist}
              </tbody>
            </table>
          );
  }

  onGrab(index) {
    this.setState({
      songGrabbed: index
    });
  }
  onDrop(end) {
    this.props.onReorder(this.state.songGrabbed, end);
  }
}

export default Playlist
