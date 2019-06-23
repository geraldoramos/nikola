import React, { Component } from 'react'
import { Modal } from 'antd'

class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(e) {
    this.setState({ input: e.target.value })
  }

  render() {
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={() => this.props.onOk(this.state.input)}
        onCancel={this.props.onCancel}
        cancelButtonProps={{ type: 'ghost' }}
      >
        <div
          className={!this.props.errorMessage ? 'modal-info' : 'modal-error'}
        >
          {!this.props.errorMessage ? this.props.info : this.props.errorMessage}
        </div>
        <div className="form-group">
          <input
            onChange={this.handleChange}
            value={this.state.input}
            required
            type={this.props.formType}
            className="form-control"
            placeholder={this.props.placeholder}
          />
        </div>
      </Modal>
    )
  }
}
export default Popup
