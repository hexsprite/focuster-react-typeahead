import React from 'react'
import Autocomplete from './typeahead.js'

class Editable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      editing: this.props.editing,
      select: this.props.select
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ editing: nextProps.editing, select: nextProps.select })
  }

  handleClick = () => {
    this.setState({ editing: true })
  }

  handleChange = (event, value) => {
    // ignore empty values
    const newState = { editing: false }
    if (value.trim() || this.props.allowEmpty) {
      const onChange = this.props.onChange
      onChange && onChange(event, value)
      newState.value = value
    }
    this.setState(newState)
  }

  handleKeyPress = event => {
    if (event.keyCode == 27)
      this.setState({ value: this.props.value, editing: false })
  }

  render() {
    if (this.state.editing) {
      return (
        <Autocomplete
          focus
          onBlur={(event, value) => this.handleChange(event, value)}
          onChange={(event, value) => this.handleChange(event, value)}
          onKeyPress={event => this.handleKeyPress(event)}
          options={this.props.options || []}
          placeholder={this.props.placeholder}
          select={this.props.select}
          value={this.state.value}
          verticalScrollElement={this.props.verticalScrollElement}
          horizontalScrollElement={this.props.horizontalScrollElement}
          zIndex={this.props.zIndex}
        />
      )
    } else {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: this.props.displayValue }}
          onClick={this.handleClick}
        />
      )
    }
  }
}

Editable.defaultProps = {
  displayValue: value => value,
  select: false,
  editing: false,
  value: ''
}

export default Editable
