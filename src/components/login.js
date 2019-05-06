import React, {Component} from 'react'
import {connect} from 'react-redux'
import {login} from '../store'
import {Link, withRouter} from 'react-router-dom'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidUpdate() {
    if (this.props.user && this.props.user.id) {
      this.props.history.push('/profile')
    }
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      const formName = event.target.name
      const email = event.target.email.value
      const password = event.target.password.value
      await this.props.login(email, password, formName)
      if (this.props.user.id) {
        this.props.history.push('/Preference')
      }
    } catch (error) {
      this.setState({
        error
      })
    }
  }
  render() {
    const {error} = this.props
    return (
      <div className="login">
        <h1 className="login__title">Foody</h1>
        {error && error.response && <div> {error.response.data} </div>}
        <form className="login__form" name="login" onSubmit={this.handleSubmit}>
          <input
            className="login__input"
            name="email"
            type="text"
            placeholder="Email"
          />
          <input
            className="login__input"
            name="password"
            type="password"
            placeholder="Password"
          />
          <Link className="login__option" to="/forgotpw">
            Forgot password?
          </Link>
          <button className="login__button" type="submit">
            Log In
          </button>
        </form>
        <div className="login__divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <form method="get" action="http://localhost:3001/auth/google">
          <button className="login__oauth" type="submit">
            <i className="login__oauth__logo fab fa-google" />
            <p className="login__oauth__text">Log In With Google</p>
          </button>
        </form>
        <div className="login__footer">
          <p>
            Don't have an account?{' '}
            <Link className="login__footer__link" to="/signup">
              Sign Up.
            </Link>
          </p>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    error: state.user.error,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    login: (email, password, formName) =>
      dispatch(login(email, password, formName))
  }
}

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Login)
)
