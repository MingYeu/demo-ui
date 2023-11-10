export function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name: string) {
    return `${name[0]}`;
}

function checkPasswordStrength(password: string | null) {
    if (!password) return;
    // Define your criteria for password strength
    const minLength = 8; // Minimum password length
    const minUpperCase = 1; // Minimum uppercase characters
    const minLowerCase = 1; // Minimum lowercase characters
    const minDigits = 1; // Minimum digits
    const minSpecialChars = 1; // Minimum special characters
    let score = 0;
    const messages = [];

    // Perform the password strength check
    if (password.length < minLength) {
        messages.push('Password is too short.');
    } else {
        score += 1;
    }

    // You can use regular expressions to match the criteria
    if (!/(?=.*[A-Z])/.test(password) || password.length < minUpperCase) {
        messages.push('Password should contain at least one uppercase character.');
    } else {
        score += 1;
    }

    if (!/(?=.*[a-z])/.test(password) || password.length < minLowerCase) {
        messages.push('Password should contain at least one lowercase character.');
    } else {
        score += 1;
    }

    if (!/(?=.*\d)/.test(password) || password.length < minDigits) {
        messages.push('Password should contain at least one digit.');
    } else {
        score += 1;
    }

    if (!/(?=.*[@#$%^&+=])/.test(password) || password.length < minSpecialChars) {
        messages.push('Password should contain at least one special character.');
    } else {
        score += 1;
    }

    // If all criteria pass, the password is considered strong
    return {
        score,
        messages,
    };
}
