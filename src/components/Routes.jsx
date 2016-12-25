import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './views/App.jsx';
import WelcomeView from './views/WelcomeView/WelcomeView.jsx';
import IrisClassifierView from './views/IrisClassifierView/IrisClassifierView.jsx';


class RouterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={WelcomeView}></IndexRoute>
          <Route path="IrisClassifier" component={IrisClassifierView}></Route>
        </Route>
      </Router>
    );
  }
}

RouterComponent.defaultProps = {};

export default RouterComponent;
