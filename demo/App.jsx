import React from 'react';
import Fork from 'react-ghfork';
import pkgInfo from '../package.json';
import Editable from '../src/editable.js';
import TEST_OPTIONS from '../src/testoptions'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Fork className="right" project={pkgInfo.user + '/' + pkgInfo.name} />
        <Editable
          displayValue="<b>foo</b> bar"
          options={TEST_OPTIONS}
          placeholder="placeholder"
          value="foo bar"
          select={true}
        />
      </div>
    );
  }
}
