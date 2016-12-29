import React from 'react';
import ReactDOM from 'react-dom';
import DecisionTree from '../../assets/DecisionTree.jsx'
import Paper from 'material-ui/Paper';

import dataFile from 'json!./data.json';

class IrisClassifierView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.toJSONTree(dataFile)
    };
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.updateWidth);
    this.updateWidth();
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWidth);
  }
  toJSONTree = x => {
    var result = {};
    result.name = x.rule;

    if ((!!x.left && !x.left.value) || (!!x.right && !x.right.value))
      result.children = [];
    else
      result.size = parseInt(x.samples);

    var index = 0;
    if (!!x.left && !x.left.value)
      result.children[index++] = this.toJSONTree(x.left);

    if (!!x.right && !x.right.value)
      result.children[index++] = this.toJSONTree(x.right);

    return result;
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
        <DecisionTree {...this.props} width={this.state.width} data={this.state.data}></DecisionTree>
      </Paper>
    );
  }
}

IrisClassifierView.defaultProps = {};

export default IrisClassifierView;
