import React from 'react';
import ReactDOM from 'react-dom';
import DecisionTree from '../../assets/DecisionTree.jsx'
import Paper from 'material-ui/Paper';

import dataFile from 'json!./data.json';

class IrisClassifierView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount = () => {}
  componentDidMount = () => {
    window.addEventListener('resize', this.updateWidth);
    this.updateWidth();
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWidth);
  }
  updateWidth = () => {
    const DOMNode = ReactDOM.findDOMNode(this);
    this.setState({
      width: DOMNode.offsetWidth
    }, () => {
      window.dispatchEvent(new CustomEvent('resizeTree', {
        detail: {
          height: DOMNode.offsetHeight,
          width: DOMNode.offsetWidth
        }
      }));
    });
  }
  render() {
    const styles = {
      wrapper: {
        margin: '5% 10% 5% 10%',
        overflowX: 'hidden'
      }
    };
    return (
      <Paper style={styles.wrapper}>
        <DecisionTree {...this.props} width={this.state.width} data={dataFile}></DecisionTree>
      </Paper>
    );
  }
}

IrisClassifierView.defaultProps = {};

export default IrisClassifierView;
