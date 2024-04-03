/** @type {import('tailwindcss').Config}*/
const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            colors: {
                'primary': 'var(--primary)',
                'background': 'var(--background)',
                'secondary': 'var(--secondary)',
                'tertiary': 'var(--tertiary)',
                'foreground': 'var(--foreground)',
                'foreground-light': 'var(--foreground-light)',
                'foreground-secondary': 'var(--foreground-secondary)',
                'border': 'var(--border)',
                'seperator': 'var(--seperator)',
                'window-outline': 'var(--window-outline)',
                'browser-window-dots': 'var(--browser-window-dots)',
                'browser-window-search': 'var(--browser-window-search)',
                'browser-window-foreground': 'var(--browser-window-foreground)',
                'browser-window-background': 'var(--browser-window-background)',
                'terminal-window-dots': 'var(--terminal-window-dots)',
                'terminal-background': 'var(--terminal-background)',
                'monologue-background': 'var(--monologue-background)',
                'monologue-outline': 'var(--monologue-outline)',
            },
        },
    },

    plugins: [],
};

module.exports = config;