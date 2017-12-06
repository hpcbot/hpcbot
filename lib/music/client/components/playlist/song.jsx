/* Playlist - an individual song */

import React from 'react';
import {render} from 'react-dom';

import css from './song.css'

class Song extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(<tr className={"song " + (this.props.selected ? 'selected' : '')}>
             <td className="center"><a href="#" onClick={(song) => this.props.onTrackChange(song)} className="btn-a btn-sm smooth" >▶</a></td>
             <td className="center">{this.props.index}</td>
             <td className="center"><img className="thumbnail" src={this.props.metadata.thumbnail} /></td>
             <td>{this.props.metadata.title}</td>
             <td className="right">{this.props.metadata.duration}</td>
             <td className="center"><a href="#" onClick={(song) => this.props.onRemove(song)} className="btn-c btn-sm smooth" >✖</a></td>
          </tr>
         );
  }
}

export default Song
