import { check } from "k6";
import {htmlReport} from  'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

import { login } from "./services/authServices.js";
import { userLifeCycle } from "./scenarios/userLifeCycle.js";

export const options ={
    vus: 2,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99']
    }
}

export function setup(){
    const response = login('emilys', 'emilyspass');
    const success = check(response,{
        'Login success- status 200': (r) => r.status === 200
    });
    if(!success){
        throw new Error(`Login failed: ${response.status}`)
    }
    const token = response.json('accessToken');
    if(!token){
        throw new Error('Acess token is missing');
    
    }
    return {token};
}
export default function(data){
    userLifeCycle(data.token);
}

export function teardown(data){
    console.log('Test execution completed')
}

export function handleSummary(data){
    return{
        'reports/report.html': htmlReport(data),
        // 'reports/summary.json': JSON.stringify(data, null, 2)
    }
}