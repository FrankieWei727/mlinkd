import React, {useEffect, useState} from "react";
import {List, Button, Icon, Input} from "antd";
import axios from "axios";
import Article from "./Article";

const pagesize = 8;
let page = 1;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1621723_xyv7nayrgmr.js"
});
const {Search} = Input;
const token = window.localStorage.getItem('token');

const SubscriptionArticleList = () => {

    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState("");
    const [count, setCount] = useState(0);

    useEffect(() => {
        getUserData().then();
        setInitLoading(false);
    }, []);

    async function getUserData() {
        if (token !== null) {
            await axios.get(
                'rest-auth/user/',
                {headers: {'Authorization': 'Token ' + token}}
            ).then(res => {
                setUser(res.data);
                getFollowingData(res.data.id).then()
            }).catch(err => {
                console.log(err)
            });
        }
    }

    async function getFollowingData(id) {
        if (token !== null) {
            await axios.get(
                'api/account/user/my/followers/?format=json', {
                    params: {
                        follower: id,
                    }
                }).then(res => {
                const temp = [];
                for (let index = 0; index < res.data.length; index++) {
                    temp[index] = res.data[index].user.id
                }
                setFollowingIds(temp.join(','));
                getArticleData(temp.join(',')).then();
            }).catch(err => {
                console.log(err)
            });
        }
    }

    const getArticleData = async (ids) => {
        await axios.get(
            "api/comment/following_articles/", {
                params: {
                    id: ids,
                    page: page,
                    page_size: pagesize
                }
            }
        ).then(res => {
            setCount(res.data.count);
            setData(res.data.results);
        }).catch(err => {
            console.log(err);
        })

    };

    const onLoadMore = async () => {
        await setLoading(true);
        await setData(data.concat(
            [...new Array(pagesize)].map(() => ({loading: true, name: {}}))));
        page = page + 1;
        await axios.get(
            "api/comment/following_articles/", {
                params: {
                    id: followingIds,
                    page: page,
                    page_size: pagesize
                }
            }).then(res => {
            setData(data.concat(res.data.results));
            setLoading(false);
            window.dispatchEvent(new window.Event("resize"));
        }).catch(err => {
            console.log(err);
        });
    };

    const onSearch = async value => {
        setInitLoading(true);
        page = 1;
        await axios.get(
            "api/comment/articles/?format=json", {
                params: {
                    page: page,
                    page_size: pagesize,
                    search: value,
                }
            }).then(res => {
            setData(res.data.results);
            setCount(res.data.count);
            setInitLoading(false);
        }).catch(err => {
            console.log(err);
        });
    };

    const loadMore =
        !initLoading && !loading && (data.length !== count) ? (
            <div
                style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 50,
                    lineHeight: "32px"
                }}
            >
                {data.length > 0 && (
                    <Button onClick={onLoadMore}>
                        <IconFont type="icon-more1-copy-copy"/>
                        Load More
                    </Button>
                )}
            </div>
        ) : null;

    return (
        <div>
            <Search
                placeholder="Please input keywords"
                onSearch={value => onSearch(value)}
                enterButton
                style={{padding: '0 20px', paddingTop: '10px'}}
            />
            {loading === false ?
                <List
                    itemLayout="vertical"
                    dataSource={data}
                    loadMore={loadMore}
                    loading={initLoading}
                    renderItem={item => (
                        <Article item={item} userId={user.id} key={'Following_Article_item' + item.id}/>
                    )}/> :
                null
            }
        </div>
    )
};

export default SubscriptionArticleList;
