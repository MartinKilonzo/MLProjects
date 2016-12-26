import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import Paper from 'material-ui/Paper';

import dataFile from 'json!./data.json';

let nodeIds = 0;

class DecisionTreeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: props.duration,
      height: props.height,
      width: props.width,
      root: dataFile,
      tree: d3.layout.tree().size([props.height, props.width])
    };
  }
  componentDidMount = () => {
    // Initialize the SVG object
    const thisDomNode = ReactDOM.findDOMNode(this);
    const margin = {
      top: 20,
      right: 40,
      bottom: 20,
      left: 40
    };
    const svg = d3.select(thisDomNode).append('svg').attr('width', this.state.width).attr('height', this.state.height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Initialize the nodes with d3 values
    this.state.tree.nodes(this.state.root);

    // Save the maxDepth and SVG
    this.setState({
      maxDepth: this.getMaxDepth(this.state.root),
      svg: svg
    }, () => {
      console.debug(this.state.maxDepth);
      // d3.select(thisDomNode).attr('width', this.state.width).attr('height', this.state.height);
      // // Set zoom behaviour
      // var zoom = d3.behavior.zoom().scaleExtent([1, 10]).on('zoom', () => {
      //   d3.select(this.refs.container).attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      // })
      // d3.select(this.refs.container).call(zoom);
      // Initialize the root starting location and collapse each child
      this.state.root.x0 = this.state.height / 2;
      this.state.root.y0 = 0;
      this.state.root.children.forEach(this.collapseDescendents);
      this.updateTree(this.state.root);
    })
  }
  updateTree = (source) => {
    let nodes = this.state.tree.nodes(this.state.root).reverse();
    let links = this.state.tree.links(nodes);
    this.updateNodes(nodes, source);
    this.updateLinks(links, source);
    // Stash the old positions for transition.
    nodes.forEach(node => {
      node.x0 = node.x;
      node.y0 = node.y;
    });
  }
  updateNodes = (nodes, source) => {
    // Spread out nodes evently
    nodes.forEach(node => {
      node.y = node.depth * (this.state.width / this.state.maxDepth);
    });

    let svgNodes = this.state.svg.selectAll('g.node')
      .data(nodes, node => {
        return node.id || (node.id = ++nodeIds);
      });

    let nodeEnter = svgNodes.enter().append('g').attr('class', 'node').attr('transform', (node) => {
      return `translate(${source.y0}, ${source.x0})`;
    }).on('click', this.toggleCollapse);

    nodeEnter.append('circle').attr('r', 1e-6).style('fill', node => {
      return node._children
        ? 'lightsteelblue'
        : '#fff';
    });
    nodeEnter.append('text').attr('x', node => {
      return node.children || node._children
        ? -10
        : 10;
    }).attr('dy', '.35em').attr('text-anchor', node => {
      return node.children || node._children
        ? 'end'
        : 'start';
    }).text(node => {
      return node.name;
    }).style('fill-opacity', 1e-6);
    let nodeUpdate = svgNodes.transition().duration(this.state.duration).attr('transform', node => {
      return `translate(${node.y}, ${node.x})`;
    });

    nodeUpdate.select('circle').attr('r', 4.5).style('fill', node => {
      return node._children
        ? 'lightsteelblue'
        : '#fff';
    });

    nodeUpdate.select('text').style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    let nodeExit = svgNodes.exit().transition().duration(this.state.duration).attr('transform', (node) => {
      return `translate(${source.y},${source.x})`;
    }).remove();

    nodeExit.select('circle').attr('r', 1e-6);

    nodeExit.select('text').style('fill-opacity', 1e-6);
  }
  updateLinks = (links, source) => {
    // Update the links…
    let svgLinks = this.state.svg.selectAll('path.link').data(links, link => {
      return link.target.id;
    });

    // Enter any new links at the parent's previous position.
    svgLinks.enter().insert('path', 'g').attr('class', 'link').attr('d', (link) => {
      console.debug('enter', link, source)
      let node = {
        x: source.x0,
        y: source.y0
      };
      return this.diagonal({source: node, target: node});
    });

    // Transition links to their new position.
    svgLinks.transition().duration(this.state.duration).attr('d', this.diagonal);

    // Transition exiting nodes to the parent's new position.
    svgLinks.exit().transition().duration(this.state.duration).attr('d', (link) => {
      console.debug('exit', link, source)
      var node = {
        x: source.x,
        y: source.y
      };
      return this.diagonal({source: node, target: node});
    }).remove();
  }
  toggleCollapse = source => {
    if (source.children) {
      source._children = source.children;
      source.children = null;
    } else {
      source.children = source._children;
      source._children = null;
    }
    this.updateTree(source);
  }
  collapseDescendents = node => {
    if (node.children) {
      node._children = node.children;
      node.children.forEach(this.collapseDescendents);
      node.children = null;
    }
  }
  diagonal = d3.svg.diagonal().projection(node => {
    return [node.y, node.x];
  })
  getMaxDepth = (node) => {
    if (!node.children) {
      return node.depth;
    }
    let maxDepth = 0;
    for (var child of node.children) {
      let m = this.getMaxDepth(child);
      if (m > maxDepth)
        maxDepth = m;
      }
      return maxDepth;
  }
  render() {
    const styles = {
      wrapper: {
        margin: '5% 10% 5% 10%',
        overflowX: 'hidden'
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
      <Paper style={styles.wrapper}></Paper>
    );
  }
}

DecisionTreeComponent.defaultProps = {
  duration: 750,
  height: 1000,
  width: 960
};

export default DecisionTreeComponent;
