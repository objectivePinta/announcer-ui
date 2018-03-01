import React, {Component, PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';
import * as styles from '../../styles/common/form-components/textInput.dino.css'
class TextInput extends Component {

  constructor(props) {
    super(props);
    this.lessThanMinSize = this.lessThanMinSize.bind(this);
    this.numberValidation = this.numberValidation.bind(this);
    this.isValid = this.isValid.bind(this);
    this.state = {valid: false};
  }

  lessThanMinSize() {
    if (this.props.inputValue && (this.props.inputValue.length < this.props.minSize)) {
      return false;
    }
    return true;
  }

  numberValidation() {
    if (this.props.inputValue) {
      if (this.props.allowNumbers) {
        return true;
      } else {
        const matches = this.props.inputValue.match(/\d+/g);
        if (matches != null) {
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }

  isValid() {
    if (!this.props.inputValue) {
      this.props.validate(this.props.id, false);
      return true;
    } else {
      this.props.validate(this.props.id, (this.numberValidation() && this.lessThanMinSize()));
      return this.numberValidation() && this.lessThanMinSize();
    }

  }



  render() {

    const validIcon = this.props.inputValue?
      (this.isValid() ? <Glyphicon glyph="ok" style={{color:'green'}}/>
        : <Glyphicon glyph="remove" style={{color:'red'}} />)
      :
      <Glyphicon glyph="heart" style={{color:'red'}} /> ;

    return (
      <div className={this.props.inheritedClass}>
        <label htmlFor={this.props.id}>{`${this.props.id.toUpperCase()}`}</label>
        <input width={this.props.id.length}
               placeholder={this.props.id}
               className="field-long"
               id={this.props.id}
               type={this.props.type}
               value={this.props.inputValue}
               onChange={this.props.textChanged}
        /> {validIcon}
        {!this.isValid() && <p className="alert-success">
          {!this.lessThanMinSize() &&
          'Too few characters. Try to think at something.'}

          {!this.lessThanMinSize() && !this.numberValidation() &&
          <span style={{fontWeight: 'bold', color: 'blue'}}> And in the 2nd place: </span>}
          {!this.numberValidation() &&
          'No numbers allowed here, math fanatic!'}
        </p>
        }
      </div>
    );
  }
}

TextInput.propTypes = {
  textChanged: PropTypes.func,
  inputValue: PropTypes.string,
  minSize: PropTypes.number,
  allowNumbers: PropTypes.bool,
  validate: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.string
};

export default TextInput;
