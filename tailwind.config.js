/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false,
    },
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,}', './src/components/**/*.{js,ts,jsx,tsx,}', './src/app/**/*.{js,ts,jsx,tsx,}'],
    theme: {
        extend: {
            screens: {
                xs: '480px',
            },
            fontFamily: {
                poppins: ['var(--font-poppins)'],
            },
        },
    },
    plugins: [],
};
