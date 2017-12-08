/* Playlist - an individual song */

import React from 'react';
import {render} from 'react-dom';

import css from './song.css'

class Song extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grabbing: false,
      draggedOver: false
    }

    this.grab = this.grab.bind(this);
    this.release = this.release.bind(this);
    this.drop = this.drop.bind(this);
    this.dragEnter = this.dragEnter.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  render() {
    return(<tr
      className={"song " + (this.props.selected ? 'selected ' : '') + (this.state.grabbing ? 'grabbing ' : '') + (this.state.draggedOver ? 'dragOver ' : '')}
      draggable='true'
      onDrop={this.drop}
      onDragOver={this.preventDefault}
      onDragEnter={this.dragEnter}
      onDragLeave={this.dragLeave}
      onDragEnd={this.dragEnd}
      >
             <td className="center" title="Play this song"><a onClick={(song) => this.props.onTrackChange(song)} className="btn-a btn-sm smooth" >▶</a></td>
             <td className="center">{this.props.index}</td>
             <td className="center"><img className="thumbnail" src={this.props.metadata.thumbnail} /></td>
             <td
               className={"songTitle " + (this.state.grabbing ? 'grabbing' : '')}
               onMouseEnter={this.hover}
               onMouseLeave={this.unhover}
               onMouseDown={this.grab}
               onMouseUp={this.release}
               >{this.props.metadata.title}
             </td>
             <td className="right">{this.props.metadata.duration}</td>
             <td className="center" title="Remove from list"><a onClick={(song) => this.props.onRemove(song)} className="btn-c btn-sm smooth">✖</a></td>
          </tr>
         );
  }

  /* Drag/Drop has three stages:
  #1 - Grab (or release a grab)
  #2 - Drag (Enter/Leave or End)
  #3 - Drop ()*/

  grab(event) {
    // User clicked to grab something

    // Only listen for left clicks
    if(event.button == 0) {
      this.setState({
        grabbing: true
      });

      this.props.onGrab(this.props.index);
    }
  }

  release() {
    // User let go of the object in place
    this.setState({
      grabbing: false
    });
  }



  dragEnd(event) {
    // HACK - release doesn't fire when you release a drag/drop
    // Stopped dragging/dropping a row
    this.setState({
      grabbing: false
    });
  }

  dragEnter() {
    // Style the drop target
    this.setState({
      draggedOver: true
    });
  }

  dragLeave() {
    // Unstyle the drop target
    this.setState({
      draggedOver: false
    })
  }


  drop(event) {
    // User dropped the row onto another
    this.setState({
      draggedOver: false
    });

    this.props.onDrop(this.props.index);
  }


  /* Hack to get drag and drop working in Chrome */
  preventDefault(event) {
    event.preventDefault();
  }
}

export default Song
