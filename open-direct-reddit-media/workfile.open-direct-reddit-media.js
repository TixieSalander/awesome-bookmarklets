(async () => {
	// Function to check if the domain is www.reddit.com or old.reddit.com
	function isRedditDomain() {
		const validDomains = /^(?:www\.|old\.)?reddit\.com$/i;
		return validDomains.test(window.location.hostname);
	}
	// Function to check if the current URL is a Reddit post
	function isRedditPost() {
		var currentUrl = window.location.href;
		var redditPostPattern = /https?:\/\/(?:www\.|old\.)?reddit\.com\/r\/[^\/]+\/comments\/[a-z0-9]+\/[^\/]+/i;
		return redditPostPattern.test(currentUrl);
	}
	// Function to check if the media URL is present in the query parameters on a media page
	function checkMediaQueryParam() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const mediaQueryParam = urlSearchParams.get('url');
		if (mediaQueryParam && isRedditDomain() && window.location.pathname.toLowerCase() === '/media') {
			// Alert that you're already in a dedicated page and give media URL:
			console.log(`Media URL: “${decodeURIComponent(mediaQueryParam)}”`)
			window.alert(`You're already in a dedicated picture viewer page.\n Image short url is: \n${decodeURIComponent(mediaQueryParam)}`)
			return true;
		}
		return false;
	}
	// Check if the domain is valid
	if (!isRedditDomain()) {
		window.alert("You're not on a Reddit domain");
		return;
	}
	// Check for media URL in query parameters
	if (checkMediaQueryParam()) {
		return;
	}
	// Proceed with Reddit post logic
	if (isRedditPost()) {
		// Get post JSON data
		await fetch('.json').then(response => response.json()).then(data => {
			// List of valid media extensions
			const pictureExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg'];
			const videoExtensions = ['mp4', 'webm', 'ogg', 'ogv', 'avi', 'mov', 'mkv'];
			const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'];
			const validMediaExtensions = [...pictureExtensions, ...videoExtensions, ...audioExtensions];
			// Clearn url string from query parameters and
			function cleanUrl(urlString) {
				const urlObject = new URL(urlString);
				urlObject.search = '';
				return urlObject.toString();
			}
			// Function to check if a given URL has a valid media extension
			function isValidMediaUrl(url) {
				const urlObj = new URL(url);
				urlObj.search = ''
				const fileExtension = urlObj.pathname.split('.').pop().toLowerCase();
				const lowercaseExtensions = validMediaExtensions.map(ext => ext.toLowerCase());
				if (!lowercaseExtensions.includes(fileExtension)) {
					console.error(`Invalid media extension: ${fileExtension} for "${url}". Valid extensions are: ${lowercaseExtensions.join(', ')}`);
					return false;
				}
				return true;
			}
			// Function to find the media URL
			function findValueByKey(obj, keys) {
				if (!keys) {
					console.error("Please provide a valid key or an array of keys to search. Each key must be a string.");
					throw new Error("Error in the findValueByKey() function. Check the browser console.");
				}
				// If keys is a string, convert it to an array for uniform processing
				const keyArray = Array.isArray(keys) ? keys : [keys];
				// Check if every key is a non-empty string
				for (let k of keyArray) {
					if (!(k && typeof k === 'string' && k.trim() !== '' && k !== null && k !== undefined && k !== false)) {
						console.error("Please provide a valid key or an array of keys to search. Each key must be a string.");
						throw new Error("Error in findValueByKey() function. Check the browser console.");
					}
				}
				// Check if the object is here
				if (obj === undefined) {
					console.error("Failed to get an object or array from the json request");
					throw new Error("Error in findValueByKey() function. Check the browser console.");
				}

				function findValue(obj, key) {
					// Base case: if the object is null or undefined, return null
					if (obj === null || typeof obj !== 'object') {
						return null;
					}
					// Check if the key is present in the current level
					if (key in obj) {
						return obj[key];
					}
					// Traverse through each property of the object
					for (let prop in obj) {
						// Recursively call the function for nested objects or arrays
						const result = findValue(obj[prop], key);
						// If the result is not null, the key was found, short-circuit and return the value
						if (result !== null) {
							return result;
						}
					}
					// If the object is an array, traverse through each element
					if (Array.isArray(obj)) {
						for (let i = 0; i < obj.length; i++) {
							// Recursively call the function for array elements
							const result = findValue(obj[i], key);
							// If the result is not null, the key was found, short-circuit and return the value
							if (result !== null) {
								return result;
							}
						}
					}
					// If the key is not found in the entire object, return null
					return null;
				}
				let finalResult = undefined;
				// Loop on every searching key to find any matching url
				for (const key of keyArray) {
					let currentResult = findValue(obj, key);
					if (currentResult !== null && isValidMediaUrl(currentResult) == true) {
						if (!Array.isArray(finalResult)) {
							finalResult = []
						}
						finalResult.push(currentResult)
					}
				}
				return finalResult
			}
			delete redditPostMediaUrls;
			let redditPostMediaUrls = findValueByKey(data[0].data, ['fallback_url', 'url_overridden_by_dest']);
			if ((typeof redditPostMediaUrls !== 'undefined' && Array.isArray(redditPostMediaUrls) && redditPostMediaUrls.length > 0)) {
				// Open media in the same tab
				window.open(cleanUrl(redditPostMediaUrls[0]), '_self');
				return
			} else {
				window.alert(`Error finding media url: ${redditPostMediaUrls}`);
			}
		}).catch(error => {
			console.error("Error (probably while fetching page's JSON):");
			console.error(error);
			window.alert(`Error (probably while fetching page's JSON): \n${error}`);
		});
	} else {
		window.alert("You're not on a Reddit post");
	}
})();
