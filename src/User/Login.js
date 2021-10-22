import React from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Checkbox, Layout, Row, Col, message } from 'antd'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Title from 'antd/lib/typography/Title'
import { authStart } from '../Store/actions/auth'
import { authSuccess } from '../Store/actions/auth'
import { checkAuthTimeout } from '../Store/actions/auth'
import { authFail } from '../Store/actions/auth'

class LoginForm extends React.Component {
  state = { usernameError: null }

  checkUsername = async (e) => {
    const username = e.target.value
    if (username) {
      await axios
        .get('api/account/user_name/validate/' + username)
        .then((res) => {
          if (res.data.data === 'Username is exists') {
            this.setState({ usernameError: 'Password is incorrect' })
          }
          if (res.data.data === 'null') {
            this.setState({ usernameError: 'The username is not exist!' })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.authStart()
        axios
          .post('rest-auth/login/', {
            username: values.username,
            password: values.password,
          })
          .then((res) => {
            const token = res.data.key
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000)

            localStorage.setItem('token', token)
            localStorage.setItem('expirationDate', expirationDate)

            this.props.authSuccess(token)
            this.props.checkAuthTimeout(3600)

            message.success('Welcome Back ' + values.username + '!')
            if (values.username === 'admin') {
              this.props.history.replace('/admin_mlinked')
            } else {
              this.props.history.replace({ pathname: '/article', state: { token: token } })
            }
          })
          .catch((err) => {
            this.props.authFail(err, err.response.data)
            message.error(this.state.usernameError)
          })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Layout style={{ minHeight: '100vh', padding: '60px 0', backgroundColor: '#deb994' }}>
        <Row>
          <Col
            xxl={{ span: 12, offset: 6 }}
            xl={{ span: 16, offset: 4 }}
            lg={{ span: 18, offset: 3 }}
            md={{ span: 22, offset: 1 }}
            sm={{ span: 22, offset: 1 }}
            xs={{ span: 22, offset: 1 }}
          >
            <div
              style={{
                background: 'white',
                border: '0px none #1C6EA4',
                borderRadius: '10px',
                WebkitBoxShadow: '4px 3px 12px 5px rgba(0,0,0,0.32)',
                boxShadow: '4px 3px 12px 5px rgba(0,0,0,0.32)',
              }}
            >
              <Row>
                <Col
                  xxl={{ span: 10 }}
                  xl={{ span: 10 }}
                  lg={{ span: 10 }}
                  md={{ span: 11 }}
                  sm={{ span: 24 }}
                  xs={{ span: 0 }}
                >
                  <img
                    style={{
                      width: '100%',
                      position: 'relative',
                      height: 'auto',
                      borderRadius: '10px',
                    }}
                    alt={'login'}
                    src={'https://design4users.com/wp-content/uploads/2018/03/stranger-things-poster-art-design.jpg'}
                  />
                </Col>
                <Col xxl={{ span: 14 }} xl={{ span: 14 }} lg={{ span: 14 }} md={{ span: 13 }} sm={{ span: 24 }}>
                  <div style={{ padding: '50px 50px' }}>
                    <Title
                      level={1}
                      style={{
                        color: '#ff823f',
                        fontFamily: '"Comic Sans MS", cursive, sans-serif',
                        letterSpacing: '0.6px',
                        wordSpacing: '-3.4px',
                        fontWeight: '700',
                      }}
                    >
                      Mlinked
                    </Title>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                      <Form.Item>
                        {getFieldDecorator('username', {
                          rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                          <Input
                            autoComplete="on"
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                            onChange={this.checkUsername}
                          />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('password', {
                          rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                          <Input
                            autoComplete="on"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                          />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('remember', {
                          valuePropName: 'checked',
                          initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <a className="login-form-forgot" href="/">
                          Forgot password
                        </a>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          style={{ width: '100%' }}
                        >
                          Log in
                        </Button>
                        <Link to={'/signup'}>Register</Link>
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Layout>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authStart: () => dispatch(authStart()),
    authSuccess: (token) => dispatch(authSuccess(token)),
    checkAuthTimeout: (expirationTime) => dispatch(checkAuthTimeout(expirationTime)),
    authFail: (err, data) => dispatch(authFail(err, data)),
  }
}

export default connect(null, mapDispatchToProps)(Form.create()(LoginForm))
