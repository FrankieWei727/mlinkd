import React, {useEffect, useState} from "react";
import {List, Button, Icon, Input} from "antd";
import axios from "axios";
import Article from "./Article";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1621723_ty96unu397.js"
});
const {Search} = Input;
const pagesize = 5;

const ArticleList = () => {

    const [scrollTop, setScrollTop] = useState(window.sessionStorage.getItem('articleListData')
        ? JSON.parse(window.sessionStorage.getItem('articleListData')).scrollTop : 0);
    const [page, setPage] = useState(window.sessionStorage.getItem('articleListData')
        ? JSON.parse(window.sessionStorage.getItem('articleListData')).page : 1);
    const [data, setData] = useState([]);
    const [cache, setCache] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [id, setId] = useState(null);
    const [count, setCount] = useState(0);

    async function getUserData() {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            await axios.get('rest-auth/user/',
                {headers: {'Authorization': 'Token ' + token}}
            ).then(res => {
                setId(res.data.id);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    async function getArticleData() {
        await axios.get(
            "api/comment/articles/?format=json", {
                params: {
                    page: (window.sessionStorage.getItem('articleListData') ? (JSON.parse(window.sessionStorage.getItem('articleListData')).page === 1 ? page : 1) : 1),
                    page_size: (window.sessionStorage.getItem('articleListData') ? (JSON.parse(window.sessionStorage.getItem('articleListData')).page === 1 ? pagesize
                        : JSON.parse(window.sessionStorage.getItem('articleListData')).page * pagesize) : pagesize),
                }
            }
        ).then(res => {
            setCount(res.data.count);
            setData(res.data.results);
            setCache(res.data.results);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getArticleData().then();
        getUserData().then();
        setInitLoading(false);
    }, []);

    const bindHandleScroll = (event) => {
        // 滚动的高度
        const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false) || window.pageYOffset
            || (event.srcElement ? event.srcElement.body.scrollTop : 0);
        setScrollTop(scrollTop);
    };


    useEffect(() => {
        window.scrollTo(0, scrollTop)
    }, []);

    useEffect(() => {
        if (!loading) {
            let articleListData = {page: page, scrollTop: scrollTop};
            window.sessionStorage.setItem('articleListData', JSON.stringify(articleListData));
        } else {
            window.sessionStorage.removeItem('articleListData');
        }
    });

    useEffect(() => {
        window.addEventListener('scroll', bindHandleScroll);
        return () => {
            window.removeEventListener('scroll', bindHandleScroll);
        }
    });

    const onLoadMore = async () => {
        await setLoading(true);
        await setCache(data.concat([...new Array(pagesize)].map(() => (
            {loading: true, id: "", author: "",}))));

        let currentPage = page + 1;
        setPage(currentPage);

        if (cache.length === count) {
            setLoading(false);
        }
        await axios.get(
            "api/comment/articles/?format=json", {
                params: {
                    page: currentPage,
                    page_size: pagesize,
                }
            }
        ).then(res => {
            setData(data.concat(res.data.results));
            setCache(data.concat(res.data.results));
            setLoading(false);
            window.dispatchEvent(new Event("resize"));
        });
    };

    const onSearch = async value => {
        setInitLoading(true);
        setPage(1);
        await axios.get(
            "api/comment/articles/?format=json", {
                params: {
                    page: 1,
                    page_size: pagesize,
                    search: value,
                }
            }).then(res => {
            setData(res.data.results);
            setCache(res.data.results);
            setCount(res.data.count);
            setInitLoading(false);
        }).catch(err => {
            console.log(err);
        })
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
                <Button onClick={onLoadMore}>
                    <IconFont type="iconloading"/>
                    Load More
                </Button>
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
            <List
                itemLayout="vertical"
                dataSource={cache}
                loadMore={loadMore}
                loading={initLoading}
                renderItem={item => (
                    <Article item={item} userId={id} key={'Article_item' + item.id}/>
                )}/>

        </div>
    );
};

export default ArticleList;
