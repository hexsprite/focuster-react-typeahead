import React, { PropTypes } from 'react'
import Autocomplete from './index.jsx';

class Editable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Some value',
      editing: false
    };
  }

  handleClick = () => {
    this.setState({editing: true});
    console.log('handleClick')
  }

  render () {
    if (this.state.editing) {
      return <Autocomplete defaultValue={this.state.value}/>;
    } else {
      return <span onClick={this.handleClick}>{this.state.value}</span>;
    }
  }
}

export default Editable;
