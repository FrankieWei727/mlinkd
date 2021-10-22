import React from 'react'
import {Redirect} from 'react-router-dom';

const Logout = () => {
    return (
        <div>
            <Redirect to={'/login'}/>
        </div>
    )
};

export default Logout;