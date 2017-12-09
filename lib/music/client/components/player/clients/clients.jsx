/* Clients - Show other people connected and listening */

import React from 'react';
import {render} from 'react-dom';

import css from './clients.css'
import User from './user.jsx'

class Clients extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.users = this.props.clients.map((user, index) =>
      <User
        key={user.id}
        picture={user.picture}
        username={user.username}
      />
    );

    return( <div>
              <div className="users">
                {this.users}
              </div>
              <div className="clients">Listeners: {this.props.clients.length}</div>
            </div>
          );
  }
}

export default Clients
