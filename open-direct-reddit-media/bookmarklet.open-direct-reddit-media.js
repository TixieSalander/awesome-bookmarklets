javascript:(async () => {function isRedditDomain(){const validDomains=/^(?:www\.|old\.)?reddit\.com$/i;return validDomains.test(window.location.hostname)}function isRedditPost(){var currentUrl=window.location.href;var redditPostPattern=/https?:\/\/(?:www\.|old\.)?reddit\.com\/r\/[^\/]+\/comments\/[a-z0-9]+\/[^\/]+/i;return redditPostPattern.test(currentUrl)}function checkMediaQueryParam(){const urlSearchParams=new URLSearchParams(window.location.search);const mediaQueryParam=urlSearchParams.get('url');if(mediaQueryParam&&isRedditDomain()&&window.location.pathname.toLowerCase()==='/media'){console.log(`Media URL: “${decodeURIComponent(mediaQueryParam)}”`);window.alert(`You're already in a dedicated picture viewer page.\n Image short url is: \n${decodeURIComponent(mediaQueryParam)}`);return true}return false}if(!isRedditDomain()){window.alert("You're not on a Reddit domain");return}if(checkMediaQueryParam()){return}if(isRedditPost()){await fetch('.json').then(response=>response.json()).then(data=>{const pictureExtensions=['jpg','jpeg','png','gif','bmp','tiff','tif','webp','svg'];const videoExtensions=['mp4','webm','ogg','ogv','avi','mov','mkv'];const audioExtensions=['mp3','wav','ogg','aac','flac','wma'];const validMediaExtensions=[...pictureExtensions,...videoExtensions,...audioExtensions];function cleanUrl(urlString){const urlObject=new URL(urlString);urlObject.search='';return urlObject.toString()}function isValidMediaUrl(url){const urlObj=new URL(url);urlObj.search='';const fileExtension=urlObj.pathname.split('.').pop().toLowerCase();const lowercaseExtensions=validMediaExtensions.map(ext=>ext.toLowerCase());if(!lowercaseExtensions.includes(fileExtension)){console.error(`Invalid media extension: ${ fileExtension } for "${ url }". Valid extensions are: ${lowercaseExtensions.join(', ')}`);return false}return true}function findValueByKey(obj,keys){if(!keys){console.error("Please provide a valid key or an array of keys to search. Each key must be a string.");throw new Error("Error in the findValueByKey() function. Check the browser console.")}const keyArray=Array.isArray(keys)?keys:[keys];for(let k of keyArray){if(!(k&&typeof k==='string'&&k.trim()!==''&&k!==null&&k!==undefined&&k!==false)){console.error("Please provide a valid key or an array of keys to search. Each key must be a string.");throw new Error("Error in findValueByKey() function. Check the browser console.")}}if(obj===undefined){console.error("Failed to get an object or array from the json request");throw new Error("Error in findValueByKey() function. Check the browser console.")}function findValue(obj,key){if(obj===null||typeof obj!=='object'){return null}if(key in obj){return obj[key]}for(let prop in obj){const result=findValue(obj[prop],key);if(result!==null){return result}}if(Array.isArray(obj)){for(let i=0;i<obj.length;i+=1){const result=findValue(obj[i],key);if(result!==null){return result}}}return null}let finalResult=undefined;for(const key of keyArray){let currentResult=findValue(obj,key);if(currentResult!==null&&isValidMediaUrl(currentResult)==true){if(!Array.isArray(finalResult)){finalResult=[]}finalResult.push(currentResult)}}return finalResult}delete redditPostMediaUrls;let redditPostMediaUrls=findValueByKey(data[0].data,['fallback_url','url_overridden_by_dest']);if((typeof redditPostMediaUrls!=='undefined'&&Array.isArray(redditPostMediaUrls)&&redditPostMediaUrls.length>0)){window.open(cleanUrl(redditPostMediaUrls[0]),'_self');return}else{window.alert(`Error finding media url: ${ redditPostMediaUrls }`)}}).catch(error=>{console.error("Error (probably while fetching page's JSON):");console.error(error);window.alert(`Error (probably while fetching page's JSON): \n${ error }`)})}else{window.alert("You're not on a Reddit post")}})();
