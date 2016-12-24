import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import {browserHistory} from 'react-router';

import colors from '../assets/colors.jsx'

class NavComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      view: props.view,
      title: 'ML Projects'
    };
  }
  handleToggle = () => this.setState({
    open: !this.state.open
  });
  handleClose = (view) => {
    browserHistory.push(view);
    console.log(this.formatLabel(view))
    this.setState({open: false, title: this.formatLabel(view)});
  }
  handleTitleAction = () => {
    browserHistory.push('/');
  }
  formatLabel = (path) => {
    let label = '';
    let last = '';
    for (var char of path) {
      if (char == char.toUpperCase() && last != last.toUpperCase()) label += ' ';
      label += char;
      last = char;
    }
    return label;
  }
  render() {
    const currentRoute = this.props.location.pathname.split('/')[0];
    const styles = {
      appbar: {
      },
      title: {
        textAlign: 'center',
        textTransform: 'uppercase'
      },
      iconStyleLeft: {
      }
    };
    return (
      <div>
        <div>
          <AppBar style={styles.appbar} titleStyle={styles.title} title={this.state.title} onTitleTouchTap={this.handleTitleAction}
            iconStyleLeft={styles.iconStyleLeft} iconClassNameRight="muidocs-icon-navigation-expand-more" onLeftIconButtonTouchTap={this.handleToggle}></AppBar>
          <Drawer docked={false} width={250} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
            {this.props.route.childRoutes.map((route, key) => {
              const path = route.path;
              return <RaisedButton key={key} label={this.formatLabel(path)} onTouchTap={this.handleClose.bind(this, path)} fullWidth primary={currentRoute === path}></RaisedButton>
            })}
          </Drawer>
        </div>
      </div>
    );
  }
}

NavComponent.defaultProps = {};

export default NavComponent;
