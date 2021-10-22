import React, {useEffect, useState} from "react";
import {Avatar, List, Spin, message, Typography} from "antd";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';

const {Title} = Typography;

let page = 1;
const pagesize = 5;
const MovieFansList = ({movieId}) => {

    const [fans, setFans] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    async function getData() {
        page = 1;
        await axios.get('api/movie/movie/fans/', {
            params: {
                movie: movieId,
                page: page,
                page_size: pagesize,
            },
        }).then(res => {
            setFans(res.data.results);
            setCount(res.data.count);
        });
    }

    useEffect(() => {
        getData();
    }, []);

    const handleInfiniteOnLoad = async page => {
        setLoading(true);
        if (fans.length === count) {
            message.warning('Infinite List loaded all');
            setHasMore(false);
            setLoading(false);
            return;
        }
        await axios.get('api/movie/movie/fans/', {
            params: {
                movie: movieId,
                page: page,
                page_size: pagesize
            }
        }).then(res => {
            let temp = fans;
            let i = (page - 1) * pagesize;
            for (let index = 0; index < res.data.results.length; index++) {
                temp[i] = res.data.results[index];
                i++;
            }
            setFans(temp);
            setLoading(false);
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div>
            <Title level={3} style={{color: "#4c5a67"}}>Likes</Title>
            <div className="infinite-container">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={page}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={!loading && hasMore}
                    useWindow={false}
                >
                    <List
                        itemLayout="vertical"
                        dataSource={fans}
                        size="small"
                        bordered={false}
                        renderItem={item => (
                            <List.Item   style={{borderBottom:"none"}}>
                                <Avatar src={item.fans.profile.avatar}
                                        alt={'fans'}/>
                                <p style={{
                                    display: 'inline',
                                    paddingLeft: '5px',
                                    fontWeight: 'bold',
                                    color: '#dedede'
                                }}>{item.fans.username}</p>
                            </List.Item>
                        )}/>
                    {loading && hasMore && (
                        <div className="loading-container">
                            <Spin/>
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    )
};

export default MovieFansList