import React, {useEffect, useState} from 'react'
import {List, Avatar, Button} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'

// const menu = (
//     <Menu>
//         <Menu.Item>
//             1(即将)
//         </Menu.Item>
//         <Menu.Item>
//             2(即将)
//         </Menu.Item>
//         <Menu.Item>
//             3(即将)
//         </Menu.Item>
//     </Menu>
// );

const pagesize = 6;
let page = 1;
const FollowerList = (props) => {

    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProfileData().then()
    }, []);

    async function getProfileData() {
        await axios.get('api/account/user/followers/', {
            params: {
                page: page,
                page_size: pagesize,
                user: props.id
            }
        }).then(res => {
            const temp = [];
            for (let index = 0; index < res.data.results.length; index++) {
                temp[index] = res.data.results[index].follower
            }
            setCount(res.data.count);
            setData(temp);
        }).catch(err => {
            console.log(err)
        });
    }

    const handleFollowList = async (currentPage) => {
        setLoading(true);
        await axios.get('api/account/user/followers/', {
            params: {
                page: currentPage,
                page_size: pagesize,
                user: props.id
            }
        }).then(res => {
            const temp = [];
            for (let index = 0; index < res.data.results.length; index++) {
                temp[index] = res.data.results[index].follower
            }
            setData(temp);
            setLoading(false);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <List
            style={{paddingBottom: '20px'}}
            grid={{
                gutter: 12, xs: 1, xl: 2
            }}
            loading={loading}
            dataSource={data}
            pagination={{
                onChange: handleFollowList,
                pageSize: pagesize,
                total: count,
                showQuickJumper: true,
                size: 'small'
            }}
            renderItem={item => (
                <List.Item>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        borderRadius: '3px',
                        backgroundColor: '#f2f2f5',
                        padding: '5px'
                    }}>
                        <div style={{
                            borderRight: '1px solid rgb(217, 217, 217)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            margin: '10px 10px 10px 0',
                            padding: '20px'
                        }}>
                            <Link
                                to={(item.id + '' === props.id ? '/profile/' : '/visit/profile/') + (item.id)}>
                                <Avatar size={35} shape='square' src={item.profile.avatar}/>
                            </Link>
                        </div>
                        <div style={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            alignItems: 'stretch'
                        }}>
                            <div style={{
                                color: '#333',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>
                                {item.username}
                            </div>
                            <div>{item.profile.bio.slice(0, 12) + '...'}</div>
                            <div style={{display: 'flex', padding: '10px 0'}}>
                                <Button size='small'>Block (In coming)</Button>
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    )
};

export default FollowerList
