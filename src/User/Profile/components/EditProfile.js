import React, {Component} from 'react'
import {Col, Row, Form, Icon, Button, Input, message, Select, Upload, Avatar} from 'antd'
import axios from 'axios'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

// import UploadAvatar from "./UploadAvatar";

const {Option} = Select;

const profession = ['高新科技', '互联网', '电子商务', '    电子游戏', '    计算机软件', '    计算机硬件', '信息传媒',
    '    出版业', '    电影录音', '    广播电视', '    通信', '金融', '    银行', '    资本投资', '    证券投资',
    '    保险', '    信贷', '    财务', '    审计', '服务业', '    法律', '    餐饮', '    酒店', '    旅游',
    '    广告', '    公关', '    景观', '    咨询分析', '    市场推广', '    人力资源', '    社工服务',
    '    养老服务', '教育', '    高等教育', '    基础教育', '    职业教育', '    幼儿教育', '    特殊教育',
    '    培训', '医疗服务', '    临床医疗', '    制药', '    保健', '    美容', '    医疗器材',
    '    生物工程', '    疗养服务', '    护理服务', '艺术娱乐', '    创意艺术', '    体育健身',
    '    娱乐休闲', '    图书馆', '    博物馆', '    策展', '    博彩', '制造加工', '    食品饮料业',
    '    纺织皮革业', '    服装业', '    烟草业', '    造纸业', '    印刷业', '    化工业', '    汽车',
    '    家具', '    电子电器', '    机械设备', '    塑料工业', '    金属加工', '    军火', '地产建筑',
    '    房地产', '    装饰装潢', '    物业服务', '    特殊建造', '    建筑设备', '贸易零售', '    零售',
    '    大宗交易', '    进出口贸易', '公共服务', '    政府', '    国防军事', '    航天', '    科研',
    '    给排水', '    水利能源', '    电力电网', '    公共管理', '    环境保护', '    非营利组织',
    '开采冶金', '    煤炭工业', '    石油工业', '    黑色金属', '    有色金属', '    土砂石开采', '    地热开采',
    '交通仓储', '    邮政', '    物流递送', '    地面运输', '    铁路运输', '    管线运输', '    航运业',
    '    民用航空业', '农林牧渔', '    种植业', '    畜牧养殖业', '    林业', '    渔业'];

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}


class SettingProfile extends Component {
    componentDidMount() {
        this.getProfileData();
    }

    state = {
        data: [],
        collapsed: false,
        bio: '',
        username: '',
        email: '',
        uploading: false,
        profession: '',
        urlAvatar: '',
        loading: false,
    };

    onCollapse = (collapsed) => {
        this.setState({collapsed})
    };

    getProfileData = async (v) => {
        try {
            let config = {
                headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}
            };
            const response = await axios.get(
                'rest-auth/user/',
                config
            );
            this.data = response.data.results;
            this.setState(function (state) {
                return {
                    id: response.data.id,
                    // urlAvatar: response.data.profile.avatar,
                    bio: response.data.profile.bio,
                    username: response.data.username,
                    email: response.data.email,
                    profession: response.data.profile.profession
                }
            })
        } catch (error) {
            console.log(error)
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

    normFile = e => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    handleChange = info => {
        this.setState({loading: true});
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                    urlAvatar: info.file.response.data.link,
                    loading: false,
                }
            );
        }
    };

    customRequest = async (info) => {
        try {
            let formData = new window.FormData();
            formData.append('image', info.file);
            const response = await axios.post(
                info.action,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data',
                        'Authorization': process.env.REACT_APP_Imgur_API_KEY,
                    }
                }
            );
            info.onSuccess(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (error, values) => {
            // console.log(values.avatar[0].response.data.link);
            let avatar_data;
            if (values.avatar) {
                avatar_data = values.avatar[0].response.data.link
            } else {
                avatar_data = this.state.urlAvatar
            }
            if (!error) {
                this.setState({
                    uploading: true
                });
                const submitData = {
                    bio: values.bio,
                    email: values.email,
                    profession: values.profession,
                    avatar: avatar_data,
                };
                try {
                    let config = {
                        headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}
                    };
                    const response = await axios.patch(
                        'rest-auth/user/',
                        {
                            profile: {
                                bio: submitData.bio,
                                profession: submitData.profession,
                                avatar: submitData.avatar,
                            },
                            email: submitData.email
                        },
                        config
                    );
                    this.setState({
                        uploading: false
                    });
                    if (response.status === 200) {
                        message.success('Update successfully');
                        this.props.history.replace('/profile')
                    }
                } catch (error) {
                    message.error('Update unsuccessfully');
                    console.log(error.response.data);
                    this.setState({
                        uploading: false
                    })
                }
            }
        })
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 12},
            labelAlign: "left",
        };

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (

            <div className="edit-profile">
                <Row gutter={[{xs: 0, sm: 0, md: 16, lg: 24}, {xs: 16, sm: 16, md: 0}]}>
                    <Col xxl={{span: 5, offset: 3}}
                         xl={{span: 4, offset: 2}}
                         lg={{span: 5, offset: 2}}
                         md={{span: 5, offset: 1}}
                         sm={{span: 22, offset: 1}}
                         xs={{span: 22, offset: 1}}>
                        <nav className="edit-profile-nav">
                            <div className="title">
                                Setting
                            </div>
                            <div className="select-item">
                                <Link to='/profile/setting'>
                                    <Icon type='user' style={{paddingRight: '6px'}}/>Account Setting
                                </Link>
                            </div>
                            <div className="item">
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
                            <Col>
                                <div className="edit-profile-form-title">
                                    {this.state.username}
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop: '20px'}}>
                            <Col xl={{span: 16, offset: 0}}
                                 xs={{span: 24, offset: 0}}
                            >
                                <Form style={{maxWidth: '500px'}} onSubmit={this.handleSubmit}>
                                    <Form.Item {...formItemLayout} label="Avatar" style={{textAlign: "left"}}>
                                        {getFieldDecorator('avatar', {
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                        })(
                                            <Upload
                                                style={{width: "128px", height: "128px"}}
                                                name="avatar"
                                                action="https://api.imgur.com/3/image"
                                                listType="picture-card"
                                                showUploadList={false}
                                                customRequest={this.customRequest}
                                                beforeUpload={beforeUpload}
                                                onChange={this.handleChange}>
                                                {this.state.urlAvatar ? <img src={this.state.urlAvatar} alt="avatar"
                                                                             style={{width: '100%'}}/> : uploadButton}
                                            </Upload>,
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label="Introduction">
                                        {getFieldDecorator('bio', {
                                            initialValue: this.state.bio,
                                            rules: [{
                                                required: true,
                                                message: 'Please input bio.'
                                            }]
                                        })(
                                            <Input size='default'/>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label="Email">
                                        {getFieldDecorator('email', {
                                            initialValue: this.state.email,
                                            rules: [{
                                                required: true,
                                                message: 'Please input email.'
                                            }, {
                                                validator: this.validateToEmail
                                            }]
                                        })(
                                            <Input size='default'/>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} hasFeedback label="Industry">
                                        {getFieldDecorator('profession', {
                                            initialValue: this.state.profession,
                                            rules: [{required: true, message: 'Please select your peofession!'}]
                                        })(
                                            <Select placeholder='Please select a profession'>
                                                {profession.map(item => (
                                                    <Option key={'options'} value={item}>{item}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <Button loading={this.state.uploading} type='primary' htmlType='submit'
                                                className="edit-profile-form-btn">
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

const EditProfile = withRouter(Form.create()(SettingProfile));
export default EditProfile
