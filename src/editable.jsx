import React from 'react'
import Autocomplete from './index.jsx';

class Editable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      editing: false
    };
  }

  handleClick = () => {
    this.setState({editing: true});
  }

  render () {
    if (this.state.editing) {
      return (
        <Autocomplete
          defaultValue={this.state.value}
          onChange={(value) => this.setState({value, editing: false})}
        />);
    } else {
      return (
        <span
          dangerouslySetInnerHTML={{__html: this.props.displayValue}}
          onClick={this.handleClick}
        />
      );
    }
  }
}

export default Editable;
