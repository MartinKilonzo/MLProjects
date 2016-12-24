import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './views/App.jsx';
import WelcomeView from './views/WelcomeView/WelcomeView.jsx';
import IrisClassifierView from './views/IrisClassifierView/IrisClassifierView.jsx';
import IrisClassifierView2 from './views/IrisClassifierView/IrisClassifierView2.jsx';


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
          <Route path="IrisClassifier2" component={IrisClassifierView2}></Route>
        </Route>
      </Router>
    );
  }
}

RouterComponent.defaultProps = {};

export default RouterComponent;
