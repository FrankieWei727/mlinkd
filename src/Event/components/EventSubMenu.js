import React, {useState} from "react";
import {Menu, Layout, Icon, Drawer} from "antd";
import moment from "moment";

const {SubMenu} = Menu;

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_bimhovlhhh.js'
});
const {Header} = Layout;
const EventSubMenu = (props) => {

    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const [today] = useState(new Date());

    const filterByAllDate = () => {
        props.onDateFilter(null, null, null);
        setVisible(false);
    };

    const filterByToday = () => {
        const dateToday = moment(today).format("YYYY-MM-DD");
        props.onDateFilter(dateToday, null, null);
        setVisible(false);

    };
    const filterByMonth = () => {
        const dateMonth = moment(today).format("MM");
        const dateYear = moment(today).format("YYYY");
        props.onDateFilter(null, dateMonth, dateYear);
        setVisible(false);
    };
    const filterByYear = () => {
        const dateYear = moment(today).format("YYYY");
        props.onDateFilter(null, null, dateYear);
        setVisible(false);
    };
    const filterByLocation = (e) => {
        props.onLocationFilter(e.key);
        setVisible(false);

    };

    return (
        <div>
            <Header style={{backgroundColor: "#f7f7f7", height: "51px", padding: " 0 0"}}>
                <div>
                    <Menu mode="horizontal" style={{borderBottom: "none", background: "none", lineHeight: "55px"}}>
                        <Menu.Item key="1" onClick={showDrawer}>
                            <IconFont type='iconfilter' style={{fontSize: '26px'}}/>
                        </Menu.Item>
                    </Menu>
                    <Drawer
                        bodyStyle={{padding: "0 0"}}
                        title="Event Filter"
                        placement="left"
                        closable={false}
                        onClose={onClose}
                        visible={visible}
                    >
                        <div style={{maxWidth: 256, minWidth: "150px"}}>
                            <Menu
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                theme="light"
                            >
                                <Menu.Item key="All" onClick={filterByAllDate}>
                                    <IconFont type="iconactivity"/>All
                                </Menu.Item>
                                <SubMenu
                                    key="Date"
                                    title={
                                        <span>
                                        <IconFont type="icondate"/>Date
                                    </span>
                                    }
                                >
                                    <Menu.Item key="Today" onClick={filterByToday}>Today</Menu.Item>
                                    <Menu.Item key="Month" onClick={filterByMonth}>This month</Menu.Item>
                                    <Menu.Item key="Year" onClick={filterByYear}>This Year</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="Category"
                                    title={
                                        <span>
                                            <IconFont type="iconcategory"/>Category
                                        </span>
                                    }
                                >
                                    <Menu.Item key="Business">Business</Menu.Item>
                                    <Menu.Item key="Outdoor">Outdoor</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="Location"
                                    title={
                                        <span>
                                            <IconFont type="iconlocation"/>Location
                                        </span>
                                    }
                                >
                                    <Menu.Item onClick={filterByLocation} key="NSW">NSW</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="Qld">Qld</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="SA">SA</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="Tas">Tas</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="Vic">Vic</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="WA">WA</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="NT">NT</Menu.Item>
                                    <Menu.Item onClick={filterByLocation} key="ACT">ACT</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </div>
                    </Drawer>
                </div>
            </Header>
        </div>
    )
};

export default EventSubMenu