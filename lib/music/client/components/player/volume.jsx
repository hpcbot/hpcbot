/* Volume - Volume slider to adjust granular player volume */

import React from 'react';
import {render} from 'react-dom';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

import css from './volume.css'

class Volume extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(<div className='slider-vertical left '>
            {this.props.muted && (    // Ugly hack to style the embedded volume bar when we mute
              <style>
                {`.slider-vertical .rangeslider__fill {
                    background-color: #ef5350; }`
                }
              </style>
            )}
            <Slider
              min={0}
              max={100}
              value={this.props.value}
              orientation='vertical'
              onChange={this.props.onChange}
            />
            <div className='volume-value center'>{this.props.value}</div>
          </div>
        );
  }
}

export default Volume
