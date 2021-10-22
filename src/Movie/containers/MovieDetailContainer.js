import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Layout, Row, Col, Descriptions, Tag, Typography, List, BackTop, Divider} from 'antd'
import AddMovieReview from "../components/AddMovieReview";
import moment from "moment";
import MovieLike from "../components/MovieLike";
import MovieFansList from "../components/MovieFansList";
import PhotoGallery from "../components/PhotoGallery";

const {Title} = Typography;


const MovieDetail = (props) => {

    const [movie, setMovie] = useState({});
    const [fans, setFans] = useState(0);

    useEffect(() => {
        const movieID = props.match.params.movieID;
        axios.get(`api/movie/movies/${movieID}/?format=json`)
            .then(res => {
                setMovie(res.data);
            }).catch(err => {
            console.log(err)
        });
        axios.get('api/movie/movie/fans/', {
            params: {
                movie: movieID,
            },
        }).then(res => {
            setFans(res.data.count);
        });
    }, []);


    return (
        <Layout style={{backgroundColor: "#0c151d"}}>
            <BackTop/>
            {movie.stills && movie.stills.length > 0 && (
                <PhotoGallery key={'PhotosItemList'} data={movie.stills} title='Photos'/>
            )}
            <div>
                <Row>
                    <Col xxl={{span: 7}}
                         xl={{span: 6}}
                         lg={{span: 6}}
                         md={{span: 8}}
                         sm={{span: 24}}>
                        <div style={{padding: "20px 30px"}}>
                            <img src={movie.poster}
                                 alt={movie.title}
                                 style={{
                                     borderTopLeftRadius: "10px",
                                     borderTopRightRadius: "10px",
                                     position: "relative",
                                     width: "100%",
                                     height: "auto",
                                 }}
                            />
                            <div style={{
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                                width: "100%",
                                height: "50px",
                                backgroundColor: "#222930",
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <div style={{float: "right"}}>
                                    <MovieLike movieId={props.match.params.movieID} key={'movie_like_action'}/>
                                </div>
                            </div>
                            <Divider/>
                            <div>
                                <Descriptions layout="horizontal" column={1} className="movie-left-list">
                                    <Descriptions.Item label="RATING">{movie.user_rating}/5.00</Descriptions.Item>
                                    <Descriptions.Item label="RUNTIME">{movie.runtime} min</Descriptions.Item>
                                    <Descriptions.Item label="GENRES">
                                        {movie.categories &&
                                        movie.categories.map(tag => (
                                            <Tag key={tag.name} color='#fff' style={{margin: '5px'}}>
                                                <div style={{color: '#000'}}>
                                                    {tag.name}
                                                </div>
                                            </Tag>
                                        ))}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="VIEWS">{movie.amount_reviews}</Descriptions.Item>
                                    <Descriptions.Item label="LIKES">{fans}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        </div>
                    </Col>
                    <Col xxl={{span: 14}}
                         xl={{span: 18}}
                         lg={{span: 18}}
                         md={{span: 16}}
                         sm={{span: 24}}>
                        <Row style={{padding: "20px 30px"}} gutter={[0, {xs: 16, sm: 16, md: 16}]}>
                            <Col>
                                <Title level={2} className="movie-label"
                                       style={{color: "#fff"}}>{movie.title}</Title>
                                <Descriptions column={1} className="movie-right-list">
                                    <Descriptions.Item
                                        label="Release Date">{moment(movie.release_date).format('YYYY-MM')}</Descriptions.Item>
                                    <Descriptions.Item label="Region">{movie.countries}</Descriptions.Item>
                                    {movie.languages ? <Descriptions.Item
                                        label="Language">{movie.languages}</Descriptions.Item> : null}
                                    <Descriptions.Item label="Directors">{movie.directors}</Descriptions.Item>
                                    {movie.scriptwriters ?
                                        <Descriptions.Item
                                            label="Writers">{movie.scriptwriters}</Descriptions.Item> : null}
                                    <Descriptions.Item label="Actors">{movie.actors}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                            <Col>
                                <Title level={3} style={{color: "#4c5a67"}}>VIDEOS: TRAILERS</Title>
                                <div>
                                    <iframe
                                        title="Movie Trailer"
                                        src={movie.trailer}
                                        width="100%"
                                        height="500px"
                                        scrolling="no"
                                        frameBorder="0"
                                    />
                                </div>
                            </Col>
                            <Col>
                                <Title level={3} style={{color: "#4c5a67"}}>SYNOPSIS</Title>
                                <span style={{color: "#fff"}}>{movie.description}</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <Divider style={{width: "94%", minWidth: "60%", marginLeft: "30px", marginRight: "30px"}}/>
            <Row style={{padding: "20px 30px"}}>
                <Col
                    xxl={{span: 7, offset: 0}}
                    xl={{span: 7, offset: 0}}
                    lg={{span: 7, offset: 0}}
                    md={{span: 7, offset: 0}}
                    sm={{span: 24, offset: 0}}
                    xs={{span: 24, offset: 0}}>
                    <div style={{paddingRight: "10px"}}>
                        <MovieFansList movieId={props.match.params.movieID} key={'movie_fans_list'}/>
                    </div>
                </Col>
                <Col xxl={{span: 14, offset: 0}}
                     xl={{span: 14, offset: 0}}
                     lg={{span: 14, offset: 0}}
                     md={{span: 14, offset: 0}}
                     sm={{span: 24, offset: 0}}
                     xs={{span: 24, offset: 0}}>
                    <Row gutter={[0, 24]}>
                        <Col span={24}>
                            {movie.videos && (movie.videos.length !== 0) && (
                                <div>
                                    <Title level={3} style={{color: "#4c5a67"}}>Play lists</Title>
                                    <div>
                                        <List
                                            size="small"
                                            bordered={false}
                                            split={false}
                                            dataSource={movie.videos}
                                            renderItem={item =>
                                                <List.Item>
                                                    <a key={item.url} href={item.url} target="_blank"
                                                       rel="noreferrer noopener">
                                                        {item.website}
                                                    </a>
                                                </List.Item>}
                                        />
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col>
                            <div>
                                <Title level={3} style={{color: "#4c5a67"}}>Movie Review</Title>
                                <AddMovieReview
                                    key={'AddMovieReview'}
                                    movieId={movie.id}
                                    movieUrl={movie.url}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
};

export default MovieDetail;