import React, {useEffect, useState} from 'react'
import {Row, Col, Layout, Spin, Affix, Typography, BackTop, Statistic} from 'antd'
import axios from 'axios'
import 'braft-editor/dist/output.css'
import moment from "moment";

import AuthorInfo from "../components/AuthorInfo";
import CreateArticleComment from "../components/CreateArticleComment";

const {Paragraph} = Typography;
const {Title} = Typography;

const ArticleDetail = (props) => {

    const [article, setArticle] = useState({});
    const [title, setTitle] = useState('loading...');
    const [loading, setLoading] = useState(true);
    const [deskWidth, setDeskWidth] = useState(0);

    const handleSize = () => {
        setDeskWidth(document.body.clientWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleSize());
        return () => {
            window.removeEventListener('resize', handleSize());
        }
    });

    useEffect(() => {
        getArticle().then()
    }, []);

    async function getArticle() {
        await axios.get(
            "api/comment/articles/" + props.match.params.articleID
        ).then(res => {
            setLoading(false);
            setArticle(res.data);
            setTitle(res.data.title);
        }).catch(err => {
            console.log(err)
        });
    }

    return (
        <Layout style={{backgroundColor: '#fff'}}>
            <BackTop/>
            <Row style={{
                background: '#fff',
                padding: '20px 0',
                marginBottom: '15px',
                boxShadow: '0px 2px 2px #888888'
            }}>
                <Col xxl={{span: 12, offset: 4}}
                     xl={{span: 14, offset: 2}}
                     lg={{span: 14, offset: 2}}
                     md={{span: 14, offset: 1}}
                     xs={{span: 22, offset: 1}}>
                    <div style={{fontSize: '22px', fontWeight: 'bold', color: 'black'}}>
                        <Paragraph ellipsis={{rows: 1, expandable: true}} strong style={{color: 'black'}}>
                            {title}
                        </Paragraph>
                    </div>
                </Col>
                <Col xxl={{span: 4, offset: 0}}
                     xl={{span: 6, offset: 0}}
                     lg={{span: 6, offset: 0}}
                     md={{span: 7, offset: 0}}
                     xs={{span: 22, offset: 1}}
                >
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Statistic title='View' suffix='times' value={article.views}/>
                        <Statistic title='Published date'
                                   value={moment(moment(article.created).format('YYYY-MM-DD HH:mm:ss'), "YYYY-MM-DD HH:mm:ss").fromNow()}/>
                    </div>
                </Col>
            </Row>
            <Row gutter={[{xs: 0, sm: 0, md: 24}, {xs: 16, sm: 16, md: 0}]}>
                <Col
                    xxl={{span: 12, offset: 4}}
                    xl={{span: 14, offset: 2}}
                    lg={{span: 14, offset: 2}}
                    md={{span: 14, offset: 1, order: 1}}
                    xs={{span: 22, offset: 1, order: 2}}>
                    <div>
                        <div style={{fontSize: '16px'}}>
                            <div className='braft-output-content' style={{overflow: 'auto'}}
                                 dangerouslySetInnerHTML={{__html: article.content}}/>
                        </div>
                        <div
                            style={{
                                paddingTop: '5vw',
                                paddingBottom: '1vw',
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                color: '#373737'
                            }}>Publish: {moment(article.created).format('LL')}
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Spin spinning={loading} size='large' tip='loading...'/>
                        </div>
                        <div>
                            <Title level={4} style={{paddingTop: '50px'}}>Comment</Title>
                            <CreateArticleComment articleId={props.match.params.articleID} articleUrl={article.url}/>
                        </div>
                    </div>
                </Col>
                <Col
                    xxl={{span: 4, offset: 0}}
                    xl={{span: 6, offset: 0}}
                    lg={{span: 6, offset: 0}}
                    md={{span: 7, offset: 0, order: 2}}
                    xs={{span: 22, offset: 1, order: 1}}
                >
                    {deskWidth > 500 && Object.keys(article).length > 0 ?
                        <Affix offsetTop={100}>
                            <AuthorInfo style={{paddingTop: '60px'}} authorId={article.author.id}/>
                        </Affix>
                        : null}
                </Col>
            </Row>
        </Layout>
    )
};

export default ArticleDetail
