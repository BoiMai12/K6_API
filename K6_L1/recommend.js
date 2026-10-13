
import http from 'k6/http';
import { check } from 'k6';
import { login } from '../services/authService.js';

const baseUrl = __ENV.BASE_URL;
const runId = __ENV.RUN_ID;

export const options = {
    vus: 1,
    iterations: 1,
};

export function setup() {
    if (!runId) {
        throw new Error('RUN_ID is required for cleanup');
    }

    return {
        accessToken: login(baseUrl),
    };
}

export default function (data) {
    const headers = {
        Authorization: `Bearer ${data.accessToken}`,
    };

    // Example endpoint: Must be supported by your API
    const response = http.get(
        `${baseUrl}/users?testRunId=${encodeURIComponent(runId)}`,
        { headers }
    );

    if (response.status !== 200) {
        throw new Error(`Get users failed: ${response.status}`);
    }

    // Assumes API returns { data: [{ id: ... }] }
    const users = response.json('data');

    if (!Array.isArray(users)) {
        throw new Error('Unexpected users response format');
    }

    console.log(`Found ${users.length} users to delete`);

    for (const user of users) {
        const deleteResponse = http.del(
            `${baseUrl}/users/${user.id}`,
            null,
            { headers }
        );

        check(deleteResponse, {
            'User deleted': (r) => r.status === 204,
        });

        console.log(
            `Delete user ${user.id}: ${deleteResponse.status}`
        );
    }
}
