import React from "react";
import {Layout} from 'antd';
import AdminHeaderContainer from "./AdminHeaderContainer";
import AdminSider from "./AdminSiderContainer";
import MovieDataAdmin from "../components/MovieAdmin";

const {Content} = Layout;

class AdminLayout extends React.Component {


    state = {
        collapsed: false,
        key: null,
    };

    getValue = (v) => {
        this.setState({
            collapsed: v
        })
    };

    getKey = (v) => {
        this.setState({
            key: v
        });
    };


    render() {
        return (
            <Layout style={{minHeight: '100vh'}}>
                <AdminSider collapsed={this.state.collapsed} handleValue={this.getKey.bind(this)}/>
                <Layout>
                    <AdminHeaderContainer handleValue={this.getValue.bind(this)}/>
                    <Content className="fade"
                             style={{
                                 padding: 24,
                                 background: '#fff',
                             }}
                    >
                        {(() => {
                            switch (this.state.key) {
                                case "1":
                                    return <MovieDataAdmin/>;
                                case "green":
                                    return "#00FF00";
                                case "blue":
                                    return "#0000FF";
                                default:
                                    return "#FFFFFF";
                            }
                        })()}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}


export default AdminLayout