// Redirect URL to scribe.rip to get a lighter an simpler version instead of the bloated Medium.com version
(() => {
    window.location.href = 'https://scribe.rip' + new URL(window.location.href).pathname
})();
