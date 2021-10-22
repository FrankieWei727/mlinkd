import React, {Component} from "react";
import {
    List,
    Button,
    Skeleton,
    message,
    Avatar,
    Modal,
    Icon,
    Dropdown,
    Menu,
    Tag
} from "antd";
import axios from "axios";
import {Link} from "react-router-dom";
import moment from "moment";

const count = 3;
const confirm = Modal.confirm;
const briefLength = 200;
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1621723_9cj9xgq951n.js"
});


class MyArticleList extends Component {
    state = {
        data: [],
        cache: [],
        loading: false,
        initLoading: true,
        page: 1,
        next: "",
        status: 1,
        number: 0
    };

    my(list, key, status) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === key) {
                list[i].status = status;
            }
        }
        return list;
    }

    onClick = async (key, status, title) => {
        if (status === "2") {
            try {
                let url = "api/comment/my_articles/" + key;
                let config = {
                    headers: {
                        Authorization: "Token " + window.localStorage.getItem("token")
                    }
                };
                await axios.patch(url, {status: "1"}, config);
                const temp = this.state.cache;
                this.my(temp, key, "1");
                this.setState({
                    cache: temp
                });
                message.success(title + " is putting in draft box successfully");
            } catch (error) {
            }
        }
        if (status === "1") {
            try {
                let url = "api/comment/my_articles/" + key;
                let config = {
                    headers: {
                        Authorization: "Token " + window.localStorage.getItem("token")
                    }
                };
                await axios.patch(url, {status: "2"}, config);
                const temp = this.state.cache;
                this.my(temp, key, "2");
                this.setState({
                    cache: temp
                });
                message.success(title + " is published successfully");
            } catch (error) {
            }
        }
    };

    componentDidMount = async v => {
        await this.getArticleData();
        this.setState(function (state) {
            return {initLoading: false};
        });
    };

    extractText = HTMLString => {
        var span = document.createElement("span");
        span.innerHTML = HTMLString;
        return span.textContent || span.innerText;
    };

    extractBrief = HTMLString => {
        const text = this.extractText(HTMLString);
        if (text.length > briefLength) {
            return text.slice(0, briefLength) + "……";
        }
        return text;
    };

    getArticleData = async v => {
        try {
            let config = {
                headers: {
                    Authorization: "Token " + window.localStorage.getItem("token")
                }
            };
            const response = await axios.get(
                "api/comment/my_articles/?format=json" +
                "&page=" +
                this.state.page +
                "&page_size=" +
                count,
                config
            );
            this.setState(function (state) {
                return {
                    data: response.data.results,
                    cache: response.data.results,
                    next: response.data.next,
                    number: response.data.count
                };
            });
        } catch (error) {
            console.log(error);
        }
    };

    onLoadMore = async v => {
        await this.setState({
            loading: true,
            cache: this.state.data.concat(
                [...new Array(count)].map(() => ({loading: true, name: {}}))
            )
        });
        try {
            this.state.page = this.state.page + 1;
            let config = {
                headers: {
                    Authorization: "Token " + window.localStorage.getItem("token")
                }
            };
            const response = await axios.get(
                "api/comment/my_articles/?format=json" +
                "&page=" +
                this.state.page +
                "&page_size=" +
                count,
                config
            );
            this.setState({
                next: response.data.next
            });
            const temp1 = this.state.data;
            if (response.status === 200) {
                const temp = this.state.data.concat(response.data.results);
                this.setState({data: temp, cache: temp, loading: false}, () => {
                    window.dispatchEvent(new window.Event("resize"));
                });
            } else {
                this.setState({
                    cache: temp1
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    deleteArticle = async id => {
        try {
            confirm({
                title: "Delete!",
                content: "Are you sure you want to delete this article？",
                onOk: async () => {
                    let config = {
                        headers: {
                            Authorization: "Token " + window.localStorage.getItem("token")
                        }
                    };
                    const response = await axios.delete(
                        "api/comment/my_articles/" + id,
                        config
                    );
                    if (response.status === 204) {
                        message.success("Delete successfully.");
                        this.setState(function (state) {
                            return {cache: state.cache.filter(article => article.id !== id)};
                        });
                    } else {
                        message.error("Delete unsuccessfully.");
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const {initLoading, loading, cache, next} = this.state;
        const loadMore =
            !initLoading && !loading && next ? (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 12,
                        height: 32,
                        lineHeight: "32px"
                    }}
                >
                    {this.state.cache.length > 0 && (
                        <Button onClick={this.onLoadMore}>Load More</Button>
                    )}
                </div>
            ) : null;

        return (
            <div className="queue-demo">
                <div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "start",
                            marginBottom: "10px"
                        }}
                    >
                        <div style={{marginRight: "20px", fontWeight: "bold"}}>
                            <Tag color="#108ee9">Articles</Tag>
                            {this.state.number}
                        </div>
                    </div>
                    <List
                        itemLayout="vertical"
                        dataSource={cache}
                        size="small"
                        loadMore={loadMore}
                        loading={initLoading}
                        style={{paddingBottom: "20px"}}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Link to={"/article/revise/" + item.id}>
                                        <Button
                                            style={{
                                                padding: '0 0',
                                                color: "#76839b",
                                                backgroundColor: "transparent",
                                                display: "inline-block",
                                                fontSize: "14px",
                                                fontWeight: "500"
                                            }}
                                            type="link"
                                        >
                                            {" "}
                                            <IconFont
                                                type="iconbianji"
                                                style={{paddingLeft: "5px", color: "#76839b"}}
                                            />{" "}
                                            Edit{" "}
                                        </Button>
                                    </Link>,
                                    <Button
                                        style={{
                                            padding: '0 0',
                                            color: "#76839b",
                                            backgroundColor: "transparent",
                                            display: "iconshanchu1",
                                            fontSize: "14px",
                                            fontWeight: "500"
                                        }}
                                        type="link"
                                        onClick={() => this.deleteArticle(item.id)}
                                    >
                                        <IconFont
                                            type="iconshanchu1"
                                            style={{paddingLeft: "5px", color: "#76839b"}}
                                        />{" "}
                                        Delete{" "}
                                    </Button>,
                                    <Dropdown
                                        overlay={
                                            <Menu
                                                onClick={this.onClick.bind(
                                                    this,
                                                    item.id,
                                                    item.status,
                                                    item.title
                                                )}
                                            >
                                                <Menu.Item
                                                    key="1"
                                                    disabled={item.status === "2"}
                                                    style={{
                                                        fontWeight: "600",
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    {"Publish"}
                                                </Menu.Item>
                                                <Menu.Item
                                                    key="2"
                                                    disabled={item.status === "1"}
                                                    style={{
                                                        fontWeight: "600",
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    {"Draft"}
                                                </Menu.Item>
                                            </Menu>
                                        }
                                        trigger={["click"]}
                                        placement="bottomCenter"
                                    >
                                        <Button
                                            style={{
                                                padding: '0 0',
                                                color: "#76839b",
                                                backgroundColor: "transparent",
                                                display: "inline-block",
                                                fontSize: "14px",
                                                fontWeight: "500"
                                            }}
                                            type="link"
                                        >
                                            <IconFont
                                                type={
                                                    item.status === "2" ? "iconfabu" : "iconcaogao"
                                                }
                                                style={{paddingLeft: "5px", color: "#76839b"}}
                                            />{" "}
                                            {item.status === "2" ? "Published" : "Draft"}{" "}
                                        </Button>
                                    </Dropdown>
                                ]}
                            >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        title={
                                            <div>
                                                {item.author && item.author.username}
                                                {(item.author &&
                                                    item.author.profile.permission) ===
                                                "reviewed" ? (
                                                    <IconFont
                                                        type="iconbadge"
                                                        style={{paddingLeft: "10px"}}
                                                    />
                                                ) : null}
                                            </div>
                                        }
                                        avatar={
                                            <Avatar
                                                shape="square"
                                                icon="user"
                                                src={item.author && item.author.profile.avatar}
                                            />
                                        }
                                        description={
                                            item.created && moment(moment(item.created).format('YYYY-MM-DD HH:mm:ss'), "YYYY-MM-DD HH:mm:ss").fromNow()
                                        }
                                    />
                                    <Link to={"/article/" + item.id}>
                                        <h3
                                            style={{
                                                color: "#1a1a1a",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                fontStretch: "100%"
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                        <div style={{color: "#646464", fontSize: "15px"}}>
                                            {this.extractBrief(item.content)}
                                        </div>
                                    </Link>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default MyArticleList;
