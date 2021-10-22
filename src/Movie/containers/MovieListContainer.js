import React, {useEffect, useState} from 'react';
import axios from 'axios';
import qs from 'qs'
import {
    Layout,
    Row,
    Col,
    Typography,
    BackTop,
    Input,
} from "antd";
import MovieItemList from "../components/MoiveList";
import Tags from "../components/Tags";

const pagesize = 10;
const {Title} = Typography;
const {Search} = Input;
const tips = ["All", "Result"];

const MovieList = () => {


    const [page, setPage] = useState(window.sessionStorage.getItem('movieListData')
        ? JSON.parse(window.sessionStorage.getItem('movieListData')).page : 1);
    const [movies, setMovies] = useState([]);
    const [count, setCount] = useState(0);
    const [tip, setTip] = useState(tips[0]);
    const [search, setSearch] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setsSearchLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState(window.sessionStorage.getItem('movieListData') ?
        JSON.parse(window.sessionStorage.getItem('movieListData')).selectedTags : []);
    const [selectedCountry, setSelectedCountry] = useState(window.sessionStorage.getItem('movieListData') ?
        JSON.parse(window.sessionStorage.getItem('movieListData')).selectedCountry : []);

    function getTagsData() {
        axios.get("api/movie/categories_group/?format=json")
            .then(res => {
                setTags(res.data);
            }).catch(err => {
            console.log(err)
        });
    }

    function getData(nextSelectedTags, value, nextSelectedCountry) {
        setLoading(true);
        let initialPage = page;
        if (nextSelectedTags || nextSelectedCountry) {
            initialPage = 1;
            setPage(1);
        }
        let params = {};
        // console.log(nextSelectedCountry,selectedCountry);
        // console.log(nextSelectedTags,selectedTags);
        if (nextSelectedTags !== undefined) {
            params = {
                page: initialPage,
                page_size: pagesize,
                title: value,
                categories: nextSelectedTags,
                countries: nextSelectedCountry,
            }
        }
        if (nextSelectedTags === undefined && selectedTags.length > 0) {
            params = {
                page: initialPage,
                page_size: pagesize,
                title: value,
                categories: selectedTags,
                countries: selectedCountry,
            }
        }
        if (nextSelectedCountry === undefined && selectedCountry.length > 0) {
            params = {
                page: initialPage,
                page_size: pagesize,
                title: value,
                categories: selectedTags,
                countries: selectedCountry,
            }
        }
        axios.get(
            "api/movie/movies/?format=json", {
                params,
                paramsSerializer: params => {
                    return qs.stringify(params, {arrayFormat: 'repeat'})
                }
            }).then(res => {
            setLoading(false);
            setsSearchLoading(false);
            setMovies(res.data.results);
            setCount(res.data.count);
        }).catch(err => {
            console.log(err)
        });
    }

    const [deskWidth, setDeskWidth] = useState(0);

    const handleSize = () => {
        setDeskWidth(document.body.clientWidth);
    };


    useEffect(() => {
        if (!loading) {
            let movieListData = {
                page: page,
                selectedTags: selectedTags,
                selectedCountry: selectedCountry
            };
            window.sessionStorage.setItem('movieListData', JSON.stringify(movieListData));
        } else {
            window.sessionStorage.removeItem('movieListData');
        }
    });

    useEffect(() => {
        window.addEventListener('resize', handleSize());
        return () => {
            window.removeEventListener('resize', handleSize());
        };
    });

    useEffect(() => {
        getData();
        getTagsData();
    }, []);


    const handleMovie = async currentPage => {
        setLoading(true);
        setPage(currentPage);
        await axios.get("api/movie/movies/?format=json", {
            params: {
                page: currentPage,
                page_size: pagesize,
                title: search,
                category: selectedTags,
            }, paramsSerializer: params => {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then(res => {
            setMovies(res.data.results);
            setLoading(false);
        }).catch(err => {
            console.log(err)
        });

    };


    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        setSelectedTags(nextSelectedTags);
        getData(nextSelectedTags, null, selectedCountry);
    };

    const handleCountryChange = (Country, checked) => {
        const nextSelectedCountry = checked ? [...selectedCountry, Country] : selectedCountry.filter(t => t !== Country);
        setSelectedCountry(nextSelectedCountry);
        getData(selectedTags, null, nextSelectedCountry);
    };

    const onSearch = value => {
        setSearch(value);
        setsSearchLoading(true);
        getData(null, value, null);
        setTip(tips[1] + " : ");
    };

    return (
        <Layout style={{backgroundColor: "#DEDEDE"}}>
            <BackTop/>
            <div style={{flex: "1 0 ", paddingBottom: "30px"}}>
                <Row style={{padding: "15px 0"}}>
                    <Col xxl={{span: 18, offset: 3}}
                         xl={{span: 20, offset: 2}}
                         lg={{span: 20, offset: 2}}
                         md={{span: 22, offset: 1}}
                         sm={{span: 22, offset: 1}}
                         xs={{span: 22, offset: 1}}>
                        <div style={{
                            padding: "5px 20px",
                            backgroundColor: "#767676",
                            borderRadius: "5px",
                            display: "flex",
                        }}>
                            <Title
                                level={4}
                                style={{
                                    margin: "0 0",
                                    color: "#ffffff",
                                    fontSize: (deskWidth > 600 ? "18px" : "10px"),
                                }}
                            >{tip} {count} movies
                            </Title>
                            <Search
                                style={{width: "70%", paddingLeft: "10px"}}
                                placeholder="Please enter keywords"
                                onSearch={value => onSearch(value)}
                                loading={searchLoading}
                            />
                        </div>
                    </Col>
                </Row>
                <Row type="flex" gutter={[24, 16]}>
                    <Col xxl={{span: 13, offset: 3}}
                         xl={{span: 14, offset: 2}}
                         lg={{span: 14, offset: 2}}
                         md={{span: 14, offset: 1}}
                         sm={{span: 14, offset: 1, order: 1}}
                         xs={{span: 22, offset: 1, order: 2}}
                    >
                        <MovieItemList
                            key={'MovieItemList'}
                            data={movies}
                            loading={loading}
                            count={count}
                            handleChange={handleMovie}
                            pagesize={pagesize}
                            page={page}
                        />
                    </Col>
                    <Col xxl={{span: 5, offset: 0}}
                         xl={{span: 6, offset: 0}}
                         lg={{span: 6, offset: 0}}
                         md={{span: 8, offset: 0}}
                         sm={{span: 8, offset: 0, order: 2}}
                         xs={{span: 22, offset: 1, order: 1}}>
                        <Row>
                            <Col>
                                <Tags
                                    key={'TagsItemList'}
                                    data={tags}
                                    selectedTags={selectedTags}
                                    selectedCountry={selectedCountry}
                                    handleChange={handleChange}
                                    handleCountryChange={handleCountryChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default MovieList;