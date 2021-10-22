import React, {Component} from "react";
import {Avatar, Popover, Tag} from "antd";
import {Link} from "react-router-dom";

const Content = (props) => (
    <div style={{display: "flex", flexDirection: "column", width: "360px"}}>
        <div
            style={{
                backgroundImage: `url(${props.author.profile.cover})`,
                backgroundSize: "cover",
                height: "100px"
            }}
        />
        <div style={{display: "flex"}}>
            <Avatar
                icon="user"
                shape="square"
                size={72}
                src={props.author.profile.avatar}
                style={{marginTop: "-24px", marginLeft: "30px", border: '3px solid white'}}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "12px",
                    marginTop: "2px"
                }}
            >
                <div
                    style={{
                        fontWeight: "bolder",
                        fontSize: "18px"
                    }}
                >
                    {props.author.username}
                </div>
                <div>
                    {props.author.profile.bio &&
                    props.author.profile.bio.slice(0, 14) + "..."}
                </div>
            </div>
        </div>
        <div style={{padding: "20px 30px"}}>
            {props.author.profile.profession && (
                <Tag color="#f50" style={{height: "26px", fontSize: "16px"}}>
                    {props.author.profile.profession}
                </Tag>
            )}
        </div>
    </div>
);

class AvatarFlow extends Component {
    state = {
        follow: false,
        loading: false
    };

    render() {
        return (
            <Popover
                content={<Content {...this.props}/>}
                trigger="hover"
                placement="topLeft"
            >
                <div>
                    <Link
                        to={
                            (this.props.author.id === this.props.userId
                                ? "/profile"
                                : "/visit/profile/" + this.props.author.id)
                        }
                    >
                        <Avatar
                            shape="square"
                            icon="user"
                            src={this.props.author && this.props.author.profile.avatar}
                        />
                    </Link>
                </div>
            </Popover>
        );
    }
}

export default AvatarFlow;
