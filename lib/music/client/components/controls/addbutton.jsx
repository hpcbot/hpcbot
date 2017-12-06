/* AddButton - Button to add a song to the playlist */

import React from 'react';
import {render} from 'react-dom';

import css from './addbutton.css'

class AddButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      if(!this.props.adding) {
        return(<div id="addbutton">
          <a onClick={this.props.onToggle} className="btn-sm btn-b smooth">+ Add Song</a>
        </div>);
      } else {
        // Add dialog is open, show a cancel button instead
        return(<div id="addbutton">
          <a onClick={this.props.onToggle} className="btn-sm btn smooth">Cancel</a>
        </div>);
      }
    }
}

export default AddButton
