import React, {useEffect, useState} from "react";
import {Button, Icon, message} from "antd";
import axios from "axios";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1621723_m6ue80tfyy.js'
});

const MovieLike = ({movieId}) => {

    const [like, setLike] = useState(false);
    const [loading, setLoading] = useState(false);

    async function isLike() {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            await axios.post(
                'api/movie/movie/fans/' + movieId + '/is_like/?format=json',
                {},
                {headers: {'Authorization': 'Token ' + token}}
            ).then(res => {
                    setLike(res.data.code === '1');
                }
            );

        }
    }

    useEffect(() => {
        isLike();
    });

    const onLike = async e => {
        const token = window.localStorage.getItem('token');
        if (token !== null) {
            setLoading(true);
            await axios.post(
                'api/movie/movie/fans/' + movieId + '/like/?format=json',
                {},
                {headers: {'Authorization': 'Token ' + token}}
            );
            setTimeout(() => {
                setLoading(false);
                setLike(true);
            }, 300);
            message.success('Like successfully')
        } else {
            message.warning('Please login!')
        }
    };

    const unlike = async (e) => {
        setLoading(true);
        await axios.post(
            'api/movie/movie/fans/' + movieId + '/unlike/?format=json',
            {},
            {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
        );

        setTimeout(() => {
            setLike(false);
            setLoading(false);
        }, 300);
        message.success('Unlike Successfully!')
    };

    return (
        <div>
            {like ?
                <Button onClick={unlike} type='link' size="large"
                        loading={loading}>
                    <IconFont type='icondianzan'/>
                </Button> :
                <Button onClick={onLike} type='link' size="large"
                        loading={loading}>
                    <IconFont type='iconfabulous'/>
                </Button>
            }
        </div>
    )
};

export default MovieLike;