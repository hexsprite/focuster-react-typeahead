import React from 'react'
import Autocomplete from './typeahead.jsx';

class Editable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      editing: this.props.editing
    };
  }

  handleClick = () => {
    this.setState({editing: true});
  }

  handleChange = (event, value) => {
    // ignore empty values
    if (!value.trim() && !this.props.allowEmpty) {
      this.setState({editing: false});
    } else {
      if (this.props.onChange) {
        const onChange = this.props.onChange;
        onChange(event, value);
      }
      this.setState({value, editing: false})
    }
  }

  handleKeyPress = (event) => {
    if (event.keyCode == 27)
      this.setState({value: this.props.value, editing: false})
  }

  render () {
    if (this.state.editing) {
      return (
        <Autocomplete
          value={this.state.value}
          onChange={(event, value) => this.handleChange(event, value)}
          onBlur={(event, value) => this.handleChange(event, value)}
          onKeyPress={(event) => this.handleKeyPress(event)}
          focus={true}
          options={this.props.options || []}
          placeholder={this.props.placeholder}
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
