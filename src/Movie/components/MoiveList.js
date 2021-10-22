import React from 'react';
import {Descriptions, List, Tag} from "antd";
import {Link} from "react-router-dom";
import moment from "moment";


const MovieItemList = (props) => {

    return (
        <div>
            <List
                itemLayout="vertical"
                loading={props.loading}
                grid={{gutter: 28, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1}}
                pagination={{
                    current: props.page,
                    pageSize: props.pagesize,
                    total: props.count,
                    showQuickJumper: true,
                    onChange: props.handleChange,
                    size: "small",
                    position: "top",
                    style: {
                        paddingBottom: "10px"
                    }
                }}
                size="large"
                dataSource={props.data}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <div style={{
                            padding: "20px",
                            background: "#fff",
                            borderRadius: "15px",
                            boxShadow: "0 1px 3px #777777"
                        }}>
                            <Link to={"/movie/" + item.id}>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <div style={{
                                            fontSize: "18px",
                                            color: "#3377aa",
                                            marginBottom: "15px",
                                            fontWeight: "600"
                                        }}>
                                            {item.title} ({moment(item.release_date).format('YYYY')})
                                        </div>
                                        <Descriptions border column={1}>
                                            <Descriptions.Item label="Runtime">
                                                {item.runtime} min
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Region">
                                                {item.countries}
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <div style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            margin: "10px 0"
                                        }}>
                                            {item.categories &&
                                            item.categories.map(tag => (
                                                <Tag
                                                    key={tag.name}
                                                    color="#343a40"
                                                    style={{color: "white", marginRight: "5px"}}
                                                >
                                                    {tag.name}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                    <img
                                        alt={item.title}
                                        src={item.poster}
                                        style={{
                                            width: "135px",
                                            maxHeight: "200px",
                                            border: "2px solid #343a40",
                                            borderRadius: "8px"
                                        }}
                                    />
                                </div>
                            </Link>
                            <div style={{fontSize: "14px", color: "grey", paddingTop: "5px"}}>
                                {item.description && item.description.slice(0, 250) + "......"}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
};

export default MovieItemList