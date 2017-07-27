import _ from 'lodash'
import React from 'react'
import Autocomplete from './typeahead.js'

class Editable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      editing: this.props.editing
    }
  }

  //
  shouldComponentUpdate(nextProps, nextState) {
    // if state changed or the props changed (except onChange callback)
    const shouldUpdate =
      !_.isEqual(this.state, nextState) ||
      !_.isEqual(_.omit(this.props, 'onChange'), _.omit(nextProps, 'onChange'))
    return shouldUpdate
  }

  componentWillReceiveProps({ editing, value }) {
    this.setState({ editing })
    // we should update our value if we are not editing
    if (!editing && value !== this.state.value) {
      this.setState({ value })
    }
  }

  handleClick = () => {
    this.setState({ editing: true })
  }

  handleChange = (event, value) => {
    // ignore empty values
    const newState = { editing: false }
    if (value.trim() || this.props.allowEmpty) {
      if (this.props.onChange) {
        this.props.onChange(event, value)
      }
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
          horizontalScrollElement={this.props.horizontalScrollElement}
          onBlur={this.handleChange.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          options={this.props.options || []}
          placeholder={this.props.placeholder}
          select={this.props.select}
          value={this.state.value}
          verticalScrollElement={this.props.verticalScrollElement}
          zIndex={this.props.zIndex}
        />
      )
    } else {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: this.props.displayValue }}
          onClick={this.handleClick.bind(this)}
        />
      )
    }
  }
}

Editable.defaultProps = {
  allowEmpty: false,
  displayValue: value => value,
  editing: false,
  select: false,
  value: ''
}

export default Editable
