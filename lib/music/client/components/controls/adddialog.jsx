/* AddDialog - Modal dialog to handle text entry */

import React from 'react';
import {render} from 'react-dom';

import css from './adddialog.css'

class AddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return(
    <div id="addDialog" className={"msg smooth " + (this.props.adding ? '' : 'hidden')}>
      <form onSubmit={this.handleSubmit}>
        <div className="center">
          <input type="text" placeholder="Paste a youtube URL here" value={this.state.song} onChange={this.handleChange} autoFocus={this.props.adding} className="smooth" />
          <button className="btn-a btn-sm smooth" type="submit">Add</button>
          <a onClick={this.props.onCancel} className="btn btn-sm smooth">Cancel</a>
        </div>
      </form>
    </div>);
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
      song: ''
    });
  }
}

export default AddDialog
