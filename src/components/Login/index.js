import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMessage: false}

  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jwtToken = await data.jwt_token
      console.log(jwtToken)
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      this.setState({showErrorMessage: false, errorMessage: ''})
      const {history} = this.props
      history.replace('/')
    } else {
      const data = await response.json()
      this.setState({showErrorMessage: true, errorMessage: data.error_msg})
    }
  }

  onUsernameChange = event => this.setState({username: event.target.value})

  onPasswordChange = event => this.setState({password: event.target.value})

  render() {
    const {username, password, showErrorMessage, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-card-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.onFormSubmit}>
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.onUsernameChange}
              placeholder="Username"
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={this.onPasswordChange}
              placeholder="Password"
            />
            <button type="submit">Login</button>
            {showErrorMessage && <p className="error-msg">* {errorMessage}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
