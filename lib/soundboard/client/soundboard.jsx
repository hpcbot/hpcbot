import React from 'react'
import {render} from 'react-dom'

import List from './list.jsx'
import SubGroup from './subgroup.jsx'

// Detect hostname for socket.io to connect
const hostname = window && window.location && window.location.hostname;

// Libraries
import openSocket from 'socket.io-client';
const socket = openSocket(hostname + ':5000'); // Connect to the server to get client updates

class Soundboard extends React.Component {
  constructor() {
    super()
    this.state = {
      lists: []
    }

    /* Bind this context for all our functions */
    this.updateState = this.updateState.bind(this);

    /* Handle updates from server */
    socket.on('soundboard:state', this.updateState);   // Receive state updates from server
  }

  render() {
    this.lists = this.state.lists.map((list, index) =>  {
      console.log(list.subgroup)
      if(list.subgroup) {
        // Recursive list yo :X
        return(<SubGroup
          key={index}
          title={list.title}
          subgroup={list.subgroup}
        />)
      } else {
        return(<List
        key={index}
        title={list.title}
        items={list.items}
      />)
      }
    })

    console.log(this.lists)
    return(<div id="lists">{this.lists}</div>)
  }

  updateState(state) {
    this.setState(state);
    console.log(this.state)
  }
}

render(<Soundboard/>, document.getElementById('soundboard'));
