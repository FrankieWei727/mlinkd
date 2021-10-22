import React, {useEffect, useState} from 'react'
import {Layout, Avatar, Row, Col, Tabs, Icon, Button, Typography, Card, Statistic, message, Upload} from 'antd'
import {Link} from 'react-router-dom'
import axios from 'axios'
import MyArticleList from "../components/MyArticleList";
import FollowingList from "../components/FollowingList";
import FollowerList from "../components/FollowerList";

const TabPane = Tabs.TabPane;
const {Paragraph} = Typography;

function checkImageWH(file, width, height) {
    return new Promise(function (resolve, reject) {
        let filereader = new window.FileReader();
        filereader.onload = e => {
            let src = e.target.result;
            const image = new window.Image();
            image.onload = function () {
                if (width && this.width < width) {
                    message.error('The uploaded image must be larger than 1200p x 240p');
                    reject()
                } else if (height && this.height < height) {
                    message.error('The uploaded image must be larger than 1200p x 240p');
                    reject()
                } else {
                    resolve()
                }
            };
            image.onerror = reject;
            image.src = src
        };
        filereader.readAsDataURL(file)
    })
}

function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('File size must smaller than 2MB!');
        return new Promise(function (resolve, reject) {
            reject()
        })
    }
    return isLt2M && checkImageWH(file, 1200, 240)
}

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_9cj9xgq951n.js'
});

