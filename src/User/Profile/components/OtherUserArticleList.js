import React, {Component} from 'react'
import {List, Button, Skeleton, message, Avatar, Icon} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'
import moment from "moment";

const count = 3;
const briefLength = 200;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1242637_tb2emfivmbd.js'
});

class OtherUserArticleList extends Component {

    state = {
        data: [],
        cache: [],
        loading: false,
        initLoading: true,
        page: 1,
        count: 0,
    };

    extractText = HTMLString => {
        let span = document.createElement('span');
        span.innerHTML = HTMLString;
        return span.textContent || span.innerText
    };

    extractBrief = HTMLString => {
        const text = this.extractText(HTMLString);
        if (text.length > briefLength) {
            return text.slice(0, briefLength) + '……'
        }
        return text
    };

    componentDidMount = async (v) => {
        await this.getArticleData();
        this.setState(function (state) {
            return {initLoading: false}
        })
    };

    getArticleData = async (v) => {
        try {
            const response = await axios.get(
                'api/comment/articles/?format=json'
                + '&page=' + this.state.page + '&page_size=' + count + '&author=' + this.props.visitUserId
            );
            this.data = response.data.results;
            this.setState(function (state) {
                return {data: response.data.results, cache: response.data.results, count: response.data.count}
            })
        } catch (error) {
            console.log(error)
        }
    };

    onLoadMore = async (v) => {
        this.setState(function (state) {
            return {
                loading: true,
                data: this.data.concat([...new Array(count)].map(() => ({loading: true, name: {}})))
            }
        });
        try {
            this.state.page = this.state.page + 1;
            const response = await axios.get(
                'api/comment/articles/?format=json'
                + '&page=' + this.state.page + '&page_size=' + count + '&author=' + this.props.visitUserId
            );
            if (response.status !== 404) {
                const cache = this.state.cache.concat(response.data.results);
                this.setState(function (state) {
                    return {cache: cache, data: cache, loading: false}
                }, () => {
                    window.dispatchEvent(new window.Event('resize'))
                })
            } else {
                message.error('No more article ^-^')
            }
        } catch (error) {
            console.log(error)
        }
    };

    render() {
        const {initLoading, loading, data, count} = this.state;
        const loadMore = !initLoading && !loading && (data.length !== count) ? (
            <div style={{
                textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'
            }}
            >
                <Button onClick={this.onLoadMore}>Load More</Button>
            </div>
        ) : null;

        return (
            <List
                itemLayout='vertical'
                dataSource={data}
                size='small'
                loadMore={loadMore}
                loading={initLoading}
                style={{paddingBottom: '20px'}}
                renderItem={item => (
                    <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                title={
                                    <div>
                                        {item.author && item.author.username}
                                        {(item.author && item.author.profile.permission) === 'reviewed' ?
                                            <IconFont type='iconbadge'
                                                      style={{paddingLeft: '10px'}}/> : null}
                                    </div>
                                }
                                avatar={<Avatar shape='square' icon='user'
                                                src={item.author && item.author.profile.avatar}/>}
                                description={item.created && moment(moment(item.created).format('YYYY-MM-DD HH:mm:ss'), "YYYY-MM-DD HH:mm:ss").fromNow()}
                            />
                            <Link to={'/article/' + item.id}>
                                <h3 style={{
                                    color: '#1a1a1a',
                                    fontWeight: '600',
                                    fontSize: '18px',
                                    fontStretch: '100%'
                                }}>{item.title}</h3>
                                <div style={{color: '#646464', fontSize: '15px'}}>
                                    {this.extractBrief(item.content)}
                                </div>
                            </Link>
                        </Skeleton>
                    </List.Item>
                )}
            />
        )
    }
}

export default OtherUserArticleList
