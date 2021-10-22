import React from 'react';
import {Icon} from 'antd';

export default class FullScreen extends React.Component {
    state = {isFullScreen: false};

    componentDidMount() {
        this.watchFullScreen();
    }

    handleFullScreen = () => {
        !this.state.isFullScreen ? this.requestFullScreen() : this.exitFullscreen();
    };

    // Full screen
    requestFullScreen = () => {
        let de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    };
    // exit full screen
    exitFullscreen = () => {
        let de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    };

    // listing fullscreenchange
    watchFullScreen = () => {
        document.addEventListener(
            'fullscreenchange',
            () => {
                this.setState({isFullScreen: document.fullscreen});
            },
            false
        );
        document.addEventListener(
            'mozfullscreenchange',
            () => {
                this.setState({isFullScreen: document.mozFullScreen});
            },
            false
        );
        document.addEventListener(
            'webkitfullscreenchange',
            () => {
                this.setState({isFullScreen: document.webkitIsFullScreen});
            },
            false
        );
    };

    render() {
        return <Icon style={{fontSize: '20px', cursor: 'pointer'}} type="fullscreen" onClick={this.handleFullScreen}/>;
    }
}