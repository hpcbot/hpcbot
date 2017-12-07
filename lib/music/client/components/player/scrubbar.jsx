/* Volume - Volume slider to adjust granular player volume */

import React from 'react';
import {render} from 'react-dom';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

import css from './scrubbar.css'

class ScrubBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(<div className='scrub left'>
            {this.props.paused && (    // Ugly hack to style the embedded volume bar when we mute
              <style>
                {`.scrub .rangeslider__fill {
                    background-color: #ef5350; }`
                }
              </style>
            )}
            <div className="left">{this.props.timestamp}</div>
            <div id="scrubber" className="left"><Slider
              min={0}
              max={100}
              value={this.props.progress}
              orientation='horizontal'
              onChange={this.props.onChange}
              onChangeStart={this.props.onChangeStart}
              onChangeComplete={this.props.onChangeComplete}
            /></div>
            <div className="left">{this.props.duration}</div>
          </div>
        );
  }
}

export default ScrubBar
