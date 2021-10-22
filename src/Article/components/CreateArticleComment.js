import React, {useEffect, useState} from 'react'
import {Comment, Avatar, Form, Button, List, Input, message} from 'antd'
import moment from 'moment'
import axios from 'axios';
import AvatarFlow from "./AvatarFlow";

const TextArea = Input.TextArea;
const token = window.localStorage.getItem('token');

const CommentList = ({comments, userId, user}) => (
    <List style={{paddingBottom: '40px'}}
          dataSource={comments}
          header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
          itemLayout='horizontal'
          renderItem={item => (
              <Comment
                  author={item.author ? item.author.username : item.username}
                  avatar={
                      (item.author ?
                              <AvatarFlow author={item.author} userId={userId}/>
                              :
                              <AvatarFlow author={user} userId={userId}/>
                      )}
                  content={item.content}
                  datetime={moment(moment(item.created).format('YYYY-MM-DD HH:mm:ss'), "YYYY-MM-DD HH:mm:ss").fromNow()}
              />
          )}
    />
);

const Editor = ({
                    onChange, onSubmit, submitting, value
                }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value}/>
        </Form.Item>
        <Form.Item>
            <Button
                htmlType='submit'
                loading={submitting}
                onClick={onSubmit}
                type='primary'
            >
                Submit
            </Button>
        </Form.Item>
    </div>
);

const pagesize = 8;
const page = 1;

const CreateArticleComment = (props) => {

    const [user, setUser] = useState({});
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState("");
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        getUserData().then();
        getCommentData().then();
    }, []);

    useEffect(() => {
        if (props.articleId) {
            getCommentData().then();
        }
    }, []);

    async function getUserData() {
        if (token !== null) {
            await axios.get(
                'rest-auth/user/',
                {headers: {'Authorization': 'Token ' + token}}
            ).then(res => {
                setUser(res.data);
                setUsername(res.data.username);
                setAvatar(res.data.profile.avatar);
            }).catch(err => {
                console.log(err)
            });
        }
    }

    async function getCommentData() {
        if (props.articleId) {
            await axios.get(
                'api/comment/article_comments/', {
                    params: {
                        page: page,
                        page_size: pagesize,
                        article: props.articleId
                    }
                }
            ).then(res => {
                setComments(res.data.results);
            }).catch(err => {
                console.log(err)
            });

        }
    }

    const sendComment = async (value) => {
        await axios.post(
            'api/comment/article_comments/',
            {
                content: value,
                article: props.articleId
            },
            {headers: {'Authorization': 'Token ' + token}}
        ).catch(err => {
            console.log(err);
            message('error');
        });
    };

    const handleSubmit = () => {
        if (!value) {
            return
        }
        setSubmitting(true);

        sendComment(value).then();
        setTimeout(() => {
            setSubmitting(false);
            setValue("");
            setComments([
                ...comments,
                {
                    username: username,
                    avatar: avatar,
                    content: <p>{value}</p>,
                    pub_date: moment()
                }
            ]);
        }, 500)
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <div>
            {token !== null ?
                <div>
                    <Comment
                        avatar={(
                            <Avatar
                                shape='square'
                                src={avatar}
                                alt={user.username}
                            />
                        )}
                        content={(
                            <Editor
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                        )}/>
                </div>
                :
                <div style={{paddingBottom: '40px',color: '#8E9193', fontWeight: '700'}}>
                    Please Login to write a comment...
                </div>
            }
            {comments.length > 0 &&
            <CommentList comments={comments} userId={user.id} user={user}/>}
        </div>
    )
};

export default CreateArticleComment
