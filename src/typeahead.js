'use strict';

import React from 'react';
import CaretCoordinates from 'textarea-caret-position';
import Textarea from 'react-textarea-autosize';

import findToken from './findtoken';
import completeChoice from './completion'

function log() {
  const doLog = 0;
  if (doLog)
    console.log.apply(console, arguments);
}

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      showResults: false,
      selected: 0,
      value: this.props.value
    };
  }

  componentDidMount() {
    if (this.props.focus) {
      // workaround for the autosizing textarea setting wrong initial height
      // when opening with editing=true
      setTimeout(() => {
        const elem = this.input._rootDOMNode;
        if (elem.clientHeight < elem.scrollHeight)
          elem.style.height = 'auto';
      }, 0);
      this.input.focus();
    }
  }

  _change() {
    const value = this.state.value;
    log('_change', value);
    const token = findToken(this.input.value, this.input.selectionEnd).value;
    const showResults = Boolean(token);
    let selected = this.state.selected;
    if (!this.state.showResults && showResults) {
      selected = 0;
    }
    this.setState({
      // value,
      token,
      showResults,
      selected,
      matches: this.matches()
    });
  }

  handleChange = (event) => {
    if (!event) return;
    log(event.target.value, event.target.selectionEnd);
    const value = event.target.value;
    this.setState({value}, () => {
      this._change();
    });
  }

  handleKeyPress = (event) => {
    log('handleKeyPress', event.keyCode, this);

    const KEY_ENTER = 13;
    const KEY_ESC = 27;
    const KEY_DOWN = 40;
    const KEY_UP = 38;
    const KEY_TAB = 9;

    event.persist();

    switch(event.keyCode) {
      case KEY_TAB:
      case KEY_ENTER:
        //
        if (this.state.token && this.matches().length > 0) {
          this.completeChoice();
          event.preventDefault();
          event.stopPropagation();
        } else if (event.keyCode == KEY_ENTER) {
          if (this.props.onChange) {
            this.props.onChange(event, this.input.value, this);
          }
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case KEY_ESC:
        if (this.state.showResults)
          this.setState({showResults: false});
        break;
      case KEY_UP:
        if (this.state.showResults) {
          this.changeSelected(-1);
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case KEY_DOWN:
        if (this.state.showResults) {
          this.changeSelected(1);
          event.preventDefault();
          event.stopPropagation();
        }
        break;
    }
    if (this.props.onKeyPress) {
      this.props.onKeyPress(event);
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
    const value = completeChoice(
      this.input.value,
      this.input.selectionEnd,
      this.state.token,
      selected
    );
    this.input.selectionEnd = selectionEnd + selected.length - this.state.token.length + 1;
    this.setState({value, showResults: false}, () => {this._change()});
  }

  matches() {
    let results = [];
    if (this.state.token) {
      log('matches has token', this.state.token);
      results = this.props.options.filter((option) => option.toLowerCase().startsWith(this.state.token.toLowerCase()));
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

    const coordinates = new CaretCoordinates(this.input._rootDOMNode, this.input.selectionStart).get();
    const element = this.input;
    log('_renderSearchResults coordinates', coordinates);
    const top = element.offsetTop + coordinates.top;
    const left = element.offsetLeft + coordinates.left;
    log('_renderSearchResults top=', top, 'left=', left);
    const style = {
      position: 'absolute',
      // top: top + 'px',
      // left: left + 'px',
      background: 'white',
      border: '1px solid black',
      zIndex: 1  // might be Focuster specific
    };

    let calculateStyle = (index) => {
      let style = {
        color: 'black',
        paddingLeft: '5px',
        paddingRight: '5px'
      };

      if (this.state.selected == index)
        style = {
          background: 'blue',
          color: 'white',
          paddingLeft: '5px',
          paddingRight: '5px'
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

  handleBlur = (event) => {
    if (this.props.onBlur)
      this.props.onBlur(event, this.state.value, this);
  }

  render() {
    return (
      <div>
        <Textarea
          value={this.state.value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          placeholder={this.props.placeholder}
          ref={(ref) => this.input = ref}
          style={{resize: 'none'}}
          rows={1}
          type="text"
        />
      {this.state.showResults && this._renderSearchResults()}
    </div>
    );
  }
}
