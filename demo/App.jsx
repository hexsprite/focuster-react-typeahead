import React from 'react';
import Fork from 'react-ghfork';
import pkgInfo from '../package.json';
import Autocomplete from '../src/index.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Fork className="right" project={pkgInfo.user + '/' + pkgInfo.name} />
        <p>Just demonstrating the awesomeness of this boilerplate here.</p>
        <p>Hi</p>
        <Autocomplete />
      </div>
    );
  }
}
