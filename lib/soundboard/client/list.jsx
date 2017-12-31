/* List - a list of events for the soundboard */

import React from 'react'
import {render} from 'react-dom'

import Event from './event.jsx'

class List extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    this.events = this.props.items.map((event, index) =>
    <Event
    key={index}
    name={event.name}
    event={event.event}
    />)

    return(<fieldset className="border">
              <legend className="title">{this.props.title}</legend>
              {this.events}
          </fieldset>)
  }
}

export default List
