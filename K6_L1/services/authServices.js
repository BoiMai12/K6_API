import http from 'k6/http';
import {BASE_URL, headers} from '../config/config.js'

export function login(username, password){
    const payload = JSON.stringify({
        username,
        password,
        expiresInMins: 5
    })
    return http.post(`${BASE_URL}/auth/login`, payload, {headers, tag:{name: 'Login'}});
}