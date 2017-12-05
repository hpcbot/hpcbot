/* AddButton - Button to add a song to the playlist */

import React from 'react';
import {render} from 'react-dom';

class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      song: ''
    }

    this.onToggle = this.onToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    if(!this.state.adding) {
      // Do now show the 'add' dialog
      return <a onClick={this.onToggle} className="btn-sm btn-b smooth">+ Add Song</a>
    } else {
      // Show the add dialog
      return(<div className="addSong">
               <a onClick={this.onToggle} className="btn-sm btn-b smooth">+ Add Song</a>
               <form onSubmit={this.handleSubmit}>
                 <div className="addDialog">
                   <input type="text" placeholder="Paste a youtube URL here" value={this.state.song} onChange={this.handleChange} />
                   <input type="submit" value="Add to end" />
                 </div>
               </form>
             </div>);
    }
  }

  onToggle() {
    // Show the 'add field' dialog'
    this.setState({
      adding: !this.state.adding
    });
  }

  handleChange(event) {
    this.setState({song: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    // Add song to playlist

    this.props.onAdd(this.state.song)

    // Hide dialog and clear text field
    this.setState({
      adding: false,
      song: ''
    });
  }
}

export default AddButton
