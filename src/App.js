import React from 'react';
import BaseRouter from "./routes";
import {Layout} from 'antd';
import {BrowserRouter as Router} from "react-router-dom";
import HomeFooter from "./Home/containers/FooterContainer";
import {connect} from 'react-redux';
import * as actions from './Store/actions/auth';
import HomeHeader from "./Home/containers/HeaderContainer";
// import axios from 'axios';

const {Content} = Layout;

class App extends React.Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    // if (props.token) {
    //     // token存在设置header,因为后续每个请求都需要
    //     axios.defaults.headers.common['Authorization'] = 'Token ' + state.token;
    // } else {
    //     // 没有token就移除
    //     delete axios.defaults.headers.common['Authorization'];
    // }

    render() {
        return (
            <div>
                <Router>
                    <Layout>
                        <HomeHeader {...this.props}/>
                        <Content style={{marginTop: "64px", minHeight: "100vh",backgroundColor:"#DEDEDE"}}>
                            <BaseRouter/>
                        </Content>
                        <HomeFooter {...this.props}/>
                    </Layout>
                </Router>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(App);


