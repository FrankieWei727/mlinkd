import React, {useEffect, useState} from 'react'
import { Col, Row, Icon, Typography, Tabs, Divider} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'


import MovieEditPermission from "./MovieEditPermission";

const {Title} = Typography;
const {TabPane} = Tabs;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_xc714kf5q6.js'
});

const PermissionSetting = () => {

    const [data, setData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [urlAvatar, setUrlAvatar] = useState("");

    useEffect(() => {
        getProfileData().then();
    }, []);

    async function getProfileData() {

        await axios.get(
            'rest-auth/user/',
            {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
        ).then(res => {
            setUrlAvatar(res.data.profile.avatar);
            setBio(res.data.profile.bio);
            setUsername(res.data.username);
            setEmail(res.data.email);
        }).catch(err => {
            console.log(err)
        });

    }


    // const onCollapse = (collapsed) => {
    //     console.log(collapsed);
    //     setCollapsed({collapsed});
    // };

    // const handleClick = (e) => {
    //     this.setState({
    //         current: e.key
    //     })
    // };

    return (
        <div className="perm-setting">
            <Row gutter={[{xs: 0, sm: 0, md: 16, lg: 24}, {xs: 16, sm: 16, md: 0}]}>
                <Col xxl={{span: 5, offset: 3}}
                     xl={{span: 4, offset: 2}}
                     lg={{span: 5, offset: 2}}
                     md={{span: 5, offset: 1}}
                     sm={{span: 22, offset: 1}}
                     xs={{span: 22, offset: 1}}>
                    <nav className="perm-setting-nav">
                        <div className="title">
                            Setting
                        </div>
                        <div className="item">
                            <Link to='/profile/setting'>
                                <Icon type='user' style={{paddingRight: '6px'}}/>Account Setting
                            </Link>
                        </div>
                        <div className="select-item">
                            <Link to='/permission/setting'>
                                <Icon type='setting' style={{paddingRight: '6px'}}/>Permission Setting
                            </Link>
                        </div>
                    </nav>
                </Col>
                <Col xxl={{span: 13, offset: 0}}
                     xl={{span: 16, offset: 0}}
                     lg={{span: 16, offset: 0}}
                     md={{span: 16, offset: 0}}
                     sm={{span: 22, offset: 1}}
                     xs={{span: 22, offset: 1}}>
                    <Row>
                        <Col xl={{span: 24, offset: 0}} xs={{span: 22, offset: 1}}>
                            <div style={{
                                fontSize: '20px',
                                borderBottom: '1px solid #e1e4e8',
                                paddingBottom: '8px',
                                fontWeight: '600',
                                color: '#24292e'
                            }}>
                                Permission Setting
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginTop: '20px'}}>
                        <Col xl={{span: 24, offset: 0}} xs={{span: 22, offset: 1}}>
                            <Tabs defaultActiveKey='1'>
                                <TabPane
                                    tab={
                                        <span>
                                                        <IconFont type='iconguanli'/>Film Editors
                                                    </span>
                                    }
                                    key='1'
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'baseline'
                                    }}>
                                        <Title style={{padding: '24px 0'}} level={4}>Film resource
                                            editor</Title>
                                        <Divider type='vertical'/>
                                        <Link to='/editor_guidance'>Note to editors</Link>
                                    </div>
                                    <MovieEditPermission/>
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                                         <Icon type='android'/>In coming
                                                    </span>
                                    }
                                    key='2'
                                >
                                    Tab 2
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )

}

export default PermissionSetting
