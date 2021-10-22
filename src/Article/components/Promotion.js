import React, {useEffect, useState} from 'react'
import {Icon} from 'antd'
import {Link} from 'react-router-dom'
import axios from 'axios'

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_d874tqmi7pk.js'
});


const PromotionList = () => {

    const [current, setCurrent] = useState("");
    const [isSwitch, setIsSwitch] = useState(false);

    async function getUserProfile() {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            await axios.get(
                'rest-auth/user/',
                {headers: {'Authorization': 'Token ' + token}}
            ).then(res => {
                    setIsSwitch(res.data.profile.permission === 'reviewed');
                }
            ).catch(err => {
                console.log(err)
            });
        }
    };

    useEffect(() => {
        getUserProfile().then();
    }, []);

    const handleClick = (e) => {
        this.setState({
            current: e.key
        })
    };

    return (
        <div style={{
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 1px 3px rgba(26,26,26,.1)',
        }}>
            <div>
                <Link to={(window.localStorage.getItem('token') !== null) ? '/create_article' : '/login'}>
                    <div>
                        <IconFont type='iconbianji1' style={{fontSize: '36px'}}/>
                    </div>
                </Link>
            </div>
        </div>
    )
};

export default PromotionList
