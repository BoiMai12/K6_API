import {check} from 'k6'

export function checkStatus(response, expectedStatus, name){
    return check(response, {
        [`${name} - status ${expectedStatus}`]: (r) => r.checkStatus = expectedStatus
    });
}