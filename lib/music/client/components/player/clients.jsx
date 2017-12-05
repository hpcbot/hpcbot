/* Clients - Show other people connected and listening */

import React from 'react';
import {render} from 'react-dom';

class Clients extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return <div className="clients">Listeners: {this.props.clients}</div>
  }
}

export default Clients
