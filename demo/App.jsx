import React from 'react';
import Fork from 'react-ghfork';
import pkgInfo from '../package.json';
import Editable from '../src/editable';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Fork className="right" project={pkgInfo.user + '/' + pkgInfo.name} />
        <Editable />
      </div>
    );
  }
}
