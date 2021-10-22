import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Col, Layout, Row, Typography} from "antd";
import moment from 'moment';

const {Title} = Typography;

const EventDetail = (props) => {

    const [event, setEvent] = useState({});

    useEffect(() => {
        const eventID = props.match.params.eventID;
        axios.get(`api/movie/events/${eventID}/`)
            .then(res => {
                setEvent(res.data);
            });
    }, []);


    const startDate = moment(event.start_date).format("MMMM Do YYYY");
    const endDate = moment(event.end_date).format("MMMM Do YYYY");

    return (
        <Layout style={{padding: '40px 0'}}>
            <div style={{
                backgroundImage: `url(${event.poster})`,
                filter: 'blur(50px)',
                backgroundSize: '300%',
                backgroundPosition: 'center',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                height: '600px',
            }}/>
            <Row>
                <Col xxl={{span: 17, offset: 3}}
                     xl={{span: 19, offset: 2}}
                     lg={{span: 19, offset: 2}}
                     md={{span: 21, offset: 1}}
                     sm={{span: 22, offset: 1}}
                     xs={{span: 24, offset: 0}}
                     style={{
                         backgroundColor: 'rgba(249,249,249,0.94)',
                         boxShadow: '0 1px 3px rgba(26,26,26,.1)',
                         borderRadius: '5px',
                     }}>
                    <Row style={{
                        borderColor: 'transparent transparent #CFCFCF transparent',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                    }}
                    >
                        <Col sm={{span: 10, offset: 0}}
                             xs={{span: 24, offset: 0}}>
                            <Row style={{padding: '20px 10px'}}>
                                <Col>
                                    <Title level={4} style={{fontSize: '40px', color: '#6E6E6E'}}>{event.title}</Title>
                                </Col>
                                <Col>
                                    <Title level={4}
                                           style={{fontSize: '20px', color: '#6E6E6E'}}>{startDate}</Title>
                                    <Title level={4}
                                           style={{fontSize: '20px', color: '#6E6E6E'}}> by {event.organizer}</Title>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={{span: 14, offset: 0}}
                             xs={{span: 24, offset: 0}}>
                            <img alt={'event poster'} src={event.poster} width={'100%'}/>
                        </Col>
                    </Row>
                    <Row style={{
                        borderColor: 'transparent transparent #CFCFCF transparent',
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        padding: '20px 30px',
                        backgroundColor: "#fff"
                    }}
                         gutter={[0, {sm: 0, md: 24}]}
                    >
                        <Col>
                            <Row>
                                <Col sm={{span: 8, offset: 0}}
                                     xs={{span: 24, offset: 0}}>
                                    <Title level={1}
                                           style={{fontSize: '20px', color: '#6E6E6E'}}>Date and Time</Title>
                                    <div style={{
                                        fontSize: '15px',
                                        color: '#6E6E6E'
                                    }}>
                                        <p>Start: {startDate}</p>
                                        <p>End: {endDate}</p>
                                        {event.time ? <p>Time: {event.time}</p> : null}

                                    </div>
                                </Col>
                                <Col sm={{span: 16, offset: 0}}
                                     xs={{span: 24, offset: 0}}>
                                    <Title level={1}
                                           style={{fontSize: '20px', color: '#6E6E6E'}}>Location</Title>
                                    <div style={{
                                        fontSize: '15px', color: '#6E6E6E'
                                    }}><a
                                        href={"https://www.google.com/maps/place/" + (event.location)}
                                        target="_blank" rel="noopener noreferrer">
                                        {event.location}
                                    </a>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Title level={1} style={{fontSize: '20px', color: '#6E6E6E'}}>About</Title>
                            <p style={{whiteSpace: 'pre-wrap'}}>{event.content}</p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Layout>
    )
};

export default EventDetail