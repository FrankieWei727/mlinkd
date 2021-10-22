import React, {Component} from 'react'
import {Steps, Button} from 'antd'
import axios from 'axios'
import {Link} from 'react-router-dom'

const {Step} = Steps;

const First = ({onClick}) => (
    <div style={{margin: '24px 0'}}>
        You have not applied for editing permission for movies, please click
        <Button onClick={onClick} type='primary' size='small' style={{margin: '0 10px'}}>Apply</Button>
    </div>
);

const Second = ({onClick}) => (
    <div style={{margin: '24px 0'}}>
        If you want to cancel, please click
        <Button onClick={onClick} type='primary' size='small' style={{margin: '0 10px'}}>Cancel Apply</Button>
    </div>
);

const Third = ({onClick}) => (
    <div style={{margin: '24px 0'}}>
        You can upload resource now! Please click
        <Link to='/movie_upload'>
            <Button onClick={onClick} type='primary' size='small' style={{margin: '0 10px'}}>Upload</Button>
        </Link>
    </div>
);

class MovieEditPermission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            userId: null,
        }
    }

    componentDidMount() {
        this.getProfileData()
    }

    async getProfileData() {
        let temp = 0;
        await axios.get(
            'rest-auth/user/',
            {headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}}
        ).then(response => {
            if (response.data.profile.permission === 'unreviewed') {
                temp = 0
            } else {
                if (response.data.profile.permission === 'reviewing') {
                    temp = 1
                } else {
                    temp = 2
                }
            }
            this.setState({
                current: temp,
                userId: response.data.id,
            })
        }).catch(err => {
            console.log(err)
        })
    };

    apply = async () => {
        let config = {
            headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}
        };
        await axios.post(
            'api/account/user/' + this.state.userId + '/apply/',
            {},
            config
        );
        const current = 1;
        this.setState({current})
    };

    cancelApply = async () => {
        let config = {
            headers: {'Authorization': 'Token ' + window.localStorage.getItem('token')}
        };
        await axios.post(
            'api/account/user/' + this.state.userId + '/cancel_apply/',
            {},
            config
        );
        const current = 0;
        this.setState({current})
    };

    render() {
        const {current} = this.state;
        return (
            <div>{
                current === 2 ?
                    <div>
                        <div style={{margin: '24px 0'}}>
                            You can upload resource now! Please click
                            <Link to='/movie_upload'>
                                <Button type='link' size='small'
                                        style={{margin: '0 10px'}}>Upload</Button>
                            </Link>
                        </div>
                    </div>
                    :
                    <div>
                        <Steps current={current} size="small">
                            <Step key={0} title='Apply'/>
                            <Step key={1} title='Wait for reviewing'/>
                            <Step key={2} title='Success'/>
                        </Steps>
                        <div style={{paddingTop: "40px"}}>
                            {current === 0 ? (<First onClick={this.apply}/>) : null}
                            {current === 1 ? (<Second onClick={this.cancelApply}/>) : null}
                            {current === 2 ? (<Third/>) : null}
                        </div>
                    </div>

            }
            </div>
        )
    }
}

export default MovieEditPermission
