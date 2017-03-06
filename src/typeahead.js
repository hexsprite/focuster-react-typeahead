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
      value: this.props.value || '',
      select: this.props.select || false
    };
  }

  componentDidMount() {
    // BAD BAD BAD _rootDOMNode
    const elem = this.input._rootDOMNode;
    if (this.props.focus) {
      // workaround for the autosizing textarea setting wrong initial height
      // when opening with editing=true
      setTimeout(() => {
        if (elem.clientHeight < elem.scrollHeight) {
          elem.style.height = 'auto';
        }
        elem.scrollIntoViewIfNeeded()
        if (this.props.select) {
          // select all the text
          elem.setSelectionRange(0, this.input.value.length);
        }
      }, 0);
      this.input.focus();
    }
    // catch window scroll
    this.findAncestor(elem, 'action-list__body')
      .addEventListener('scroll', this.handleScroll);
    this.findAncestor(elem, 'plan--multi-day')
      .addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    const elem = this.input._rootDOMNode;
    this.findAncestor(elem, 'action-list__body')
      .removeEventListener('scroll', this.handleScroll);
    this.findAncestor(elem, 'plan--multi-day')
      .addEventListener('scroll', this.handleScroll);
  }

  findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  _change() {
    const token = findToken(this.input.value, this.input.selectionEnd).value;
    const matches = this.matches(token);
    const showResults = Boolean(token) && matches.length > 0;
    let selected = this.state.selected;

    if (!this.state.showResults && showResults) {
      selected = 0;
    }

    this.setState({
      token,
      showResults,
      selected,
      matches
    });
  }

  handleChange = (event) => {
    if (event) {
      this.setState({value: event.target.value}, () => { this._change() });
    }
  }

  handleScroll = () => {
    this.setState({ showResults: false });
  }

  handleKeyPress = (event) => {
    let useKeyPress = true;
    log('handleKeyPress', event.keyCode, this);

    const KEY_ENTER = 13;
    const KEY_ESC = 27;
    const KEY_DOWN = 40;
    const KEY_UP = 38;
    const KEY_TAB = 9;

    event.persist();  // this is needed why again? think it may be Focuster specific

    switch(event.keyCode) {
      case KEY_TAB:
      case KEY_ENTER:
        //
        if (this.state.token && this.matches(this.state.token).length > 0) {
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
        if (this.state.showResults) {
          this.setState({showResults: false});
          // in this case we'll ignore it so it doesn't close the input
          useKeyPress = false;
        }
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
    if (useKeyPress && this.props.onKeyPress) {
      this.props.onKeyPress(event, this);
    }
  }

  changeSelected(amount) {
    log('changeSelected', amount, this.state.selected);
    let selected = this.state.selected + amount;
    const matches = this.matches(this.state.token);

    if (selected < 0) {
      selected = 0;
    } else if (selected >= matches.length) {
      selected = Math.max(0, matches.length - 1);
    }
    log('changeSelected', selected);
    this.setState({selected});
  }

  // input, token, position
  completeChoice() {
    const selectionEnd = this.input.selectionEnd;
    const selected = this.matches(this.state.token)[this.state.selected];
    const value = completeChoice(
      this.input.value,
      this.input.selectionEnd,
      this.state.token,
      selected
    );
    this.input.selectionEnd = selectionEnd + selected.length - this.state.token.length + 1;
    this.setState({value, showResults: false}, () => {this._change()});
  }

  matches(token) {
    let results = [];
    if (token) {
      results = this.props.options.filter((option) =>
        option.toLowerCase().startsWith(token.toLowerCase())
      );
    }
    return results;
  }

  _renderSearchResults() {
    if (!this.state.token || !this.matches(this.state.token).length) {
      return '';
    }

    function offset(el) {
      var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    const coordinates = new CaretCoordinates(this.input._rootDOMNode, this.input.selectionStart).get();
    const element = this.input._rootDOMNode;
    log('_renderSearchResults coordinates', coordinates);
    const lineHeight = element.style.lineHeight ? parseFloat(element.style.lineHeight) : 20
    const top = offset(element).top + coordinates.top + lineHeight;
    const left = offset(element).left;
    log('_renderSearchResults top=', top, 'left=', left);
    const style = {
      position: 'fixed',
      top: top + 'px',
      left: left + 'px',
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
          this.matches(this.state.token).map(
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
        selected: this.matches(this.state.token).indexOf(event.target.innerText)
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
