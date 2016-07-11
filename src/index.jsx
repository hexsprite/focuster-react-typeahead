'use strict';

import React from 'react';

import findToken from './findtoken';

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      choice: 'apple'
    };
  }

  handleChange = (event) => {
    console.log(event.target.value, event.target.selectionEnd);
    var token = findToken(event.target.value, event.target.selectionEnd).value;
    this.setState({
      token
    });
  }

  handleKeyPress = (event) => {
    // console.log('handleKeyPress', event.keyCode);
    if (this.state.token && event.keyCode == 9 || event.keyCode == 13) {
      this.completeChoice(this.state.choice);
      event.preventDefault();
    }
  }
  // input, token, position
  completeChoice = () => {
    let input = this.input;
    let value = input.value.slice(0, input.selectionEnd);
    let fragment = value.slice(value.lastIndexOf('#') + 1);
    let match = this.matches()[0];
    let lastTokenIndex = this.input.value.lastIndexOf('#');
    let before = this.input.value.slice(0, input.selectionEnd - fragment.length);
    let after = value.slice(input.selectionEnd + fragment.length + 1);
    value = before + match + ' ' + after;
    console.log('new value: ', value);
    this.input.value = value;
  }

  matches() {
    if (this.state.token) {
      const options = ['apple', 'banana', 'carrots'];
      return options.filter((option) => option.startsWith(this.state.token));
    }
    return [];
  }

  render() {
    const listComponent = (
      <ul>
      {this.matches().map(match =>
        <li>{match}</li>
      )}
      </ul>
    );
    return (
      <p>
        <input
          type="text"
          ref={(ref) => this.input = ref}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          size={80}
        />
        <br/>
        token: {this.state.token}
        <br/> options
        <listComponent/>
      </p>
    );
  }
}
