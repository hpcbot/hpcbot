/* Nav - Simple navigation for the HPC bot */

import React from 'react'
import {render} from 'react-dom'

import css from './nav.css'

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <nav className="nav">
        <div className="container">
          <img id="logo" src="/music/images/dumbledore.png"/>
          <a className="pagename current" href="#">Music</a>
          <a href="#">Overlays</a>
        </div>
      </nav>)
  }
}

export default Nav
