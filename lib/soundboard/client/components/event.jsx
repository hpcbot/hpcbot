/* Event - an individual event button */

import React from 'react'
import {render} from 'react-dom'

class Event extends React.Component {
  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  render() {
    return(<button
            id={this.props.event}
            onClick={this.onClick}
            className={this.props.list.replace(/[^A-Z0-9]+/ig, "_").toLowerCase() /* Remove whitespace + special chars */}>
              {this.props.name}
           </button>)
  }

  onClick(e) {
    e.preventDefault();
    this.props.click(this.props.event, this.props.parameters)
  }

}

export default Event
