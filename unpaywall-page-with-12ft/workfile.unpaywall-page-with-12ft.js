// Redirect url to 12ft who loads the Google Cache version of it (sometimes remove paywalls like explained on https://12ft.io)
(() => {
	window.location.href = 'https://12ft.io/proxy?q=' + window.location.href
})();
