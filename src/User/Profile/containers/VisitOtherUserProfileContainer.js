import React, {Component} from 'react'
import {Layout, Avatar, Row, Col, Tabs, Icon, Button, Typography, Tag, message} from 'antd'
import axios from 'axios'

import OtherUserArticleList from "../components/OtherUserArticleList";

const TabPane = Tabs.TabPane;
const {Paragraph} = Typography;

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_9cj9xgq951n.js'
});

class VisitOtherUserProfile extends Component {
    state = {
        user: [],
        avatar: '',
        username: '',
        bio: '',
        follow: false,
        loading: false,
        profession: '',
        cover: ''
    };

    componentDidMount = async (v) => {
        await this.getProfileData();
        await this.isFollow()
    };

    isFollow = async (v) => {
        const token = window.localStorage.getItem('token');

        if (token !== null) {
            const response = await axios.post(
                'api/account/user/' + this.props.match.params.id + '/is_followed/?format=json',
                {},
                {headers: {'Authorization': 'Token ' + token}}
            );
            this.setState({
                follow: (response.data.code === '1')
            })
        }
    };

    follow = async (v) => {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            this.setState({loading: true});
            axios.post(
                'api/account/user/' + this.props.match.params.id + '/follow/?format=json',
                {},
                {headers: {'Authorization': 'Token ' + token}}
            ).then(res => {
                // console.log(res.data);
            });
            setTimeout(() => {
                this.setState({
                    follow: true,
                    loading: false
                })
            }, 300);
            message.success('Follow successfully')
        } else {
            message.warning('Please login!')
        }
    };

    unfollow = async (v) => {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            this.setState({loading: true});
            axios.post(
                'api/account/user/' + this.props.match.params.id + '/unfollow/?format=json',
                {},
                {headers: {'Authorization': 'Token ' + token}}
            );
            setTimeout(() => {
                this.setState({
                    follow: false,
                    loading: false
                })
            }, 300);
            message.success('Unfollow Successfully!')
        } else {
            message.warning('Please login!')
        }
    };

    getProfileData = async (v) => {
        await axios.get(
            'api/account/users/' + this.props.match.params.id + '/?format=json'
        ).then(res => {
            this.setState({
                user: res.data,
                avatar: res.data.profile.avatar,
                username: res.data.username,
                bio: res.data.profile.bio,
                profession: res.data.profile.profession,
                cover: res.data.profile.cover
            })
        }).catch(error => {
            console.log(error)
        });
    };

    render() {
        return (
            <Layout style={{minHeight: '100vh', backgroundColor: '#f7f7f7', paddingTop: '40px'}}>
                <Row>
                    <Col xxl={{span: 18, offset: 3}}
                         xl={{span: 20, offset: 2}}
                         lg={{span: 20, offset: 2}}
                         md={{span: 22, offset: 1}}
                         sm={{span: 24, offset: 0}}
                         xs={{span: 24, offset: 0}}
                         style={{boxShadow: '0 1px 3px rgba(26,26,26,.1)'}}>
                        <div style={{
                            backgroundImage: `url(${this.state.cover})`,
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundOrigin: 'padding-box',
                            backgroundClip: 'border-box',
                            backgroundAttachment: 'scroll',
                            height: '240px'
                        }}/>
                        <div style={{background: '#fff', display: 'flex', flexWrap: 'wrap'}}>
                            <div style={{height: '200px', width: '200px', marginTop: '-100px', padding: '20px'}}>
                                <Avatar shape='square' src={this.state.avatar} icon='user' style={{
                                    height: '100%',
                                    width: '100%',
                                    border: '4px solid white',
                                    borderRadius: '10px',
                                    backgroundColor: 'white'
                                }}/>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{
                                        fontSize: '26px',
                                        lineHeight: '30px',
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginRight: '6px'
                                    }}>{this.state.username}</span>
                                    {this.state.profession && <Tag color='#f50' style={{
                                        height: '22px',
                                        fontSize: '14px'
                                    }}>{this.state.profession}</Tag>}
                                </div>
                                <Paragraph>{this.state.bio}</Paragraph>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexGrow: '1',
                                flexDirection: 'row-reverse',
                                alignItems: 'center',
                                padding: '20px'
                            }}>
                                {this.state.follow ?
                                    <Button type='primary' onClick={this.unfollow} loading={this.state.loading}
                                            style={{width: '150px'}} block>Unfollow</Button> :
                                    <Button ghost type='primary' onClick={this.follow} loading={this.state.loading}
                                            style={{width: '150px'}} block>Follow</Button>}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row style={{paddingTop: '15px'}}>
                    <Col xxl={{span: 13, offset: 3}}
                         xl={{span: 14, offset: 2}}
                         lg={{span: 14, offset: 2}}
                         md={{span: 14, offset: 1}}
                         sm={{span: 24, offset: 0}}
                         xs={{span: 24, offset: 0}}
                         style={{
                             background: '#fff',
                             padding: '0 20px',
                             marginBottom: '30px',
                             boxShadow: '0 1px 3px rgba(26,26,26,.1)'
                         }}>
                        <Tabs defaultActiveKey='1' size='large' style={{paddingBottom: '15px'}}>
                            <TabPane tab={<span><IconFont type='iconwenzhang'/>Articles</span>} key='1'>
                                <OtherUserArticleList visitUserId={this.props.match.params.id}/>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default VisitOtherUserProfile
