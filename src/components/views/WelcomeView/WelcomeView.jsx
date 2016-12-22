import React from 'react';

class WelcomeViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return (
      <h3>Welcome</h3>
    );
  }
}

WelcomeViewComponent.defaultProps = {};

export default WelcomeViewComponent;
