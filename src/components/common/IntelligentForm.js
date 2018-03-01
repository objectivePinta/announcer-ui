import React, {Component, PropTypes} from 'react';
import toastr from 'toastr';
import TextInput from './form-components/TextInput';
import PrintObject from '../utils/PrintObject';
import * as styles from '../styles/common/intelligentForm.dino.css';

class IntelligentForm extends Component {

  constructor(props) {
    super(props);
    let objectOfForm = {};
    let fieldsValidity = {};
    console.log(this.props.initialValues);
    Object.keys(this.props.object).map( key => {
      objectOfForm[key] = this.props.initialValues ? this.props.initialValues[key] : '';
      fieldsValidity[key] = false;
     return {objectOfForm,fieldsValidity};
    });
    this.state = {objectOfForm,
                  fieldsValidity,
                   valid: false };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.areAllValid = this.areAllValid.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
  }

  handleTextChange(event) {
    let copyOfObjectOfForm = Object.assign({},this.state.objectOfForm);
    copyOfObjectOfForm[event.target.id] = event.target.value;
    this.setState({objectOfForm:copyOfObjectOfForm});
    this.props.onFieldsChange(event.target.id, event.target.value);
  }

  buttonClick(event) {
    event.preventDefault();
    let keys = Object.keys(this.state.fieldsValidity);
    let trues = keys.map(t =>
    this.state.fieldsValidity[t]).filter(t => t === true);
    if (trues.length === keys.length ) {
      this.props.onSubmit(Object.assign({}, this.state.objectOfForm));
    } else {
      toastr.warning('You still have to fill some stuff around here :)');
    }
  }

  cancelClick(event) {
    event.preventDefault();
    this.props.onCancel();
  }

  areAllValid(id , valid) {
    this.state.fieldsValidity[id] = valid;
  }

  render() {
    const props = Object.keys(this.state.objectOfForm);
    const inputs = props.map(
      prop =>
      {
          return (<TextInput
            inheritedClass={styles.item}
            key={prop}
            type={this.props.object[prop].type}
            id={prop}
            inputValue={this.state.objectOfForm[prop]}
            textChanged={this.handleTextChange}
            minSize={this.props.object[prop].minSize}
            allowNumbers={this.props.object[prop].allowNumbers}
            validate={this.areAllValid}
          /> );
      }
    );

    return (
      <div className={styles.intelligentForm}>
          {inputs}
          <div id="buttons">
         <button onClick={this.buttonClick} className={`btn ${styles.item}`}> {this.props.submitCaption} </button>
        <button onClick={this.cancelClick} className={`btn ${styles.item}`}> {this.props.cancelCaption} </button>
          </div>
        {this.props.debug && <PrintObject givenObject={this.state.objectOfForm}/>}
      </div>
    );
  }

}

IntelligentForm.propTypes = {
  object: PropTypes.object,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  debug: PropTypes.bool,
  onFieldsChange: PropTypes.func,
};

export default IntelligentForm;
