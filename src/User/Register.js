import React, {Component} from "react";
import {Layout, Form, Input, Tooltip, Icon, Row, Col, Button, Checkbox} from "antd";
import axios from "axios";
import {Link} from "react-router-dom";
import * as actions from "../Store/actions/auth";
import {connect} from 'react-redux';
import Title from "antd/lib/typography/Title";

const FormItem = Form.Item;

class Register extends Component {
    state = {
        confirmDirty: false,
        emailValidateStatus: "",
        emailError: "",
        usernameError: "",
        passwordError: "",
    };

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };


    validateToNextPassword = async (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], {force: true});
        }
        await axios.get(
            'api/account/user_password/validate/' + value)
            .then(res => {
                this.setState({
                    passwordError: res.data.data[0],
                });
            }).catch(e => {
                this.setState({
                    passwordError: null
                })
            });
        if (this.state.passwordError) {
            callback(this.state.passwordError);
        } else {
            callback();
        }
    };


    validateToUsername = async (rule, value, callback) => {
        await axios.get('api/account/user_name/validate/' + value)
            .then(response => {
                if (value === response.data.username) {
                    this.setState({
                        usernameError: "This username has been registered!",
                    });
                }
            }).catch(err => {
                this.setState({
                    usernameError: null
                });
            });
        if (this.state.usernameError) {
            callback(this.state.usernameError);
        } else {
            callback();
        }
    };


    validateToEmail = async (rule, value, callback) => {
        await axios.get('api/account/user_email/validate/' + value)
            .then(response => {
                if (value === response.data.email) {
                    this.setState({
                        emailError: "This email address has been registered!",
                    });
                }
            }).catch(err => {
                this.setState({
                    emailError: null
                });
            });
        if (this.state.emailError) {
            callback(this.state.emailError);
        } else {
            callback();
        }
    };

    Auth = async v => {
        try {
            this.props.signup(v.username, v.email, v.password, v.confirm);
            if (this.state.token !== null) {
                this.props.history.replace("/article");
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.Auth(values);
            }
        });
    };

    render() {

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        return (
            <Layout style={{minHeight: "100vh", padding: '60px 0', backgroundColor: "#deb994"}}>
                <Row>
                    <Col
                        xxl={{span: 13, offset: 5}}
                        xl={{span: 18, offset: 3}}
                        lg={{span: 22, offset: 1}}
                        md={{span: 22, offset: 1}}
                        sm={{span: 22, offset: 1}}
                        xs={{span: 22, offset: 1}}
                    >
                        <div style={{
                            background: 'white',
                            border: "0px none #1C6EA4",
                            borderRadius: "10px",
                            WebkitBoxShadow: "4px 3px 12px 5px rgba(0,0,0,0.32)",
                            boxShadow: "4px 3px 12px 5px rgba(0,0,0,0.32)"
                        }}>
                            <Row>
                                <Col xxl={{span: 14}}
                                     xl={{span: 14}}
                                     lg={{span: 14}}
                                     md={{span: 12}}
                                     sm={{span: 24}}>
                                    <div style={{padding: '50px 50px'}}>
                                        <Title level={1} style={{
                                            color: "#ff823f",
                                            fontFamily: '"Comic Sans MS", cursive, sans-serif',
                                            letterSpacing: "0.6px",
                                            wordSpacing: "-3.4px",
                                            fontWeight: "700",
                                        }}>Mlinked is here!</Title>
                                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign='left'
                                              layout='vertical'>
                                            <FormItem
                                                hasFeedback
                                                label={
                                                    <span>
                                            Username&nbsp;
                                                        <Tooltip title="Who are you">
                                                 <Icon type="question-circle-o"/>
                                             </Tooltip>
                                        </span>}>
                                                {getFieldDecorator("username", {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "Please input your username!",
                                                            whitespace: true
                                                        },
                                                        {
                                                            validator: this.validateToUsername
                                                        }
                                                    ]
                                                })(<Input/>)}
                                            </FormItem>
                                            <FormItem label="E-mail" hasFeedback>
                                                {getFieldDecorator("email", {
                                                    rules: [
                                                        {
                                                            type: "email",
                                                            message: "The input is not valid E-mail!"
                                                        },
                                                        {
                                                            required: true,
                                                            message: "Please input your E-mail!"
                                                        },
                                                        {
                                                            validator: this.validateToEmail
                                                        }
                                                    ]
                                                })(<Input/>)}
                                            </FormItem>
                                            <FormItem label="Password" hasFeedback>
                                                {getFieldDecorator("password", {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "Please input your password!"
                                                        },
                                                        {
                                                            validator: this.validateToNextPassword
                                                        }
                                                    ]
                                                })(<Input.Password/>)}
                                            </FormItem>
                                            <FormItem label="Confirm Password" hasFeedback>
                                                {getFieldDecorator("confirm", {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "Please confirm your password!"
                                                        },
                                                        {
                                                            validator: this.compareToFirstPassword,
                                                        }
                                                    ]
                                                })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                                            </FormItem>
                                            <FormItem {...tailFormItemLayout}>
                                                {getFieldDecorator("agreement", {
                                                    valuePropName: "checked"
                                                })(
                                                    <Checkbox>
                                                        I have read the <Link to="agreement">agreement</Link>
                                                    </Checkbox>
                                                )}
                                            </FormItem>
                                            <FormItem {...tailFormItemLayout}>
                                                <Button type="primary" htmlType="submit">
                                                    Register
                                                </Button>
                                            </FormItem>
                                        </Form>
                                    </div>
                                </Col>
                                <Col xxl={{span: 10}}
                                     xl={{span: 10}}
                                     lg={{span: 10}}
                                     md={{span: 12}}
                                     sm={{span: 24}}
                                     xs={{span: 0}}>
                                    <img style={{
                                        width: "100%",
                                        position: "relative",
                                        height: "auto",
                                        borderRadius: "10px",
                                    }}
                                         alt={"login"}
                                         src={"https://design4users.com/wp-content/uploads/2018/03/stranger-things-poster-art-design.jpg"}/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Layout>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signup: (username, email, password1, password2) =>
            dispatch(actions.authSignup(username, email, password1, password2)),
    }
};

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        loading: state.auth.loading,
        error: state.auth.error,
        errorMsg: state.auth.errorMsg,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Register));
