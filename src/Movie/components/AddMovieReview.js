import React, {Component} from 'react';
import {Comment, Avatar, Form, Button, List, Input, message, Rate, Tooltip} from 'antd';
import moment from 'moment';
import axios from 'axios';
import {Link} from 'react-router-dom';

const TextArea = Input.TextArea;

const CommentList = ({comments, username, avatarUrl}) => (
    <div>
        <List
            className="movie-comment-list"
            style={{paddingBottom: '40px', color: "#a0a3a5"}}
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout='horizontal'
            renderItem={item => (
                <Comment
                    author={item.user ? item.user.username : item.username}
                    avatar={item.user ?
                        <Link to={item.user.username === username ? '/profile/' : '/visit/profile/' + item.user.id}>
                            <Avatar src={item.user ? item.user.profile.avatar : avatarUrl}/>
                        </Link>
                        :
                        <Link to={'/profile/'}>
                            <Avatar src={item.user ? item.user.profile.avatar : avatarUrl}/>
                        </Link>
                    }
                    content={item.content}
                    datetime={
                        <div>
                            <Tooltip title={moment(item.created).format('YYYY-MM-DD HH:mm:ss')}>
                                <span>{moment(moment(item.created).format('YYYY-MM-DD HH:mm:ss'), "YYYY-MM-DD HH:mm:ss").fromNow()}</span>
                            </Tooltip>
                            <Rate disabled={true} style={{fontSize: 12, paddingLeft: '6px'}} allowHalf
                                  value={item.rate ? parseFloat(item.rate) : parseFloat(this.state.rate)}/>
                        </div>
                    }
                />
            )}
        />
    </div>
);

const Editor = ({onChangeText, onChangeRate, onSubmit, submitting, value, rate}) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChangeText} value={value}/>
        </Form.Item>
        <Form.Item>
            <Rate allowHalf defaultValue={rate} onChange={onChangeRate} rate={rate}/>
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

const count = 8;

class AddMovieReview extends Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
        cache: [],
        loading: false,
        initLoading: true,
        page: 1,
        username: '',
        avatarUrl: '',
        user: {},
        rate: 0,
    };

    componentDidMount = async (v) => {
        this.getUserData();
        if (this.props.movieId) {
            await this.getCommentData();
            this.setState(function (state) {
                return {initLoading: false}
            })
        }
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.movieId !== this.props.movieId) {
            await this.getCommentData();
            this.setState(function (state) {
                return {initLoading: false}
            })
        }
    };

    async getUserData() {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            try {
                const response = await axios.get(
                    'rest-auth/user/',
                    {headers: {'Authorization': 'Token ' + token}}
                );
                this.setState(function (state) {
                    return {
                        username: response.data.username,
                        avatarUrl: response.data.profile.avatar,
                        user: response.data
                    };
                })
            } catch (error) {
                console.log(error)
            }
        }


    };

    getCommentData = async (v) => {
        if (this.props.movieId) {
            try {
                const response = await axios.get(
                    'api/comment/reviews/?format=json&page=' + this.state.page + '&page_size=' + count + '&movie=' + this.props.movieId
                );
                this.comments = response.data.results;
                this.setState(function (state) {
                    return {comments: response.data.results, cache: response.data.results}
                })
            } catch (error) {
                console.log(error)
            }
        }
    };

    handleMovieRank = async (rate) => {
        const {comments} = this.state;
        let RateArray = 0;
        if (comments.length === 1) {
            RateArray = RateArray + parseFloat(comments.rate)
        } else if (comments.length === 0) {
            RateArray = 0
        } else {
            comments.map((comment) =>
                RateArray = RateArray + parseFloat(comment.rate))
        }
        let rank = (RateArray + rate) / (comments.length + 1);
        await axios.patch('api/movie/update_movie_rank/' + this.props.movieId,
            {
                user_rating: rank.toFixed(2),
                id: this.props.movieId,
            },
            {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}})
            .catch(err => {
                console.log(err.response.data)
            })
    };

    sendComment = async (value, rate) => {
        try {
            let config = {
                headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}
            };
            const response = await axios.post(
                'api/comment/reviews/',
                {
                    content: value,
                    movie: this.props.movieId,
                    rate: rate,
                },
                config
            );
            // console.log(response.data);
            if (response.status !== 201) {
                message('error')
            }
        } catch (error) {
            console.log(error)
        }
        this.handleMovieRank(rate)
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return
        }
        this.setState({
            submitting: true
        });
        this.sendComment(this.state.value, this.state.rate);
        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    ...this.state.comments,
                    {
                        username: this.state.username,
                        avatar: this.state.avatarUrl,
                        rate: this.state.rate,
                        content: <p>{this.state.value}</p>,
                        created: moment()
                    }
                ]
            })
        }, 500)
    };

    handleChangeText = (e) => {
        this.setState({
            value: e.target.value,
        })
    };
    handleChangeRate = rate => {
        this.setState({
            rate
        })
    };

    render() {
        const {comments, username, submitting, value, rate, avatarUrl} = this.state;
        let comment_number = 0;
        if (this.state.comments)
            comment_number = this.state.comments.length;
        else
            comment_number = 0;
        return (
            <div>
                {window.localStorage.getItem('token') !== null ?
                    <div><Comment
                        avatar={(
                            <Avatar
                                src={this.state.avatarUrl}
                                alt={this.state.username}
                            />
                        )}
                        content={(
                            <Editor
                                onChangeText={this.handleChangeText}
                                onChangeRate={this.handleChangeRate}
                                onSubmit={this.handleSubmit}
                                submitting={submitting}
                                value={value}
                                rate={rate}
                            />

                        )}
                    /></div>
                    :
                    <div style={{color: '#8E9193', fontWeight: '700'}}>
                        Please Login to write a review...
                    </div>
                }
                {comment_number > 0 && <CommentList comments={comments} username={username} avatarUrl={avatarUrl}/>}
            </div>
        )
    }
}

export default AddMovieReview
