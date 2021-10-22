import React, {useState} from 'react';
import {Icon, Button, Menu} from "antd";
import moment from "moment";

const {SubMenu} = Menu;

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_za79rmleofj.js',
});

const EventFilter = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [today] = useState(new Date());

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const filterByAllDate = () => {
        props.onDateFilter(null, null, null)
    };

    const filterByToday = () => {
        const dateToday = moment(today).format("YYYY-MM-DD");
        props.onDateFilter(dateToday, null, null)

    };
    const filterByMonth = () => {
        const dateMonth = moment(today).format("MM");
        const dateYear = moment(today).format("YYYY");
        props.onDateFilter(null, dateMonth, dateYear)
    };
    const filterByYear = () => {
        const dateYear = moment(today).format("YYYY");
        props.onDateFilter(null, null, dateYear)
    };
    const filterByLocation = (e) => {
        props.onLocationFilter(e.key);

    };
    return (
        <div style={{maxWidth: 256, minWidth: "150px"}}>
            <Button type="primary" onClick={toggleCollapsed} style={{marginBottom: 16}}>
                <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
            </Button>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
            >
                <Menu.Item key="All" onClick={filterByAllDate}>
                    <IconFont type="iconactivity"/>
                    <span>All</span>
                </Menu.Item>
                <SubMenu
                    key="Date"
                    title={
                        <span>
                <IconFont type="icondate"/>
                <span>Date</span>
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
                <IconFont type="iconcategory"/>
                <span>Category</span>
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
                <IconFont type="iconlocation"/>
                <span>Location</span>
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
    )
};

export default EventFilter