import React from 'react';
import DecisionTree from '../../assets/DecisionTree2.jsx'

class IrisClassifierView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <DecisionTree {...this.props}></DecisionTree>
    );
  }
}

IrisClassifierView.defaultProps = {};

export default IrisClassifierView;