const MyProfileContainer = () => {


    const [user, setUser] = useState({
        id: null,
        url: null,
        username: null,
        email: null,
        profile: {
            id: null,
            url: null,
            avatar: null,
            date_of_birth: null,
            user: null,
            cover: null,
            bio: null,
            permission: null,
        }
    });
    const [cover, setCover] = useState("");
    const [countFollowing, setCountFollowing] = useState(0);
    const [countFollower, setCountFollower] = useState(0);
    const [deskWidth, setDeskWidth] = useState(0);

    const handleSize = () => {
        setDeskWidth(document.body.clientWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleSize());
        return () => {
            window.removeEventListener('resize', handleSize());
        };
    });

    useEffect(() => {
        getProfileData().then();
    }, []);

    async function getFollowingData(id) {
        await axios.get(
            'api/account/user/followers/?format=json', {
                params: {
                    follower: id
                }
            }).then(res => {
            setCountFollowing(res.data.count);
        }).catch(err => {
            console.log(err)
        });
    }

    async function getFollowerData(id) {
        await axios.get(
            'api/account/user/followers/?format=json', {
                params: {
                    user: id,
                }
            }).then(res => {
            setCountFollower(res.data.count)
        }).catch(err => {
            console.log(err)
        });
    }

    async function getProfileData() {
        await axios.get(
            'rest-auth/user/?format=json',
            {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
        ).then(res => {
            setUser(res.data);
            setCover(res.data.profile.cover);
            getFollowingData(res.data.id).then();
            getFollowerData(res.data.id).then();
        }).catch(err => {
            console.log(err)
        });
    }

    const CoverUrl = async (coverURL) => {
        await axios.patch(
            'rest-auth/user/',
            {
                profile: {cover: coverURL}
            },
            {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
        ).then(res => {
            message.success('Update successfully');
            setCover(coverURL);
        }).catch(err => {
            console.log(err.response.data)
        });
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            CoverUrl(info.file.response.data.link).then();
        }

    };

    const customRequest = async (info) => {
        let formData = new window.FormData();
        formData.append('image', info.file);
        await axios.post(
            info.action,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': process.env.REACT_APP_Imgur_API_KEY,
                }
            }
        ).then(res => {
            info.onSuccess(res.data)
        }).catch(err => {
            console.log(err.response.data)
        });
    };


    return (
        <Layout style={{backgroundColor: '#f7f7f7', padding: (deskWidth > 768 ? '40px 0' : "0 0")}}>
            <Row gutter={[0, {md: 0, lg: 16}]}>
                <Col>
                    <Row>
                        <Col xxl={{span: 18, offset: 3}}
                             xl={{span: 20, offset: 2}}
                             lg={{span: 20, offset: 2}}
                             md={{span: 22, offset: 1}}
                             sm={{span: 24, offset: 0}}
                             xs={{span: 24, offset: 0}}
                             style={{boxShadow: '0 1px 3px rgba(26,26,26,.1)'}}>
                            <div style={{
                                backgroundImage: `url(${cover})`,
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                backgroundOrigin: 'padding-box',
                                backgroundClip: 'border-box',
                                backgroundAttachment: 'scroll',
                                height: '240px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    marginTop: '20px',
                                    marginRight: '20px'
                                }}>
                                    <Upload
                                        name='cover'
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        customRequest={customRequest}
                                        action='https://api.imgur.com/3/image'
                                    >
                                        <Button ghost style={{width: '150px', color: '#fff'}}>
                                            <Icon type='upload'/>Upload Cover
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                            <div style={{
                                background: '#fff',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-around'
                            }}>
                                <div style={(deskWidth > 576 ? {
                                        height: '200px',
                                        width: '200px',
                                        marginTop: '-100px',
                                        padding: '20px'
                                    } :
                                    {
                                        height: '100px',
                                        width: '100px',
                                        marginTop: '-50px',
                                        padding: '20px'
                                    })}
                                >
                                    <Avatar shape='square' src={user.profile.avatar} icon='user' style={{
                                        height: '100%',
                                        width: '100%',
                                        border: '4px solid white',
                                        borderRadius: '10px',
                                        backgroundColor: 'white'
                                    }}/>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{
                                        fontSize: '26px',
                                        lineHeight: '30px',
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginRight: '6px'
                                    }}>{user.username}</span>
                                        {/*{profession && <Tag color='#f50' style={{*/}
                                        {/*    height: '22px',*/}
                                        {/*    fontSize: '14px'*/}
                                        {/*}}>{profession}</Tag>}*/}
                                    </div>
                                    <Paragraph>{user.profile.bio}</Paragraph>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexGrow: '1',
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    padding: '20px'
                                }}>
                                    <Button type='primary' ghost style={{width: '150px'}}>
                                        <Link to='/profile/setting/'>Edit Profile</Link>
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row justify="start" gutter={[{xs: 0, sm: 0, md: 24}, {xs: 16, sm: 16, md: 0}]}>
                        <Col xxl={{span: 13, offset: 3}}
                             xl={{span: 14, offset: 2}}
                             lg={{span: 14, offset: 2}}
                             md={{span: 14, offset: 1}}
                             sm={{span: 24, offset: 0}}
                             xs={{span: 24, offset: 0}}
                        >
                            <div style={{
                                background: '#fff',
                                padding: "0 20px",
                                boxShadow: '0 1px 3px rgba(26,26,26,.1)'
                            }}>
                                <Tabs defaultActiveKey='1' size='large'>
                                    <TabPane tab={<span><IconFont type='iconwenzhang'/>Articles</span>} key='1'>
                                        <MyArticleList/>
                                    </TabPane>
                                    <TabPane tab={<span><IconFont type='iconfabu-'/>Following</span>} key='2'>
                                        <FollowingList userId={user.id}/>
                                    </TabPane>
                                    <TabPane tab={<span><IconFont type='iconfensi'/>Follower</span>} key='3'>
                                        <FollowerList id={user.id}/>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Col>
                        <Col xxl={{span: 5, offset: 0}}
                             xl={{span: 6, offset: 0}}
                             lg={{span: 6, offset: 0}}
                             md={{span: 8, offset: 0}}
                             sm={{span: 24, offset: 0}}
                             xs={{span: 24, offset: 0}}
                        >
                            <Card
                                title={
                                    <div style={{color: '#646464', fontWeight: '600', fontSize: '15px'}}>
                                        Score
                                    </div>
                                }
                                bordered={false}
                                style={{boxShadow: '0 1px 3px rgba(26,26,26,.1)', marginBottom: '20px'}}>
                                {/*<PropertyList property={this.state.property}/>*/}
                            </Card>
                            <Card
                                bordered={false}
                                style={{boxShadow: '0 1px 3px rgba(26,26,26,.1)'}}>
                                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                                    <Statistic title='Following' value={countFollowing}/>
                                    <Statistic title='Follower' value={countFollower}/>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
};

export default MyProfileContainer
