import React, {useEffect, useState} from 'react'
import {Card, Avatar, Tag} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'

const {Meta} = Card;

const AuthorInfo = (props) => {

    const [data, setData] = useState({});
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function getProfileData() {
            await axios.get(
                'api/account/users/' + props.authorId + '/?format=json'
            ).then(res => {
                setData(res.data)
            }).catch(err => {
                console.log(err)
            });
        }

        getProfileData().then();
    }, []);

    useEffect(() => {
        async function getUserData() {
            const token = window.localStorage.getItem('token');
            if (token !== null) {
                await axios.get(
                    'rest-auth/user/',
                    {headers: {'Authorization': 'Token ' + token}}
                ).then(res => {
                    setUserId(res.data.id)
                });
            }
        }

        getUserData().then();
    }, []);


    return (
        <Card title={<div style={{fontWeight: 'bold'}}>About author</div>} bordered style={{
            background: '#fff',
            fontWeight: 'bold',
            borderRadius: '1px',
            boxShadow: '0 1px 3px rgba(26,26,26,.1)'
        }}>
            {Object.keys(data).length > 0 ?
                <Meta
                    avatar={
                        <Link
                            to={data.id === userId ? '/profile' : '/visit/profile/' + data.id}><Avatar
                            shape='square' src={data.profile.avatar}/>
                        </Link>
                    }
                    title={<div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: '#000',
                                    marginRight: '6px'
                                }}>{data.username}</span>
                            {data.profile.profession && <Tag color='#f50'>{data.profile.profession}</Tag>}
                        </div>
                    </div>}
                    description={data.profile.bio}
                /> : null}
        </Card>
    )
};

export default AuthorInfo
