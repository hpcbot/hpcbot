/* User - Render a single user */

import React from 'react'
import {render} from 'react-dom'

import css from './user.css'

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return( <div className="user">
              <img className="profile" src={this.props.picture} title={this.props.username} />
            </div>
          );
  }
}

export default User
