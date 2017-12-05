/* Playlist - an individual song */

import React from 'react';
import {render} from 'react-dom';

class Song extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(<li>
             {this.props.selected &&
               <b>
                 <img src={this.props.metadata.thumbnail} />
                 <a href="#" onClick={(song) => this.props.onTrackChange(song)}>{this.props.metadata.title}</a>
               </b>}
             {!this.props.selected &&
               <div>
                 <img src={this.props.metadata.thumbnail} />
                 <a href="#" onClick={(song) => this.props.onTrackChange(song)}>{this.props.metadata.title}</a>
               </div>}
            &nbsp; ({this.props.metadata.duration})
            &nbsp;<a href="#" onClick={(song) => this.props.onRemove(song)}>✖</a>
           </li>
         );
  }
}

export default Song
