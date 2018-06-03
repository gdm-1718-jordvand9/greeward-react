import React, { Component } from 'react';
/*
Styles
*/
import './FormInput.css';

class FormInput extends Component {
  render() {
    const { value, type, placeholder, input, meta: { error, touched }, ...other } = this.props;
    return (
      <div className="form-input">
        <input type={type} placeholder={placeholder} className="col-12" {...input} autoComplete="off" value={value} />
        {error && touched &&
          <span className="pl-4">{error}</span>}
      </div>
    );
  }
}

export default FormInput;