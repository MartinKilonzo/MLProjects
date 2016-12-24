import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import Paper from 'material-ui/Paper';
import d3 from 'd3';

import DecisionNode from './DecisionNode.jsx';
import Link from './Link.jsx';

import dataFile from 'json!./data.json';

class DecisionTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: props.duration, //TODO: Remove from state if not being changed
      height: props.height,
      width: props.width,
      root: dataFile // TODO: Replace this with XHRreq func
    };
    // this.state.root.x = this.state.height / 2;
    // this.state.root.y = 0;
  }
  componentWillMount = () => {
    const margin = {
      top: 20,
      right: 40,
      bottom: 20,
      left: 40
    };
    const height = this.state.height - margin.top - margin.bottom;
    const width = this.state.width - margin.right - margin.left;
    let tree = d3.layout.tree().size([this.state.height, this.state.width]);
    let nodes = tree.nodes(this.state.root);
    let links = tree.links(nodes);
    this.setState({tree: tree, nodes: nodes, links: links});
  }
  componentDidMount = () => {
    d3.select(ReactDOM.findDOMNode(this)).attr('width', this.state.width).attr('height', this.state.height)

    var zoom = d3.behavior.zoom().scaleExtent([1, 10]).on('zoom', () => {
      d3.select(this.refs.container).attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    })
    d3.select(this.refs.container).call(zoom)
  }
  updateTree = (node) => {
    console.log(node);
    let nodes = this.state.tree.nodes(this.state.root).reverse();
    let links = this.state.tree.links(nodes);
    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    let svg = d3.select(ReactDOM.findDOMNode(this)).select('svg');
    let id = 0;

    //Find all entering nodes
    let updatedNodes = svg.selectAll('g.node').data(nodes, n => {
      return n.id || (n.id = id++);
    });

    //Find all entering links
    let updatedLinks = svg.selectAll('path.link').data(links, l => {
      console.log(l)
      return l.target.id;
    });

    console.log(this.state);
    this.setState({nodes: updatedNodes.enter()[0], links: updatedLinks.enter()[0]}, () => {
      console.log(this.state);
    });
  }
  toggleCollapse = (node) => {
    console.log(node)
    if (node.children) {
      // Collapse all children, and their children
      node._children = node.children;
      // node.children.forEach(this.toggleCollapse); //TODO: create sub-function to toggle collapse of children
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }
    this.updateTree(node);
  }
  render() {
    const margin = {
      top: 20,
      right: 40,
      bottom: 20,
      left: 40
    };
    const height = this.state.height - margin.top - margin.bottom;
    const width = this.state.width - margin.right - margin.left;
    const styles = {
      wrapper: {
        margin: '5% 10% 5% 10%',
        overflowX: 'hidden'
      },
      tree: {
        margin: `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`,
        height: height,
        width: width
      },
      node: {
        fill: '#fff',
        stroke: 'lightsteelblue',
        strokeWidth: '1.5px',
        cursor: 'pointer'
      },
      link: {
        fill: 'none',
        stroke: '#ccc',
        strokeWidth: '1.5px'
      }
    };
    return (
      <Paper style={styles.wrapper}>
        <svg style={styles.tree}>
          <g ref="container">
            {this.state.links.map((link, key) => {
              return <Link key={key} style={styles.link} link={link} duration={this.props.duration}></Link>
            })}
            {this.state.nodes.map((node, key) => {
              return <DecisionNode key={key} node={node} height={this.state.height} duration={this.props.duration} onCollapse={this.toggleCollapse}></DecisionNode>
            })}
          </g>
        </svg>
      </Paper>
    );
  }
}

DecisionTreeComponent.defaultProps = {
  duration: 750,
  height: 1000,
  width: 960
};

export default DecisionTreeComponent;
