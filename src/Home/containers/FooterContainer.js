import React from 'react';
import {Layout} from "antd";

const {Footer} = Layout;

const HomeFooter = () => {

    return (
        <Footer style={{
            textAlign: 'center',
            color: "#e3e3e3",
            backgroundColor: "#4d4d4d",
            minHeight: "100px"
        }}>
            <p>Mlinked is here. The best place to share your ideas.</p>
            <p>Mlinked ©2020 Created by Frankie</p>
        </Footer>

    )

};

export default HomeFooter