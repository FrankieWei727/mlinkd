import React, {Component} from 'react';
import {Form, Input, Button, Tooltip, Icon, InputNumber, Upload, message, DatePicker, Modal} from 'antd';
import axios from "axios";
import moment from "moment";

const {TextArea} = Input;
const {MonthPicker} = DatePicker;

function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('File size must smaller than 2MB!')
    }
    return isLt2M
}

class EditMovieForm extends Component {
    componentWillReceiveProps(nextProps) {
        !nextProps.visible && this.props.form.resetFields();
    }

    state = {
        loading: false,
    };

    onChangeVisible() {
        this.handleVisible(false);
    };

    handleSubmit = e => {
        e.preventDefault();
        // let _this = this;
        this.props.form.validateFields((err, values) => {
            this.setState({
                loading: true,
            });
            if (!err) {
                this.setState({
                    loading: true,
                });
                console.log('Received values of form: ', values);
                this.onChangeVisible();
                // 此处应该为后台业务逻辑
                setTimeout(() => {
                    const submitData = {
                        name: values.name,
                        region: values.region,
                        length: values.length,
                        poster: values.poster ? values.poster[0].response.data.link : '',
                        description: values.description,
                        actors: values.actors,
                        director: values.director,
                        scriptwriter: values.scriptwriter,
                        // category: cateArray,
                        video: values.video,
                        release_date: values.release_date,
                        language: values.language,
                    };
                    axios.patch(
                        'api/movie/create_movie/',
                        {
                            name: submitData.name,
                            region: submitData.region,
                            length: submitData.length,
                            description: submitData.description,
                            actors: submitData.actors,
                            director: submitData.director,
                            scriptwriter: submitData.scriptwriter,
                            poster: submitData.poster,
                            // category: submitData.category,
                            video: submitData.video,
                            release_date: submitData.release_date,
                            language: submitData.language,
                        },
                        {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
                    ).then(response => {
                        console.log(response.data);
                        this.setState({
                            loading: false,
                        });
                    }).catch(error => {
                            console.log(error.response.data);
                            if (error.response.status === 403) {
                                this.setState({
                                    loading: false
                                })
                            }
                        }
                    );
                    Modal.info({
                        title: '点击了提交',
                        content: (
                            <div>
                                <p>当前表单内容为：</p>
                                <p>{JSON.stringify(values)}</p>
                            </div>
                        ),
                        onOk() {
                            // // 操作完跳转到第一页
                            // const pager = {..._this.state.pagination};
                            // pager.current = 1;
                            // _this.setState({pagination: pager});
                            // _this.fetch(1, _this.state.pagination.pageSize);
                            // // console.log(_this.state.selectedRowKeys)
                        }
                    });
                }, 500);
            }
        });
    };

    normFile = e => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
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
                        'Authorization': 'Client-ID d0b3bf7724440e7',
                    }
                }
            );
            info.onSuccess(response.data)
        } catch (error) {
            console.log(error)
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {data} = this.props;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        };
        const formTailLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20, offset: 4}
        };
        return (
            <Form>
                <Form.Item {...formItemLayout}
                           label='Movie name'>
                    {getFieldDecorator('name', {
                        initialValue: data.name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the name of movie!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                {/*<Form.Item {...formItemLayout}*/}
                {/*    label='Category'>*/}
                {/*    {getFieldDecorator('category', {*/}
                {/*        rules: [*/}
                {/*            {}*/}
                {/*        ]*/}
                {/*    })(<div>*/}
                {/*        {tagsFromServer.map(tag => (*/}
                {/*            <CheckableTag*/}
                {/*                key={'upload_movie_tags' + tag.id}*/}
                {/*                checked={selectedTags.indexOf(tag) > -1}*/}
                {/*                onChange={checked => this.handleChange(tag, checked)}*/}
                {/*            >*/}
                {/*                {tag.name}*/}
                {/*            </CheckableTag>*/}
                {/*        ))}*/}
                {/*    </div>)}*/}
                {/*</Form.Item>*/}
                <Form.Item {...formItemLayout}
                           label='Language'>
                    {getFieldDecorator('language', {
                        initialValue: data.language,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the language of movie!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Release Date" {...formItemLayout}>
                    {getFieldDecorator('release_date', {
                        initialValue: moment(data.release_date),
                        rules: [{type: 'object', required: true, message: 'Please select time!'}]
                    })(<MonthPicker/>)}
                </Form.Item>
                <Form.Item label='Region' {...formItemLayout}>
                    {getFieldDecorator('region', {
                        initialValue: data.region,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the produced region of movie!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label='Director' {...formItemLayout}>
                    {getFieldDecorator('director', {
                        initialValue: data.director,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the director of movie!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label='Actor' {...formItemLayout}>
                    {getFieldDecorator('actors', {
                        initialValue: data.actors,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the actors of movie!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label='Scriptwriter' {...formItemLayout}>
                    {getFieldDecorator('scriptwriter', {
                        initialValue: data.scriptwriter,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the scriptwriter of movie!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item {...formItemLayout} label={(
                    <span>
                                        Run Time&nbsp;
                        <Tooltip title='length'>
                                            <Icon type='question-circle-o'/>
                                        </Tooltip>
                                            </span>
                )}>
                    {getFieldDecorator('length', {
                        initialValue: data.length,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the run time of movie!'
                            }
                        ]
                    })(<InputNumber min={0} max={100000}/>)}
                    <span className='ant-form-text'>minutes</span>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label='Movie trailer'>
                    {getFieldDecorator('video', {
                        initialValue: data.video,
                        rules: [
                            {}
                        ]
                    })(<Input
                        placeholder='Example: www.youtube.com/embed/FnCdOQsX5kc.'
                    />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label='Description'>
                    {getFieldDecorator('description', {
                        initialValue: data.description,
                        rules: [
                            {}
                        ]
                    })(<TextArea
                        placeholder='Say something about the movie...'
                        autoSize={{minRows: 8, maxRows: 30}}
                    />)}
                </Form.Item>
                <Form.Item label='Movie Cover'>
                    {getFieldDecorator('poster', {
                        // initialValue: data.poster,
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile
                    })(
                        <Upload name='cover'
                                action='https://api.imgur.com/3/image'
                                listType='picture'
                                customRequest={this.customRequest}
                                beforeUpload={beforeUpload}>
                            <Button>
                                <Icon type='upload'/> Click to upload
                            </Button>
                        </Upload>
                    )}
                </Form.Item>
                <Form.Item {...formTailLayout}>
                    <Button type='primary' htmlType='submit' loading={this.state.loading} onClick={this.handleSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(EditMovieForm);
