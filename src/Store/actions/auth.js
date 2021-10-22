import * as actionType from './actionType';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionType.AUTH_START,
        errorMsg: null,
        error: null,
    }
};

export const authSuccess = (token) => {
    return {
        type: actionType.AUTH_SUCCESS,
        token: token,
    }
};

export const authFail = (error, errorMsg) => {
    return {
        type: actionType.AUTH_FAIL,
        error: error,
        errorMsg: errorMsg,
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionType.AUTH_LOGOUT,
    }
};

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
};


export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('rest-auth/login/', {
            username: username,
            password: password,
        })
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            })
            .catch(err => {
                dispatch(authFail(err, err.response.data));
            })
    }
};


export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2,
        })
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            })
            .catch(err => {
                // if (err.response) {
                //     // The request was made and the server responded with a status code
                //     // that falls out of the range of 2xx
                //     // console.log(err.response.data);
                //     // console.log(err.response.status);
                //     // console.log(err.response.headers);
                // } else if (err.request) {
                //     // The request was made but no response was received
                //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                //     // http.ClientRequest in node.js
                //     // console.log(err.request);
                // } else {
                //     // Something happened in setting up the request that triggered an Error
                //     // console.log('Error', err.message);
                // }
                // // console.log(err.config);
                console.log(err.response.data);
                dispatch(authFail(err, err.response.data))
            })
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem("token");
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem("expirationDate"));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(
                    checkAuthTimeout(
                        (expirationDate.getTime() - new Date().getTime()) / 1000
                    )
                );
            }
        }
    };
};



