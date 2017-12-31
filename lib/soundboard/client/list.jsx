/* List - a list of events for the soundboard */

import React from 'react'
import {render} from 'react-dom'

import Event from './event.jsx'

class List extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    this.items = this.props.items.map((item, index) => {
      // Some lists may contain other lists
      if(item.items) {
        return(<List
                key={index}
                title={item.title}
                items={item.items}
                click={this.props.click}
          />)
      } else {
        return(<Event
                key={index}
                name={item.name}
                event={item.event}
                parameters={item.parameters}
                click={this.props.click}
          />)
      }
    })

    return(<fieldset className="border">
              <legend className="title">{this.props.title}</legend>
              {this.items}
          </fieldset>)
  }
}

export default List
