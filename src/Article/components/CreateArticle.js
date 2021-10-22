import React, {Component} from 'react'
import {Layout, notification, Form, Input, Button, Row, Col, Switch} from 'antd'
import axios from 'axios'
import {withRouter} from 'react-router'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'


const openNotificationWithIconS = (type) => {
    notification[type]({
        message: 'Succeed',
        description: 'Published successfully',
        duration: 2
    })
};
const openNotificationWithIconE = (type) => {
    notification[type]({
        message: 'Error',
        description: 'Publishing failed',
        duration: 2
    })
};

const excludeControls = [
    'letter-spacing',
    'line-height',
    'clear',
    'remove-styles',
    'superscript',
    'subscript',
    'code',
    'undo',
    'redo',
    'text-indent'
];

class ArticleEditor extends Component {
    state = {
        uploading: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.form.setFieldsValue({
                content: BraftEditor.createEditorState(null)
            })
        }, 1000)
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                this.setState({
                    uploading: true
                });
                const submitData = {
                    title: values.title,
                    content: values.content.toHTML(),
                    originalitySwitch: values.originalitySwitch,
                    statusSwitch: values.statusSwitch
                };
                try {
                    const response = await axios.post(
                        'api/comment/articles/',
                        {
                            title: submitData.title,
                            content: submitData.content,
                            // originality: submitData.originalitySwitch === true ? 'Y' : 'N',
                            status: submitData.statusSwitch === true ? '1' : '2'
                        },
                        {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
                    );
                    this.setState({
                        uploading: false
                    });
                    if (response.status === 201) {
                        openNotificationWithIconS('success');
                        this.props.history.replace('/article')
                    }
                } catch (error) {
                    console.log(error.response.data);
                    openNotificationWithIconE('error')
                }
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Layout style={{backgroundColor: '#fff'}}>
                <Row style={{flex: '1 0', paddingTop: '20px'}}>
                    <Col xxl={{span: 12, offset: 6}} xl={{span: 16, offset: 4}} xs={{span: 22, offset: 1}}>
                        <div style={{wordWrap: 'break-word'}}>
                            <Form onSubmit={this.handleSubmit} className='text-editor-form'>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-between',
                                }}>
                                    <Form.Item>
                                        <Button loading={this.state.uploading} type='primary' htmlType='submit'>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('originalitySwitch', {
                                            rules: [],
                                            valuePropName: 'checked',
                                        })(<Switch checkedChildren='Original' unCheckedChildren='Reprinted'/>)}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('statusSwitch', {
                                            rules: [],
                                            valuePropName: 'checked',
                                        })(<Switch checkedChildren='Draft' unCheckedChildren='Publish'/>)}
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true,
                                            message: 'Please input title.'
                                        }]
                                    })(
                                        <Input size='large' placeholder='Title'/>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('content', {
                                        validateTrigger: 'onBlur',
                                        rules: [{
                                            required: true,
                                            validator: (_, value, callback) => {
                                                if (value.isEmpty()) {
                                                } else {
                                                    callback()
                                                }
                                            }
                                        }]
                                    })(
                                        <BraftEditor
                                            excludeControls={excludeControls}
                                            placeholder='Content'
                                            language='en'
                                            textAlignOptions='left'
                                            media={{image: true, video: true}}
                                        />
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

const CreateArticle = withRouter(Form.create()(ArticleEditor));
export default CreateArticle
