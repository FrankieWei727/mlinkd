import React from "react";
import {Icon, Layout, Menu} from "antd";

const {SubMenu} = Menu;
const {Sider} = Layout;

class AdminSider extends React.Component {

    state = {
        current: null,
    };
    handleClick = e => {
        this.setState({
            current: e.key,
        });
        this.props.handleValue(e.key);
    };

    render() {
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                <div style={{
                    color: '#ffffffa6',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    background: 'transparent'
                }}>
                    Mlinked
                </div>
                <Menu theme="dark" onClick={this.handleClick} mode="inline" defaultSelectedKeys={['1']}>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                            <Icon type="video-camera"/>
                            <span>Movie</span>
                            </span>
                        }
                    >
                        <Menu.Item key="1">Movie</Menu.Item>
                        <Menu.Item key="2">Stills</Menu.Item>
                        <Menu.Item key="3">Videos</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="5">
                        <Icon type="video-camera"/>
                        <span>nav 2</span>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Icon type="upload"/>
                        <span>nav 3</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}

export default AdminSider