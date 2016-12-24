import 'normalize.css/normalize.css';
import 'styles/App.css';

import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import fade from 'material-ui/utils/color'
import {
  deepPurpleA200,
  grey100,
  grey300,
  grey400,
  grey500,
  tealA200,
  tealA400,
  white,
  darkBlack,
  fullBlack
} from 'material-ui/styles/colors';

import Nav from './Nav.jsx';

const lightTheme = {
  palette: {
    primary1Color: tealA400,
    primary2Color: tealA200,
    primary3Color: grey400,
    accent1Color: deepPurpleA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: tealA200,
    shadowColor: fullBlack
  },
  appBar: {
    height: 50
  }
};

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentWillMount = () => injectTapEventPlugin();
  render() {
    console.log(this.props);
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightTheme)}>
        <div>
          <Nav {...this.props}></Nav>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
