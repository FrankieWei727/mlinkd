import React from 'react'
import {Layout, Menu, Avatar, Divider, Button, Dropdown, Icon, Row, Col, Drawer, List} from 'antd';
import {Link} from "react-router-dom";
import axios from "axios";
import * as actions from "../../Store/actions/auth";
import {connect} from "react-redux";

const {Header} = Layout;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_4halsqgparv.js',
});

class HomeHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
        };
    }

    state = {
        key: "",
        username: "",
        avatar: "",
        visible: false,
        deskDivWidth: document.body.clientWidth,
    };


    componentDidMount() {
        // 注册浏览器尺寸变化监听事件， 刷新桌面尺寸
        window.addEventListener('resize', this.handleSize());

    }

    componentWillUnmount() {
        // 移除监听事件
        window.removeEventListener('resize', this.handleSize());
    }

    // 自适应浏览器的高度
    handleSize = () => {
        this.setState({
            deskDivWidth: document.body.clientWidth,
        });
    };


    componentWillReceiveProps(nextProps) {
        if (nextProps.token !== null) {
            axios.get(
                'rest-auth/user/?format=json',
                {headers: {'Authorization': 'Token ' + nextProps.token}}
            ).then(res => {
                    this.setState({
                        username: res.data.username,
                        avatar: res.data.profile.avatar,
                    });
                }
            ).catch(err => {
                console.log(err)
            });
        }
    };

    onShowMenu = () => {
        this.setState({
            visible: true,
        })
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    onLogin = () => {
        this.setState({
            visible: false,
        });
    };
    onSignup = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const DropdownList = (
            <Menu className="drop-list">
                <Menu.Item key="4">
                    <Link to={'/profile'}>
                        <Icon type="user" style={{paddingRight: '3px'}}/>
                        Profile
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to={'/profile/setting'}>
                        <Icon type="setting" style={{paddingRight: '3px'}}/>
                        Setting
                    </Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link to={'/logout'} onClick={this.props.logout}>
                        <Icon type="logout" style={{paddingRight: '3px'}}/>
                        Logout
                    </Link>
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Header style={{
                    padding: "0 0",
                    position: 'fixed',
                    zIndex: 100,
                    width: '100%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(26,26,26,.1)',
                    borderColor: 'transparent transparent rgba(26,26,26,.1) transparent',
                }}>
                    <Row>
                        <Col xxl={{span: 17, offset: 3}}
                             xl={{span: 19, offset: 2}}
                             lg={{span: 19, offset: 2}}
                             md={{span: 21, offset: 1}}
                             sm={{span: 21, offset: 1}}
                             xs={{span: 22, offset: 0}}>
                            <div style={{
                                float: 'left',
                                paddingRight: (this.state.deskDivWidth > 650 ? "20px" : "0"),
                                paddingLeft: "10px"
                            }}>
                                <img alt="poster"
                                     src={(this.state.deskDivWidth > 650 ? 'https://i.imgur.com/pRMV4vy.png' : 'https://i.imgur.com/K44udDH.png')}
                                     style={{width: (this.state.deskDivWidth > 650 ? "120px" : "50px")}}/>
                            </div>
                            <div>
                                <Menu
                                    className="header-menu"
                                    theme="light"
                                    mode="horizontal"
                                >
                                    <Menu.Item style={{padding: (this.state.deskDivWidth > 650 ? null : "0 10px")}}
                                               key="Article">Blog
                                        <Link to={'/article'}/></Menu.Item>
                                    <Menu.Item style={{padding: (this.state.deskDivWidth > 650 ? null : "0 10px")}}
                                               key="Movie">Movie
                                        <Link to={'/movie'}/></Menu.Item>
                                    <Menu.Item style={{padding: (this.state.deskDivWidth > 650 ? null : "0 10px")}}
                                               key="Event">Event
                                        <Link to={'/event'}/></Menu.Item>
                                    <div style={{float: 'right'}}>
                                        {
                                            this.props.isAuthenticated ?
                                                <Dropdown overlay={DropdownList} placement="bottomCenter">
                                                    <div>
                                                        <Avatar shape="square" src={this.state.avatar}/>
                                                    </div>
                                                </Dropdown>
                                                :
                                                (window.innerWidth >= 500 ?
                                                        <div>
                                                            <Button type={"link"}>
                                                                <Link to={'/login'}>Log in</Link>
                                                            </Button>
                                                            <Divider type="vertical"/>
                                                            <Button type={"link"} style={{marginLeft: '0.5em'}}>
                                                                <Link to={'/signup'}>Sign Up</Link>
                                                            </Button>
                                                        </div>
                                                        :
                                                        <Button type="link" onClick={this.onShowMenu}>
                                                            <Icon type="bars"/>
                                                        </Button>
                                                )
                                        }
                                    </div>
                                </Menu>
                            </div>
                        </Col>
                    </Row>
                    <Drawer
                        height={92}
                        destroyonclos="true"
                        placement="bottom"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        bodyStyle={{padding: "0 0"}}
                    >
                        <List>
                            <List.Item style={{paddingLeft: "20px"}} key="login" onClick={this.onLogin}>
                                <Link to={'/login'}>
                                    <IconFont type="iconlog-in" style={{paddingRight: "10px"}}/> Login
                                </Link>
                            </List.Item>
                            <List.Item style={{paddingLeft: "20px"}} key="register" onClick={this.onSignup}>
                                <Link to={'signup'}>
                                    <IconFont type="iconregister" style={{paddingRight: "10px"}}/>Register
                                </Link>
                            </List.Item>
                        </List>
                    </Drawer>
                </Header>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout())

    }
};

export default connect(null, mapDispatchToProps)(HomeHeader)