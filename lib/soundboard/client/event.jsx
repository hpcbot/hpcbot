/* Event - an individual event button */

import React from 'react'
import {render} from 'react-dom'

class Event extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(<button id={this.props.event}>
              {this.props.name}
           </button>)
  }
}

export default Event
