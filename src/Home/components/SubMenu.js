import React from "react";
import {Menu, Layout, Icon} from "antd";
import {Link} from "react-router-dom";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_d874tqmi7pk.js'
});
const {Header} = Layout;
const SubMenu = (props) => {

    const renderSwitch = (param) => {
        if (param === 'article') {
            return (
                <Header style={{backgroundColor: "#f7f7f7", height: "51px", padding: " 0 0"}}>
                    <div>
                        <Menu mode="horizontal" style={{borderBottom: "none", background: "none", lineHeight: "55px"}}>
                            <Menu.Item key="1">
                                <Link
                                    to={(window.localStorage.getItem('token') !== null) ? '/create_article' : '/login'}>
                                    <IconFont type='iconbianji1' style={{fontSize: '26px'}}/>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </Header>
            );
        }
        if (param === 'event') {
            return null
        } else {
            return null;
        }
    };

    return (
        <div>
            {renderSwitch(props.menuKey)}
        </div>
    )
};

export default SubMenu