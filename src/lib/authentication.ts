import { STAFF_AUTH_TOKEN } from '../const';
import roles from '@/data/role';

export const authentication = async (req: any, permission?: (typeof roles)[number]) => {
    const token = req.cookies[STAFF_AUTH_TOKEN];

    if (!token) {
        return {
            success: false,
        } as AuthResponse;
    }

    const response = await fetch(`${process.env.api_url}/api/staff/auth/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            token: token ? token : '',
            permission: permission ? permission : '',
        }),
    });

    var result = (await response.json()) as AuthResponse;
    return result;
};
