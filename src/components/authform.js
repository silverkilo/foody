import React, {Component} from 'react'
import {connect} from 'react-redux'
import {auth, login, logout} from '../store'

class AuthForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'login',
      displayName: 'Login',
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
  }
  handleLogOut() {
    this.setState({
      name: 'login',
      displayName: 'Login'
    })
    this.props.logout()
  }
  handleClick() {
    if (this.state.name === 'login') {
      this.setState({
        name: 'signup',
        displayName: 'Signup'
      })
    } else {
      this.setState({
        name: 'login',
        displayName: 'Login'
      })
    }
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      const formName = event.target.name
      const email = event.target.email.value
      const password = event.target.password.value
      if (this.state.name === 'signup') {
        const firstName = event.target.firstName.value
        const lastName = event.target.lastName.value
        await this.props.auth(firstName, lastName, email, password, formName)
      } else {
        await this.props.login(email, password, formName)
      }
    } catch (error) {
      this.setState({
        error
      })
    }
  }
  render() {
    return (
      <div>
        <form name={this.state.name} onSubmit={this.handleSubmit}>
          {this.state.name === 'signup' ? (
            <React.Fragment>
              <input name="firstName" type="text" placeholder="First Name" />
              <input name="lastName" type="text" placeholder="Last Name" />
              <input name="email" type="text" placeholder="Email" />
              <input name="password" type="password" placeholder="Password" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input name="email" type="text" placeholder="Email" />
              <input name="password" type="password" placeholder="Password" />
            </React.Fragment>
          )}
          <button type="submit">{this.state.displayName}</button>
        </form>
        {this.state.name === 'signup' ? (
          <a onClick={() => this.handleClick()}>
            Already registered? Log In Here!
          </a>
        ) : (
          <a onClick={() => this.handleClick()}>
            Not signed up? Register Here!
          </a>
        )}
        <button type="button" onClick={() => this.handleLogOut()}>
          Log Out
        </button>
      </div>
    )
  }
}

const mapState = state => {
  return {
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    auth: (firstName, lastName, email, password, formName) =>
      dispatch(auth(firstName, lastName, email, password, formName)),
    login: (email, password, formName) =>
      dispatch(login(email, password, formName)),
    logout: () => dispatch(logout())
  }
}

export default connect(
  mapState,
  mapDispatch
)(AuthForm)
