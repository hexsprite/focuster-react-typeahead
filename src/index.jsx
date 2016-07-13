'use strict';

import React from 'react';
import CaretCoordinates from 'textarea-caret-position';

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
    const KEY_ENTER = 13;
    const KEY_ESC = 27;
    const KEY_DOWN = 40;
    const KEY_UP = 38;
    const KEY_TAB = 9;

    switch(event.keyCode) {
      case KEY_TAB:
      case KEY_ENTER:
        //
        if (this.state.token && this.matches().length > 0) {
          this.completeChoice();
          event.preventDefault();
          event.stopPropagation();
        } else if (event.keyCode == KEY_ENTER) {
          this.handleBlur();
        }
        break;
      case KEY_ESC:
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

    const coordinates = new CaretCoordinates(this.input, this.input.selectionStart).get();
    const element = this.input;
    const top = element.offsetTop + coordinates.top;
    const left = element.offsetLeft + coordinates.left;
    console.log('coordinates', coordinates);
    console.log(top, left);
    const style = {
      position: 'absolute',
      // top: top + 'px',
      // left: left + 'px',
      background: 'white',
      border: '1px solid black'
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

  handleBlur = () => {
    console.log('handleBlur');
    this.props.onChange(this.input.value);
  }

  render() {
    return (
      <p>
        <textarea
          defaultValue={this.props.defaultValue}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          ref={(ref) => this.input = ref}
          rows={1}
          size={80}
          style={{resize: 'none'}}
          type="text"
        />
      {this.state.showResults && this._renderSearchResults()}
      </p>
    );
  }
}
