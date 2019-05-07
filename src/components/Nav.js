import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../store'

class Nav extends Component {
  constructor(props) {
    super(props)
    this.handleLogOut = this.handleLogOut.bind(this)
  }
  handleLogOut() {
    this.props.logout()
    this.props.history.push('/')
  }

  render() {
    return (
      <header className="header">
        <div />
        <h1 className="header__title">Foody</h1>
        <button
          className="logout"
          type="button"
          onClick={() => this.handleLogOut()}
        >
          <i className="fas fa-cog" />
        </button>
      </header>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Nav)
)
