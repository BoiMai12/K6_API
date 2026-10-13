import http from 'k6/http'
import { BASE_URL, getAuthHeaders, headers } from '../config/config.js'

export function createUser(token, payload) {
    return http.post(`${BASE_URL}/users/add`, JSON.stringify(payload),
        {
            headers: getAuthHeaders(token),
            tags: { name: 'CreatedUser' }
        }
    );
}

export function updatedUser(token, userid, payload) {
    return http.put(
        `${BASE_URL}/users/${userid}`,
        JSON.stringify(payload),
        {
            headers: getAuthHeaders(token),
            tags: { name: 'UpdatedUser' }
        }
    );
}

export function deleletedUser(token, userid) {
    return http.del(
        `${BASE_URL}/users/${userid}`,null,
        {
            headers: getAuthHeaders(token),
            tags: { name: 'DeletedUser' }
        }
    );
}