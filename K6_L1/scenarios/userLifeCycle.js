import { sleep, check } from "k6";
import {
    createUser,
    updatedUser,
    deleletedUser
} from '../services/userServices.js'

import { checkStatus } from "../utils/checks.js";

const userData = JSON.parse(open('../testData/createUsers.json'))

export function userLifeCycle(token){
    const payload = {
        ...userData,
        username: `${userData.username}_${__VU}_${__ITER}`,
        email: `test_${__VU}_${__ITER}@example.com`
    }

    const createResponse = createUser(token,payload);
    const created = check(createResponse, {
        'Create User - status 201': (r) => r.status === 201,
        'Create user - firstName matches': (r) => 
            r.status === 201 &&
            r.json('firstName') === payload.firstName
    });

    if(!created){
        throw new Error(`Create failed: ${createResponse.status}`)
    }
    const cratedUser = createResponse.json();
    const userId = createUser.id;

    console.log(`CREATED_USER_CSV` + JSON.stringify({
        id: userId,
        username: createResponse.username,
        email: createResponse.email
    }))

    sleep(1)

    //updateUser 
    // DummyJSON does not persist newly created users.
    // Use a known existing user ID for update/delete practice
    const existingUserId = 2;
    const updatePayload ={
        lastName: 'UpdatedTest'
    };

    const updateResponse = updatedUser(token, existingUserId, updatePayload);

    const update = check(updateResponse, {
        'Update User - status 200': (r) => r.status === 200,
        'Update User - lastName matched': (r) => r.json('lastName') === updatePayload.lastName

    })
    if(!update){
        throw new Error(`Updated user failed: ${updateResponse.status}`)
    }

    // Deleted Users
    const deletedResponse = deleletedUser(token, existingUserId);

    check(deletedResponse, {
        'Deleted user success': (r) => r.status === 200,
        'User is deleted': (r) => r.json('isDeleted') === true
    })
  sleep(1)
}

