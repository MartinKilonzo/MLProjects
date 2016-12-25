import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class LinkComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: props.link
    }
  }
  componentDidMount = () => {
    this.enter();
  }
  componentWillLeave = (callback) => {
    this.exit();
  }
  enter = () => {
    this.d3Node = this.d3Node || d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.link).attr('d', link => {
      return this.diagonal({source: link.source.source, target: link.source.source})
    }).transition().duration(this.props.duration).attr('d', this.diagonal(this.props.link));
  }
  exit = () => {
    this.d3Node = this.d3Node || d3.select(ReactDOM.findDOMNode(this));
    this.d3Node.datum(this.props.link).transition().duration(this.props.duration).attr('d', link => {
      console.log(link.source.source)
      return this.diagonal({source: link.source.source, target: link.source.source});
    });
  }
  diagonal = d3.svg.diagonal().projection(node => {
    return [node.y, node.x];
  })
  render() {
    return (
      <path className="link" style={this.props.style}></path>
    );
  }
}

export default LinkComponent;
