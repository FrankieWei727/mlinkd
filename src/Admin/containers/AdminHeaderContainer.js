import React from "react";
import {Avatar, Dropdown, Icon, Layout, Menu, Typography} from "antd";
import FullScreen from "../components/FullScreen";
import * as actions from "../../Store/actions/auth";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

const {Header} = Layout;
const {Title} = Typography;

class AdminHeader extends React.Component {

    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        this.props.handleValue(this.state.collapsed);
    };

    setting = () => {
        this.setState({visible: true});
    };

    onClose = () => {
        this.setState({visible: false});
    };


    render() {

        const DropdownList = (
            <Menu className="drop-list">
                <Menu.Item key="logout">
                    <Link to={'logout'} onClick={this.props.logout}>
                        <Icon type="logout"/>
                        Logout
                    </Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <Header style={{
                background: '#fff',
                height: '100px',
                borderBottom: '1px solid #d8d8d8',
                padding: '0 15px',
                position: 'relative'
            }}>
                <div style={{
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <Title level={4} style={{
                        flex: '1',
                        paddingLeft: '15px',
                        fontSize: '20px',
                    }}>
                        Admin System</Title>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '320px'
                    }}>
                        <div style={{marginRight: '20px'}}>
                            <FullScreen/>
                        </div>
                        <div style={{marginRight: '20px'}}>
                            <Icon style={{fontSize: '21px', cursor: 'pointer'}} type="setting"
                                  onClick={this.setting}/>
                        </div>
                        <Dropdown overlay={DropdownList} style={{marginRight: '20px'}}>
                            <div>
                                <Avatar size="large">A</Avatar>
                                <Icon style={{color: 'rgba(0,0,0,.3)', cursor: 'pointer'}} type="caret-down"/>
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </Header>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout()),
    }
};

export default connect(null, mapDispatchToProps)(AdminHeader)