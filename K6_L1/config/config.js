export const BASE_URL = 'https://dummyjson.com';

export const headers ={
    'Content-Type': 'application/json',
    Accept: 'application/json'
}

export function getAuthHeaders(token){
    return{
        ...headers,
        Authorization: `Bearer ${token}`
    }
}