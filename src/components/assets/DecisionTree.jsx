import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import Paper from 'material-ui/Paper';
import d3 from 'd3';

import DecisionNode from './DecisionNode.jsx';
import Link from './Link.jsx';

import dataFile from 'json!./data.json';
let i = 0;
class DecisionTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: props.duration, //TODO: Remove from state if not being changed
      height: props.height,
      width: props.width,
      root: dataFile, // TODO: Replace this with XHRreq func
      tree: d3.layout.tree().size([props.height, props.width])
    };
  }
  componentWillMount = () => {
    this.state.root.x0 = this.state.height /2;
    this.state.root.y0 = 0;
    this.updateTree();
    // const margin = {
    //   top: 20,
    //   right: 40,
    //   bottom: 20,
    //   left: 40
    // };
    // const height = this.state.height - margin.top - margin.bottom;
    // const width = this.state.width - margin.right - margin.left;
    // let tree = d3.layout.tree().size([this.state.height, this.state.width]);
    // this.setState({tree: tree}, this.updateTree);

  }
  componentDidMount = () => {
    d3.select(ReactDOM.findDOMNode(this)).attr('width', this.state.width).attr('height', this.state.height)

    var zoom = d3.behavior.zoom().scaleExtent([1, 10]).on('zoom', () => {
      d3.select(this.refs.container).attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    })
    d3.select(this.refs.container).call(zoom)
  }
  updateTree = () => {
    let nodes = this.state.tree.nodes(this.state.root).reverse();
    // Spread out nodes evently.
    let maxDepth = -1;
    nodes.forEach(node => {
      if (node.depth > maxDepth - 1) maxDepth = node.depth + 1;
    })
    nodes.forEach(node => {
      node.y = node.depth * (this.state.width / maxDepth);
    });
    nodes.forEach(node => {
      node.source = node.source || this.state.root;
    })
    let links = this.state.tree.links(nodes);
    // console.log(this.state);
    this.setState({nodes: nodes, links: links}, () => {
      // console.log(this.state);
    });

    // let svg = d3.select(ReactDOM.findDOMNode(this)).select('svg');
    // let id = 0;

    //Find all entering nodes
    // console.log(updatedNodes);
    // let enteringNodes = [];
    // updatedNodes.enter()[0].update.forEach(node => {
    //   enteringNodes.push(node.__data__);
    // });
    //Find all entering links
    // let updatedLinks = svg.selectAll('path.link').data(links, l => {
    //   return l.target.id;
    // });
    // let enteringLinks = [];
    // updatedLinks.enter()[0].update.forEach(link => {
    //   enteringLinks.push(link.__data__);
    // });
  }
  toggleCollapse = node => {
    console.log(node)
    if (node.children) {
      this.setSource(node, node)
      // Collapse all children, and their children
      node._children = node.children;
      // node.children.forEach(this.toggleCollapse); //TODO: create sub-function to toggle collapse of children
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }
    this.updateTree();
  }
  setSource = (node, source) => {
    if (node.children)
      node.children.forEach(n => this.setSource(n, source));
    node.source = source;
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
    console.log(this.state)
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
