/* Subgroup - a list of lists! */

import React from 'react'
import {render} from 'react-dom'

import List from './list.jsx'

class SubGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    this.lists = this.props.subgroup.map((list, index) =>
    <List
    key={index}
    title={list.title}
    items={list.items}
    />)

    return(<fieldset className="border">
              <legend className="title">{this.props.title}</legend>
              {this.lists}
          </fieldset>)
  }
}

export default SubGroup
