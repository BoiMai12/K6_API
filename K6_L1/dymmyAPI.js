import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'


export const options = {
    vus: 2,
    duration: '5s',
    thresholds: {
        http_req_duration: ['p(95) < 1000'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99']
    }
}
const userData = JSON.parse(open('./testData/createUsers.json'))
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}
const base_Url = 'https://dummyjson.com';


export function setup() {
    const loginPayload = JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 5
    })
    const loginResponse = http.post(`${base_Url}/auth/login`, loginPayload, { headers });
    const success = check(loginResponse, { 'status is 200': (r) => r.status === 200 });
    if (!success) {
        throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const accessToken = loginResponse.json('accessToken');
    if (!accessToken) {
        throw new Error('Access token is missing');
    }
    return { accessToken };

}
export default function (data) {
    // const payload = JSON.stringify(
    //     {
    //         "firstName": "CCung",
    //         "lastName": "Test",
    //         "age": 30,
    //         "gender": "Female",
    //         "email": "test@gmail.com",
    //         "phone": "83948738957",
    //         "username": "BOi",
    //         "password": "343434",
    //         "birthDate": "3445"

    //     }
    // )
    // Creat a dynamic varibale in the objective
    const authHeaders = {
        ...headers,
        Authorization: `Bearer ${data.accessToken}`
    }
    const payload = {
        ...userData,
        username: `${userData.username}_${__VU}_${__ITER}`,
        email: `test_${__VU}_${__ITER}@example.com`
    }


    const response = http.post(`${base_Url}/users/add`, JSON.stringify(payload), {
        headers: authHeaders,
        tags: { name: 'CreateUser' }
    })
    console.log(`STATUS: ${response.status}`);
    console.log(`BODY: ${response.body}`);
    const success = check(response,
        { 'status is 201': (r) => r.status === 201,
            'firstname matches': (r) => r.json('firstName') == payload.firstName
         });

    if (success) {
        const createUser = response.json();
        console.log(`CREATED_USER_CSV:` + JSON.stringify({
            id: createUser.id,
            username: createUser.username,
            email: createUser.email,
        }))
    }


}

export function handleSummary(data) {
    return {
        "reports/report.html": htmlReport(data),
        'reports/summary.json': JSON.stringify(data, null, 2),
    }
}