/* Controls - Wrapper for the video player controlsk */

import React from 'react';
import {render} from 'react-dom';

import PlayButton from './buttons/playbutton.jsx'
import AddButton from './buttons/addbutton.jsx'
import AddDialog from './buttons/adddialog.jsx'

import css from './controls.css'

class Controls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false
    }

    this.onToggle = this.onToggle.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  render() {
    return(<div>
            <div id="controls">
                <PlayButton playing={this.props.playing} onTogglePlay={this.props.onPlayPause} />
                <a onClick={this.props.onSkip} className="btn-sm btn-a smooth">▶❚</a>
                <a onClick={this.props.onShuffle} className="btn-sm btn-a smooth"><img src="/music/images/shuffle.png" className="icon" /></a>
                <AddButton adding={this.state.adding} onToggle={this.onToggle} />
            </div>
            <AddDialog adding={this.state.adding} onAdd={this.onAdd} onCancel={this.onToggle} />
      </div>
    );
  }

  onToggle() {
    this.setState({
      adding: !this.state.adding
    });
  }

  onAdd(song) {
    this.setState({
      adding: !this.state.adding
    });

    this.props.onAdd(song);
  }
}

export default Controls
