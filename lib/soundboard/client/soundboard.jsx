import React from 'react'
import {render} from 'react-dom'

import Nav from 'hpc-bot-nav'
import List from './components/list.jsx'

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
        return(<List
        key={index}
        title={list.title}
        header={true}  // We know this is a first level list (used for styling purposes)
        items={list.items}
        list={list.list}  // In case another list is nested
        click={this.onClick}
      />)
      })
    return(<div>
            <Nav current="soundboard" />
            <div id="lists">{this.lists}</div>
          </div>)
  }

  updateState(state) {
    this.setState(state);
  }

  onClick(event, parameters) {
    socket.emit('soundboard', event, parameters)
  }
}

render(<Soundboard/>, document.getElementById('soundboard'));
