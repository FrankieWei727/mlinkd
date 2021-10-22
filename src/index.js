import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'antd/dist/antd.css'
import './index.css'
import authReducer from './Store/reducers/auth'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'

let env = process.env.NODE_ENV
let baseUrl = ''
if (env === 'development') {
  baseUrl = 'http://127.0.0.1:8000/'
} else if (env === 'production') {
  baseUrl = 'https://mlinked.herokuapp.com/'
}

axios.defaults.baseURL = baseUrl

const rootReducer = combineReducers({
  auth: authReducer,
})

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)))

const app = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))
serviceWorker.unregister()
