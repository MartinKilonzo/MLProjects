import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class DecisionNodeComponenent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      node: props.node
    };
  }
  componentDidMount = () => {
    this.enter();
  }
  componentWillUnmount = () => {
    this.exit();
  }
  enter = () => {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.node).attr('transform', node => {
      if (typeof node.parent == 'undefined')
        return `translate(${this.props.height / 2}, ${ 0})`;
      else
        return `translate(${node.parent.y}, ${node.parent.x})`;
      }
    ).transition().duration(this.props.duration).attr('transform', node => {
      return `translate(${node.y}, ${node.x})`;
    })
    // TODO: Fade in opacity from 1e-6 to 1 for text on enter
  }
  exit = () => {
    this.d3Node = d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.node).attr('transform', node => {
      return `translate(${node.y}, ${node.x})`;
      }
    ).transition().duration(this.props.duration).attr('transform', node => {
      if (typeof node.parent == 'undefined')
        return `translate(${this.props.height / 2}, ${ 0})`;
      else
        return `translate(${node.parent.y}, ${node.parent.x})`;
    })
    // TODO: Fade in opacity from 1e-6 to 1 for text on enter
  }
  handleClick = () => {
    this.props.onCollapse(this.state.node);
  }
  render() {
    const styles = {
      wrapper: {
        alignmentBaseline: 'top',
        height: '20px',
        width: '50px',
        fill: 'red'
      },
      node: {
        interior: {
          fill: '#fff',
          stroke: 'lightsteelblue',
          strokeWidth: '1.5px',
          cursor: 'pointer'
        },
        leaf: {
          fill: '#fff',
          stroke: 'lightsteelblue',
          strokeWidth: '1.5px',
          cursor: 'pointer'
        }
      },
      text: {
        interior: {
          alignmentBaseline: 'middle',
          textAnchor: 'end',
          fill: 'black',
          font: '10px sans-serif'
        },
        leaf: {
          alignmentBaseline: 'middle',
          textAnchor: 'start',
          fill: 'black',
          font: '10px sans-serif'
        }
      }
    };
    const hasChildren = this.props.node.children || this.props.node._children ? true : false;
    const circleStyle = hasChildren
      ? styles.node.interior
      : styles.node.leaf;
    const textStyle = hasChildren
      ? styles.text.interior
      : styles.text.leaf;
    const radius = hasChildren ? 4.5 : 1e-06;
    const xOffset = hasChildren ? -10 : 5;
    return (
      <g className="node" onClick={this.handleClick}>
        <circle style={circleStyle} r={radius}></circle>
        <text style={textStyle} x={xOffset}>{this.props.node.name}</text>
      </g>
    );
  }
}

DecisionNodeComponenent.defaultProps = {};

export default DecisionNodeComponenent;
