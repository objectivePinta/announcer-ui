import React, {Component,PropTypes} from 'react';

class PrintObject extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const objectInParagraphs = Object.keys(this.props.givenObject).map(key => {

      return (<p key={key}>
        <span style={{color:'red'}}> {key}</span>:<span style={{color:'blue'}}>
        {this.props.givenObject[key]}</span></p>);
      }
    );

    return (
      <div style={{border:'1px solid', padding:'10px', margin:'2px'}}>
        <h6>### just for debug</h6>
        {objectInParagraphs}
      </div>
    );
  }

}

PrintObject.propTypes = {
  givenObject: PropTypes.object
};

export default PrintObject;
