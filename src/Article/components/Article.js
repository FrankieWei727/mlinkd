import React, {useEffect, useState} from 'react';
import {Col, Icon, List, Row, Skeleton, Affix, Typography} from "antd";
import {Link} from "react-router-dom";
import AvatarFlow from "./AvatarFlow";
import moment from "moment";

const {Paragraph} = Typography;
// const briefLength = 350;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1621723_xyv7nayrgmr.js"
});

const Article = (props) => {


    const [ref] = useState(React.createRef());
    const [isExtractBrief, setIsExtractBrief] = useState(true);
    const [isOnWindows, setIsOnWindows] = useState(false);
    const [style, setStyle] = useState({
        paddingBottom: '5px',
        paddingTop: '12px',
        paddingLeft: "20px",
        paddingRight: "28px",
        lineHeight: "28px",
        backgroundColor: "#fff",
    });
    const [styleButton, setStyleButton] = useState([]);

    function updateSize() {
        setIsOnWindows(ref.current.getBoundingClientRect().top > window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener("scroll", updateSize);
        return () => {
            window.removeEventListener("scroll", updateSize);
        }
    }, []);

    const extractText = HTMLString => {
        let span = document.createElement("span");
        span.innerHTML = HTMLString;
        return span.textContent || span.innerText;
    };

    // const extractBrief = HTMLString => {
    //     const text = extractText(HTMLString);
    //     const text = HTMLString;
    //     if (text.length > briefLength) {
    //         return text.slice(0, briefLength) + "……";
    //     }
    //     return text;
    // };

    const SetTextState = () => {
        setIsExtractBrief(!isExtractBrief);
    };

    const handleAffix = (value) => {
        if (value === false) {
            setStyle({
                paddingBottom: '5px',
                paddingTop: '12px',
                paddingLeft: "20px",
                paddingRight: "28px",
                lineHeight: "28px",
                backgroundColor: "#fff",
            });
        } else {
            setStyle({
                alignItems: 'center',
                clear: 'both',
                boxShadow: '0 -1px 3px rgba(26,26,26,.1)',
                animation: 'slideInUp .2s',
                paddingBottom: '5px',
                paddingTop: '12px',
                paddingLeft: "20px",
                paddingRight: "28px",
                lineHeight: "28px",
                backgroundColor: "#fff",
                bottom: 0,
            });
        }

    };

    const onMouseEnter = () => {
        setStyleButton({color: "#1890ff"});
    };

    const onMouseLeave = () => {
        setStyleButton({color: "none"});
    };

    return (
        <Skeleton loading={props.item.loading} active>
            <List.Item style={{paddingBottom: "0px"}}>
                <div
                    ref={ref}
                    style={
                        props.item.originality === "Y"
                            ? {
                                borderLeft: "8px solid",
                                borderColor: "#269f42",
                                paddingLeft: "15px"
                            }
                            : {}
                    }>
                    <Link to={"/article/" + props.item.id}>
                        <h3 style={{
                            color: "#1a1a1a",
                            fontWeight: "600",
                            fontSize: "18px",
                            fontStretch: "100%",
                            padding: '0 20px',
                            paddingBottom: '5px'
                        }}
                        >
                            {props.item.title}
                        </h3>
                    </Link>
                    <Skeleton avatar title={false} loading={props.item.loading} active>
                        <Row style={{paddingTop: '10px', padding: '0 20px'}} justify="start">
                            <Col span={21}>
                                <List.Item.Meta
                                    title={
                                        <Link
                                            to={
                                                (props.item.author && (props.item.author.id === props.userId)
                                                    ? "/profile/"
                                                    : "/visit/profile/" + props.item.author.id)
                                            }
                                        >
                                            <div>
                                                {props.item.author && props.item.author.username}
                                                {(props.item.author &&
                                                    props.item.author.profile.permission) ===
                                                "reviewed" ? (
                                                    <IconFont
                                                        type="iconbadge"
                                                        style={{paddingLeft: "10px"}}
                                                    />
                                                ) : null}
                                            </div>
                                        </Link>
                                    }
                                    avatar={<AvatarFlow kwy={'avatarFlow'} author={props.item.author}
                                                        userId={props.userId}/>}
                                />
                            </Col>
                            <Col xs={22} sm={3} style={{marginBottom: '5px'}}>
                                {props.item.created && moment(moment(props.item.created).format('YYYY-MM-DD HH:mm:ss'), "YYYY-MM-DD HH:mm:ss").fromNow()}
                            </Col>
                        </Row>
                        <div style={{color: "#646464", fontSize: "15px"}}>
                            {isExtractBrief ?
                                <div style={{padding: '0 20px'}}>
                                    <Paragraph ellipsis={{rows: 3, expandable: {isExtractBrief}}}
                                               onClick={SetTextState}>
                                        {extractText(props.item.content)}
                                    </Paragraph>
                                    <div style={{width: "100%"}}>
                                        <div style={{paddingTop: '12px', paddingBottom: '5px'}}>
                                            <IconFont style={{color: "#76839b", paddingRight: "5px"}}
                                                      type="iconliulan"/>
                                            {props.item.views}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div style={{padding: '0 20px'}}>
                                        <div className='braft-output-content' style={{overflow: 'auto'}}
                                             dangerouslySetInnerHTML={{__html: props.item.content}}/>
                                        <div style={{
                                            paddingTop: '5vw',
                                            paddingBottom: '1vw',
                                            fontWeight: 'bold',
                                            color: '#373737',
                                        }}>Publish: {moment(props.item.created).format('LL')}
                                        </div>
                                    </div>
                                    {isOnWindows === false ?
                                        <Affix offsetBottom={0} onChange={affixed => handleAffix(affixed)}>
                                            <div style={style}>
                                                <IconFont style={{color: "#76839b", paddingRight: "5px"}}
                                                          type="iconliulan"/>
                                                {props.item.views}
                                                {isExtractBrief === false ?
                                                    <span onClick={SetTextState} style={{float: "right"}}>
                                                    <Icon style={styleButton}
                                                          onMouseEnter={onMouseEnter}
                                                          onMouseLeave={onMouseLeave}
                                                          type="up-circle"/>
                                                </span> :
                                                    null
                                                }
                                            </div>
                                        </Affix> : null}
                                </div>
                            }
                        </div>
                    </Skeleton>
                </div>
            </List.Item>
        </Skeleton>
    )
};

export default Article