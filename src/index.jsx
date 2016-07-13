'use strict';

import React from 'react';

import findToken from './findtoken';
import completeChoice from './completion'
import TEST_OPTIONS from './testoptions'

function log() {
  console.log.apply(console, arguments);
}

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      showResults: false,
      selected: 0
    };
  }

  _change() {
    const token = findToken(this.input.value, this.input.selectionEnd).value;
    const showResults = Boolean(token);
    let selected = this.state.selected;
    if (!this.state.showResults && showResults) {
      selected = 0;
    }
    this.setState({
      token,
      showResults,
      selected,
      matches: this.matches()
    });
  }

  handleChange = (event) => {
    log(event.target.value, event.target.selectionEnd);
    this._change();
  }

  handleKeyPress = (event) => {
    log('handleKeyPress', event.keyCode, this);
    const KEY_UP = 38;
    const KEY_DOWN = 40;

    switch(event.keyCode) {
      case 9:
      case 13:
        if (this.state.token && this.matches().length > 0) {
          this.completeChoice();
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 27:
        this.setState({showResults: false});
        break;
      case KEY_UP:
        this.changeSelected(-1);
        event.preventDefault();
        event.stopPropagation();
        break;
      case KEY_DOWN:
        this.changeSelected(1);
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  changeSelected(amount) {
    let selected = this.state.selected + amount;
    selected = Math.max(selected, 0);
    selected = Math.min(selected, this.matches().length - 1);
    log('changeSelected', selected);
    this.setState({selected});
  }

  // input, token, position
  completeChoice() {
    const selectionEnd = this.input.selectionEnd;
    const selected = this.matches()[this.state.selected];
    this.input.value = completeChoice(
      this.input.value,
      this.input.selectionEnd,
      this.state.token,
      selected
    );
    this.input.selectionEnd = selectionEnd + selected.length - this.state.token.length + 1;
    this.setState({showResults: false});
    this._change();
  }

  matches() {
    let results = [];
    if (this.state.token) {
      log('matches has token');
      results = TEST_OPTIONS.filter((option) => option.toLowerCase().startsWith(this.state.token.toLowerCase()));
    }
    log('matches: results=', results);
    return results;
  }

  _renderSearchResults() {
    if (!this.state.token) {
      return '';
    }

    if (!this.matches()) {
      return '';
    }

    const style = {
      position: 'absolute',
      background: 'white',
      border: '1px solid black',

    };

    let calculateStyle = (index) => {
      let style = {
        'padding-left': '5px',
        'padding-right': '5px'
      };

      if (this.state.selected == index)
        style = {
          background: 'blue',
          color: 'white',
          'padding-left': '5px',
          'padding-right': '5px'
        };
      return style;
    };

    return (
      <div style={style}>
        {
          this.matches().map(
            (match, index) =>
              <div onClick={this.handleMatchClick} style={calculateStyle(index)}>
                {match}
              </div>
        )}
      </div>
    );
  }

  handleMatchClick = (event) => {
    this.setState(
      {
        selected: this.matches().indexOf(event.target.innerText)
      },
      () => {
        this.completeChoice();
      }
    );
  }

  render() {
    return (
      <p>
        <input
          type="text"
          ref={(ref) => this.input = ref}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          size={80}
        />
      {this.state.showResults && this._renderSearchResults()}
      </p>
    );
  }
}
