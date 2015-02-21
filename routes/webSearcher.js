

function WebSearcher(){
	this.q = require('q');
	this.keys = require('./private_keys');
	var googleapis = require('googleapis');
	this.customsearch = googleapis.customsearch('v1');
};


/**
* [Asynchronous] returns a 
* @param {[Strings]} needles : List of cleaned strings to input into google image search engine
* @return {[hash of images linked with keywords to output]]}}
*{
* "investiture John Kennedy”: [
* {"http://img1_1.jpg” : {pertinence:100}},
* {"http://img1_2.jpg” : {pertinence:85}},
* {"http://img1_3.jpg” : {pertinence:75}}
* ],
* "baie cochons 1961”: [
* {"http://img2_1.jpg” : {pertinence:100}},
* {"http://img2_2.jpg” : {pertinence:35}},
* ]
* }
*/
WebSearcher.prototype.go = function(needles){
	
	var nbNeedles = needles.length;
	var deferred = this.q.defer();
	var res = [];
	var ctx = this;
	
	for(var cpt=0; cpt<nbNeedles; cpt++){
		var nbAnalyzed = cpt;
		this.analyzeOneNeedle(needles[cpt]).then(
			function(result){
				res.push(result);
				// When the last sentence has been analyzed, the deferred is resolved
				if(nbAnalyzed+1===nbNeedles){
					deferred.resolve(res);
				}
			}
		);

	}	
	
	return deferred.promise;
};


/**
* [Asynchronous] Chain all the available analysis and compile results in a single JSON object
* @param {[Strings]} some words to search
* @return [{sentence:the string searched on the web, web: webpages related to the sentence, img: images related to sentence}]
*/
WebSearcher.prototype.analyzeOneNeedle = function(needle){

	var deferred = this.q.defer();
	var imagesList = [];
	var webpagesList = [];
	
	// If another search engine is used, just add the function in the q.all parameter and concatenate the 
	// results are sent back in order
	var allPromise = this.q.all([ 
		this.googleWebSearch(needle), 
		this.googleImageSearch(needle) 
		]).then(
			function(result){
				webpagesList = result[0];
				imagesList = result[1];
				// a new needle has been analyzed, the res table is filled with the new values
				deferred.resolve({'sentence':sentence,  'web':webpagesList, 'img':imagesList});
			},
			function(error){deferred.reject("Error during search: "+error);}
		);
		
	return deferred.promise;

};

/**
* [Asynchronous] Search some words on google image, limit to the first 10 results.
* @param {[Strings]} some words to search on G image
* @return [{url:image url, snippet: image snippet, title: image title, site:clean website address}]
*/
WebSearcher.prototype.googleImageSearch = function(query_terms){

	var deferred = this.q.defer();

	// here are the options for the query (see google_cse_api_doc.txt file)
	var options = { cx:this.keys.cx, q:query_terms, auth:this.keys.api, searchType:'image', dateRestrict:'m[3]', gl:'fr', hl:'lang_fr', safe:'medium' };

	this.googleSearch(options, 'img').then(
		// If the search is successful
		function(result){
//console.log("query ok "+result.searchInformation.formattedTotalResults);
			var res = [];
			// interesting items are extracted. again, see the doc file for details
			var nbItems = result.items.length;
			if (result.items && nbItems > 0) {
				for(var cpt=0; cpt<nbItems; cpt++){
					var image = result.items[cpt];
					res.push({'url':image.link, 'snippet':image.snippet, 'title':image.title, 'site':image.displayLink});
				}
			}
			
			deferred.resolve(res);
		},
		// If the search is NOT successful
		function(error){
			deferred.reject("google Image search has failed");
		}	
	).done();
	
	return deferred.promise;
};


/**
* [Asynchronous] Search some words on the web, limit to the first 10 results
* @param {[Strings]} some words to search on the web
* @return [{link:webpage url, snippets: webpage snippet, title: webpage title, site:clean website address}]
*/
WebSearcher.prototype.googleWebSearch = function(query_terms){
	
	var deferred = this.q.defer();

	// here are the options for the query (see google_cse_api_doc.txt file)
	var options = { cx:this.keys.cx, q:query_terms, auth:this.keys.api, dateRestrict:'m[3]', gl:'fr', hl:'lang_fr', safe:'medium' };

	this.googleSearch(options, 'web').then(
		// If the search is successful
		function(result){
//console.log("query ok "+result.searchInformation.formattedTotalResults);
			var res = [];
			// interesting items are extracted. again, see the doc file for details
			var nbItems = result.items.length;
			if (result.items && nbItems > 0) {
				for(var cpt=0; cpt<nbItems; cpt++){
					var page = result.items[cpt];
					res.push({'url':page.link, 'snippet':page.snippet, 'title':page.title, 'site':page.displayLink});
				}
			}
			
			deferred.resolve(res);
		},
		// If the search is NOT successful
		function(error){
			deferred.reject("google Web search has failed");
		}	
	).done();
	
	return deferred.promise;
};


/**
* [Asynchronous] sends a query to the custom search engine created on https://www.google.com/cse/all
* @param {[Strings]} the query options
* @return a JSON formatted result
* @todo remove source parameter when testing is over
*/
WebSearcher.prototype.googleSearch = function(options, source){

//console.log("option: "+JSON.stringify(options));

	var deferred = this.q.defer();
	/*
	this.customsearch.cse.list(options, function(err, resp){
		if (err) {
			console.log('An error occured during cse.list search', err);
			deferred.reject();
		}
		else{
			// Got the response from custom search
//console.log('Result: ' + resp.searchInformation.formattedTotalResults);
console.log(JSON.stringify(resp));
			deferred.resolve(resp);
		}
	});
	*/

	/* Delete this when not testing !*/
// Sample Web result:
	var web = {"kind":"customsearch#search","url":{"type":"application/json","template":"https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&cref={cref?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"},"queries":{"nextPage":[{"title":"Google Custom Search - John F. Kennedy","totalResults":"20300000","searchTerms":"John F. Kennedy","count":10,"startIndex":11,"inputEncoding":"utf8","outputEncoding":"utf8","safe":"medium","cx":"009891011242125557270:-diy3sstn-y","gl":"fr","hl":"lang_fr","dateRestrict":"m[3]"}],"request":[{"title":"Google Custom Search - John F. Kennedy","totalResults":"20300000","searchTerms":"John F. Kennedy","count":10,"startIndex":1,"inputEncoding":"utf8","outputEncoding":"utf8","safe":"medium","cx":"009891011242125557270:-diy3sstn-y","gl":"fr","hl":"lang_fr","dateRestrict":"m[3]"}]},"context":{"title":"hapteo"},"searchInformation":{"searchTime":0.313621,"formattedSearchTime":"0,31","totalResults":"20300000","formattedTotalResults":"20 300 000"},"items":[{"kind":"customsearch#result","title":"John Fitzgerald Kennedy — Wikipédia","htmlTitle":"<b>John Fitzgerald Kennedy</b> — Wikipédia","link":"http://fr.wikipedia.org/wiki/John_Fitzgerald_Kennedy","displayLink":"fr.wikipedia.org","snippet":"John Fitzgerald Kennedy, dit Jack Kennedy, souvent désigné par ses initiales \nJFK, né le 29 mai 1917 à Brookline (Massachusetts) et mort le 22 novembre \n1963 ...","htmlSnippet":"<b>John Fitzgerald Kennedy</b>, dit Jack Kennedy, souvent désigné par ses initiales <br>\n<b>JFK</b>, né le 29 mai 1917 à Brookline (Massachusetts) et mort le 22 novembre <br>\n1963&nbsp;...","cacheId":"NCXIj1QJ5n8J","formattedUrl":"fr.wikipedia.org/wiki/John_Fitzgerald_Kennedy","htmlFormattedUrl":"fr.wikipedia.org/wiki/<b>John</b>_<b>Fitzgerald</b>_<b>Kennedy</b>"},{"kind":"customsearch#result","title":"John F. Kennedy - Wikipedia, the free encyclopedia","htmlTitle":"<b>John F</b>. <b>Kennedy</b> - Wikipedia, the free encyclopedia","link":"http://en.wikipedia.org/wiki/John_F._Kennedy","displayLink":"en.wikipedia.org","snippet":"John Fitzgerald Kennedy (May 29, 1917 – November 22, 1963), commonly \nknown as Jack Kennedy or by his initials JFK, was an American politician who \nserved ...","htmlSnippet":"<b>John Fitzgerald Kennedy</b> (May 29, 1917 – November 22, 1963), commonly <br>\nknown as Jack Kennedy or by his initials <b>JFK</b>, was an American politician who <br>\nserved&nbsp;...","cacheId":"w3TXQtgRchEJ","formattedUrl":"en.wikipedia.org/wiki/John_F._Kennedy","htmlFormattedUrl":"en.wikipedia.org/wiki/<b>John</b>_<b>F</b>._<b>Kennedy</b>","pagemap":{"cse_image":[{"src":"http://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy,_White_House_color_photo_portrait.jpg/220px-John_F._Kennedy,_White_House_color_photo_portrait.jpg"}],"cse_thumbnail":[{"width":"176","height":"211","src":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQR6B3JRjGNDNZTNSszo_TzJY3O2VqRl544UbzUJGd29ALaeXu7R1AnQLQ"}],"hcard":[{"fn":"John F. Kennedy","nickname":"John Fitzgerald Kennedy","bday":"1917-05-29","label":"Arlington National Cemetery"}]}},{"kind":"customsearch#result","title":"John F. Kennedy | whitehouse.gov","htmlTitle":"<b>John F</b>. <b>Kennedy</b> | whitehouse.gov","link":"http://www.whitehouse.gov/1600/presidents/johnfkennedy","displayLink":"www.whitehouse.gov","snippet":"John Fitzgerald Kennedy was the 35th president of the United States (1961-1963\n), the youngest man elected to the office. On November 22, 1963, when he was ...","htmlSnippet":"<b>John Fitzgerald Kennedy</b> was the 35th president of the United States (1961-1963<br>\n), the youngest man elected to the office. On November 22, 1963, when he was&nbsp;...","cacheId":"N0bXpMoPbTUJ","formattedUrl":"www.whitehouse.gov/1600/presidents/johnfkennedy","htmlFormattedUrl":"www.whitehouse.gov/1600/presidents/<b>johnfkennedy</b>","pagemap":{"cse_image":[{"src":"http://www.whitehouse.gov/sites/whitehouse.gov/files/images/first-family/35_john_f_kennedy.jpg"}],"cse_thumbnail":[{"width":"299","height":"169","src":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ08LLN0qm3RF_dtFB9jRapfZUOCBKVFqq_jhRvKV7Cbqrit_6BfdP48SIM"}],"metatags":[{"abstract":"John Fitzgerald Kennedy was the 35th president of the United States (1961-1963), the youngest man elected to the office. On November 22, 1963, when he was hardly past his first thousand days in office, JFK was assassinated in Dallas, Texas becoming also, the youngest president to die.","og:site_name":"whitehouse.gov","og:type":"article","og:url":"http://www.whitehouse.gov/1600/presidents/johnfkennedy","og:title":"John F. Kennedy","og:updated_time":"2015-02-16T13:08:17-05:00","twitter:card":"summary","twitter:url":"http://www.whitehouse.gov/1600/presidents/johnfkennedy","twitter:title":"John F. Kennedy","article:published_time":"2014-12-30T18:01:47-05:00","article:modified_time":"2015-02-16T13:08:17-05:00","mobileoptimized":"width","handheldfriendly":"true","viewport":"width=device-width"}]}},{"kind":"customsearch#result","title":"Biographie John Fitzgerald Kennedy","htmlTitle":"Biographie <b>John Fitzgerald Kennedy</b>","link":"http://www.linternaute.com/biographie/john-fitzgerald-kennedy/","displayLink":"www.linternaute.com","snippet":"Biographie courte : Trente-cinquième président des Etats-Unis, John Fitzgerald \nKennedy est resté à la tête du pays à peine trois ans. Prônant une coexistence ...","htmlSnippet":"Biographie courte : Trente-cinquième président des Etats-Unis, <b>John Fitzgerald</b> <br>\n<b>Kennedy</b> est resté à la tête du pays à peine trois ans. Prônant une coexistence&nbsp;...","cacheId":"TcI0TbgplcsJ","formattedUrl":"www.linternaute.com/biographie/john-fitzgerald-kennedy/","htmlFormattedUrl":"www.linternaute.com/biographie/<b>john</b>-<b>fitzgerald</b>-<b>kennedy</b>/","pagemap":{"cse_image":[{"src":"http://www.linternaute.com/biographie/image_personnage/75/430.jpg"}],"cse_thumbnail":[{"width":"71","height":"71","src":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRV2GqOCUz7dAFW-K4gCl9mMeJDGisSxuIUdnJakbidyp0qJA7FkB3pog"}],"metatags":[{"serveur":"mira","date":"19/02/2015 04:40:12","id":"c0233da8f09c0bd278999260508c5203"}]}},{"kind":"customsearch#result","title":"John F. Kennedy Presidential Library & Museum","htmlTitle":"<b>John F</b>. <b>Kennedy</b> Presidential Library &amp; Museum","link":"http://www.jfklibrary.org/","displayLink":"www.jfklibrary.org","snippet":"John F. Kennedy Library, the nation's official memorial to President Kennedy.","htmlSnippet":"<b>John F</b>. <b>Kennedy</b> Library, the nation&#39;s official memorial to President Kennedy.","cacheId":"E2BqfOSWPKwJ","formattedUrl":"www.jfklibrary.org/","htmlFormattedUrl":"www.<b>jfk</b>library.org/","pagemap":{"cse_image":[{"src":"http://www.jfklibrary.org/~/media/assets/Homepage%20Slides/Homepage%20Slides%202015/JFKchal-hm-promo-app"}],"cse_thumbnail":[{"width":"321","height":"157","src":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQKlcKcwpgwwSG0QId6E10JYmoeeeufti9O34_FPNI1fHUL_OKiG-WazKI"}]}},{"kind":"customsearch#result","title":"JFK - John F. Kennedy International Airport","htmlTitle":"<b>JFK</b> - <b>John F</b>. <b>Kennedy</b> International Airport","link":"http://www.panynj.gov/airports/jfk.html","displayLink":"www.panynj.gov","snippet":"JFK Alerts. PA Alerts notifies customers of incidents or events that may delay their \ntrip. Subscribe Here · Transportation Options - Learn about our authorized ...","htmlSnippet":"<b>JFK</b> Alerts. PA Alerts notifies customers of incidents or events that may delay their <br>\ntrip. Subscribe Here &middot; Transportation Options - Learn about our authorized&nbsp;...","cacheId":"4w_Qc6Lj7L8J","formattedUrl":"www.panynj.gov/airports/jfk.html","htmlFormattedUrl":"www.panynj.gov/airports/<b>jfk</b>.html","pagemap":{"cse_image":[{"src":"http://www.panynj.gov/photo/airports/hero_685_airport_customer-care.jpg"}],"cse_thumbnail":[{"width":"419","height":"120","src":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSZBH06AML9Vfj8fyfbT5QGfh-XU6gOBfI43Gskj9QprWdHXsqsk_O025s"}]}},{"kind":"customsearch#result","title":"John F. Kennedy - U.S. Presidents - HISTORY.com","htmlTitle":"<b>John F</b>. <b>Kennedy</b> - U.S. Presidents - HISTORY.com","link":"http://www.history.com/topics/us-presidents/john-f-kennedy","displayLink":"www.history.com","snippet":"Find out more about the history of John F. Kennedy, including videos, interesting \narticles, pictures, historical features and more. Get all the facts on ...","htmlSnippet":"Find out more about the history of <b>John F</b>. <b>Kennedy</b>, including videos, interesting <br>\narticles, pictures, historical features and more. Get all the facts on&nbsp;...","cacheId":"6Fm4670b5fIJ","formattedUrl":"www.history.com/topics/us-presidents/john-f-kennedy","htmlFormattedUrl":"www.history.com/topics/us-presidents/<b>john</b>-<b>f</b>-<b>kennedy</b>","pagemap":{"cse_image":[{"src":"http://cdn.history.com/sites/2/2013/11/John_F_Kennedy-AB.jpeg"}],"videoobject":[{"name":"JFK: A New Generation","description":"John F. Kennedy's progressive agenda during the 1960s inspired a new generation of optimism in America."}],"cse_thumbnail":[{"width":"260","height":"194","src":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTkIxMT9WuvM5WY9DEvlFoLvSFbpNxDMHTFswHRB5EUEcwZ8vCztgR0AWiT"}],"webpage":[{"breadcrumb":"Home Topics U.S. Presidents John F. Kennedy"}],"metatags":[{"viewport":"width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no","format-detection":"telephone=no","apple-itunes-app":"app-id=576009463","useragent":"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)","device":"desktop","fb:app_id":"125536057474924","fb:admins":"100001148659782","og:site_name":"HISTORY.com","og:type":"topic","og:title":"John F. Kennedy - U.S. Presidents - HISTORY.com","og:description":"Find out more about the history of John F. Kennedy, including videos, interesting articles, pictures, historical features and more. Get all the facts on HISTORY.com","og:url":"http://www.history.com/topics/us-presidents/john-f-kennedy","og:image":"http://cdn.history.com/sites/2/2013/11/John_F_Kennedy-AB.jpeg","twitter:card":"summary","twitter:url":"http://www.history.com/topics/us-presidents/john-f-kennedy","twitter:title":"John F. Kennedy - U.S. Presidents - HISTORY.com","twitter:description":"Find out more about the history of John F. Kennedy, including videos, interesting articles, pictures, historical features and more. Get all the facts on HISTORY.com","twitter:site":"@history","twitter:image":"http://cdn.history.com/sites/2/2013/11/John_F_Kennedy-AB.jpeg","section":"topic","subsection":"undefined"}]}},{"kind":"customsearch#result","title":"Life of John F. Kennedy","htmlTitle":"Life of <b>John F</b>. <b>Kennedy</b>","link":"http://www.jfklibrary.org/JFK/Life-of-John-F-Kennedy.aspx","displayLink":"www.jfklibrary.org","snippet":"Growing Up in the Kennedy Family. Rose Fitzgerald Kennedy, who was a very \ndisciplined and organized woman, made the following entry on a notecard, when\n ...","htmlSnippet":"Growing Up in the <b>Kennedy</b> Family. Rose <b>Fitzgerald Kennedy</b>, who was a very <br>\ndisciplined and organized woman, made the following entry on a notecard, when<br>\n&nbsp;...","cacheId":"_oNzk2bpF_cJ","formattedUrl":"www.jfklibrary.org/JFK/Life-of-John-F-Kennedy.aspx","htmlFormattedUrl":"www.<b>jfk</b>library.org/<b>JFK</b>/Life-of-<b>John</b>-<b>F</b>-<b>Kennedy</b>.aspx","pagemap":{"cse_image":[{"src":"http://www.jfklibrary.org/~/media/assets/Audiovisual/Still%20Photographs/PX%20Photo%20Accessions/PX%2093-49%20P16.jpg?w=300&h=311&as=1"}],"cse_thumbnail":[{"width":"220","height":"229","src":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRVBsK1db504ToApvLlFc8wY29szI5JwsUaJTprCfJgk8-t4fmVJEZueR38"}],"metatags":[{"title":"Life of John F. Kennedy"}],"breadcrumb":[{"url":"Home","title":"Home"},{"url":"JFK","title":"JFK"},{"url":"http://www.jfklibrary.org/JFK/Life-of-John-F-Kennedy.aspx"}]}},{"kind":"customsearch#result","title":"American President: John Fitzgerald Kennedy","htmlTitle":"American President: <b>John Fitzgerald Kennedy</b>","link":"http://millercenter.org/president/kennedy","displayLink":"millercenter.org","snippet":"A Life in Brief: John F. Kennedy was born into a rich, politically connected Boston \nfamily of Irish-Catholics. He and his eight siblings enjoyed a privileged ...","htmlSnippet":"A Life in Brief: <b>John F</b>. <b>Kennedy</b> was born into a rich, politically connected Boston <br>\nfamily of Irish-Catholics. He and his eight siblings enjoyed a privileged&nbsp;...","cacheId":"ZJMS7WfhjSsJ","formattedUrl":"millercenter.org/president/kennedy","htmlFormattedUrl":"millercenter.org/president/<b>kennedy</b>","pagemap":{"cse_image":[{"src":"http://staticmc.org/images/academic/americanpresident/presidents/kennedy.jpg.pagespeed.ce.v5UdquvRSW.jpg"}],"cse_thumbnail":[{"width":"124","height":"185","src":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ85dzL_KsSWAzrsqTDmyoq41L-XikWGjkL6Hm80IbGF7lSfmPJkz5YIA"}],"hcard":[{"fn":"Kristy Schantz"},{"fn":"Sheila Blackford"},{"fn":"Doug Trout","url":"http://millercenter.org/about/staff/trout","url_text":"Doug Trout"}]}},{"kind":"customsearch#result","title":"John F. Kennedy Quotes - BrainyQuote","htmlTitle":"<b>John F</b>. <b>Kennedy</b> Quotes - BrainyQuote","link":"http://www.brainyquote.com/quotes/authors/j/john_f_kennedy.html","displayLink":"www.brainyquote.com","snippet":"Enjoy the best John F. Kennedy Quotes at BrainyQuote. Quotations by John F. \nKennedy, American President, Born May 29, 1917. Share with your friends.","htmlSnippet":"Enjoy the best <b>John F</b>. <b>Kennedy</b> Quotes at BrainyQuote. Quotations by <b>John F</b>. <br>\n<b>Kennedy</b>, American President, Born May 29, 1917. Share with your friends.","cacheId":"C_08v_WPxEIJ","formattedUrl":"www.brainyquote.com/quotes/authors/j/john_f_kennedy.html","htmlFormattedUrl":"www.brainyquote.com/quotes/authors/j/<b>john</b>_<b>f</b>_<b>kennedy</b>.html","pagemap":{"cse_image":[{"src":"http://www.brainyquote.com/photos/j/johnfkennedy105511.jpg"}],"cse_thumbnail":[{"width":"280","height":"180","src":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS9arm9dXqI7kz2m4bA6c85Ve5XUhA5NJ2sS0rCp67JyurasJEDsMc3B0g"}],"metatags":[{"ver":"3.3.8:1060572","msapplication-config":"none","apple-mobile-web-app-capable":"yes","ts":"1424182688","og:site_name":"BrainyQuote","og:title":"John F. Kennedy Quotes at BrainyQuote","og:type":"article","og:description":"Enjoy the best John F. Kennedy Quotes at BrainyQuote. Quotations by John F. Kennedy, American President, Born May 29, 1917. Share with your friends.","og:image":"/photos/j/johnfkennedy105511.jpg","og:image:type":"image/jpeg","og:image:width":"620","og:image:height":"400","twitter:card":"summary_large_image","twitter:site":"@BrainyQuote","twitter:app:id:iphone":"916307096","twitter:app:id:ipad":"916307096","twitter:creator":"@BrainyQuote","twitter:title":"John F. Kennedy Quotes","twitter:description":"\"As we express our gratitude, we must never forget that the highest appreciation is not to utter words, but to live by them.\" - John F. Kennedy","twitter:image:src":"/photos/j/johnfkennedy105511.jpg","apple-itunes-app":"app-id=916307096","og:url":"http://www.brainyquote.com/quotes/authors/j/john_f_kennedy.html"}]}}]};
// Samples Images search result:
	var img = {"kind":"customsearch#search","url":{"type":"application/json","template":"https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&cref={cref?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"},"queries":{"nextPage":[{"title":"Google Custom Search - John F. Kennedy","totalResults":"42700000","searchTerms":"John F. Kennedy","count":10,"startIndex":11,"inputEncoding":"utf8","outputEncoding":"utf8","safe":"medium","cx":"009891011242125557270:-diy3sstn-y","gl":"fr","hl":"lang_fr","dateRestrict":"m[3]","searchType":"image"}],"request":[{"title":"Google Custom Search - John F. Kennedy","totalResults":"42700000","searchTerms":"John F. Kennedy","count":10,"startIndex":1,"inputEncoding":"utf8","outputEncoding":"utf8","safe":"medium","cx":"009891011242125557270:-diy3sstn-y","gl":"fr","hl":"lang_fr","dateRestrict":"m[3]","searchType":"image"}]},"context":{"title":"hapteo"},"searchInformation":{"searchTime":0.20635,"formattedSearchTime":"0,21","totalResults":"42700000","formattedTotalResults":"42 700 000"},"items":[{"kind":"customsearch#result","title":"JFK, une image américaine","htmlTitle":"<b>JFK</b>, une image américaine","link":"http://www.bpi.fr/files/live/sites/Balises/files/Images/Histoire/JFK_aymeric/jfk-1.jpg","displayLink":"www.bpi.fr","snippet":"JFK, une image américaine","htmlSnippet":"<b>JFK</b>, une image américaine","mime":"image/jpeg","image":{"contextLink":"http://www.bpi.fr/histoire/jfk-une-image-americaine","height":2889,"width":2248,"byteSize":742443,"thumbnailLink":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQp6Ce8QzEpLOyPhh3g_Ot_tyJ2S5NZpoC5iQscaARnZlAxDGMMXDhWaL5","thumbnailHeight":150,"thumbnailWidth":117}},{"kind":"customsearch#result","title":"jfk-in-his-own-words-1024.jpg","htmlTitle":"<b>jfk</b>-in-his-own-words-1024.jpg","link":"http://harvardpolitics.com/blog/wp-content/uploads/2013/11/jfk-in-his-own-words-1024.jpg","displayLink":"harvardpolitics.com","snippet":"jfk-in-his-own-words-1024.jpg","htmlSnippet":"<b>jfk</b>-in-his-own-words-1024.jpg","mime":"image/jpeg","image":{"contextLink":"http://harvardpolitics.com/united-states/john-f-kennedy-nations-service/","height":576,"width":1024,"byteSize":108483,"thumbnailLink":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQq9UAInxyibnl0j_hJuBSsIDbdJj5ndB79kpyPByMwZBKCHicQbRM3GEo","thumbnailHeight":84,"thumbnailWidth":150}},{"kind":"customsearch#result","title":"Profile of an Orator: John F. Kennedy | Rhetoric and Leadership ...","htmlTitle":"Profile of an Orator: <b>John F</b>. <b>Kennedy</b> | Rhetoric and Leadership <b>...</b>","link":"http://blog.iese.edu/leggett/files/2012/04/John_F._Kennedy_White_House_color_photo_portrait.jpg","displayLink":"blog.iese.edu","snippet":"Picture from Wikipedia","htmlSnippet":"Picture from Wikipedia","mime":"image/jpeg","image":{"contextLink":"http://blog.iese.edu/leggett/2012/04/12/profile-of-an-orator-john-f-kennedy/","height":822,"width":686,"byteSize":112351,"thumbnailLink":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwBuiqjHi21XuL-p3G948FeKMuz4g0o7A-VisGoKr1AFGollIsv69zgtuL","thumbnailHeight":144,"thumbnailWidth":120}},{"kind":"customsearch#result","title":"Lincoln–Kennedy coincidences urban legend - Wikipedia, the free ...","htmlTitle":"Lincoln–<b>Kennedy</b> coincidences urban legend - Wikipedia, the free <b>...</b>","link":"http://upload.wikimedia.org/wikipedia/commons/5/5e/John_F._Kennedy,_White_House_photo_portrait,_looking_up.jpg","displayLink":"en.wikipedia.org","snippet":"John F. Kennedy","htmlSnippet":"<b>John F</b>. <b>Kennedy</b>","mime":"image/jpeg","image":{"contextLink":"http://en.wikipedia.org/wiki/Lincoln%E2%80%93Kennedy_coincidences_urban_legend","height":970,"width":760,"byteSize":452381,"thumbnailLink":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWFOsLHey4XkS-cmXM8I3-0rS0dhR1ssV8joWSPKxD_Qw_n2CFXX10YEI","thumbnailHeight":149,"thumbnailWidth":117}},{"kind":"customsearch#result","title":"John F. Kennedy - U.S. Presidents - HISTORY.","htmlTitle":"<b>John F</b>. <b>Kennedy</b> - U.S. Presidents - HISTORY.","link":"http://cdn.history.com/sites/2/2013/11/John_F_Kennedy-H.jpeg","displayLink":"www.history.com","snippet":"John F. Kennedy","htmlSnippet":"<b>John F</b>. <b>Kennedy</b>","mime":"image/jpeg","image":{"contextLink":"http://www.history.com/topics/us-presidents/john-f-kennedy","height":454,"width":1389,"byteSize":387402,"thumbnailLink":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQB9VdReUngwPdlaFioUgEC2MIJoxkUEJqYp7xicy-TO2EJwIBzFi6jW_Zh","thumbnailHeight":49,"thumbnailWidth":150}},{"kind":"customsearch#result","title":"John Fitzgerald Kennedy – Wikipedia, wolna encyklopedia","htmlTitle":"<b>John Fitzgerald Kennedy</b> – Wikipedia, wolna encyklopedia","link":"http://upload.wikimedia.org/wikipedia/commons/3/3f/John_F_Kennedy.jpg","displayLink":"pl.wikipedia.org","snippet":"John F. Kennedy (1961)","htmlSnippet":"<b>John F</b>. <b>Kennedy</b> (1961)","mime":"image/jpeg","image":{"contextLink":"http://pl.wikipedia.org/wiki/John_Fitzgerald_Kennedy","height":3432,"width":2841,"byteSize":363269,"thumbnailLink":"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR6u6TZa6NeS776-E0HoQYwze42wNzgB2O2SBvWoqZ1I7pEptKgEciIFmRM","thumbnailHeight":150,"thumbnailWidth":124}},{"kind":"customsearch#result","title":"John F. Kennedy","htmlTitle":"<b>John F</b>. <b>Kennedy</b>","link":"http://citelighter-cards.s3.amazonaws.com/p17jf9qlps1dlj1t4r1cspg1dp790_74312.png","displayLink":"www.citelighter.com","snippet":"John F. Kennedy","htmlSnippet":"<b>John F</b>. <b>Kennedy</b>","mime":"image/png","fileFormat":"Image Document","image":{"contextLink":"http://www.citelighter.com/political-science/presidents/knowledgecards/john-f-kennedy","height":579,"width":473,"byteSize":257916,"thumbnailLink":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRvY9mIc1WN180lxodIdMfHq4qif48UyliYAOb1_RHZBvjRbkFqefZiwPYr","thumbnailHeight":134,"thumbnailWidth":109}},{"kind":"customsearch#result","title":"United States presidential election, 1960 - Wikipedia, the free ...","htmlTitle":"United States presidential election, 1960 - Wikipedia, the free <b>...</b>","link":"http://upload.wikimedia.org/wikipedia/commons/1/12/John_Fitzgerald_Kennedy.png","displayLink":"en.wikipedia.org","snippet":"John Fitzgerald Kennedy.png","htmlSnippet":"<b>John Fitzgerald Kennedy</b>.png","mime":"image/png","fileFormat":"Image Document","image":{"contextLink":"http://en.wikipedia.org/wiki/United_States_presidential_election,_1960","height":269,"width":220,"byteSize":88814,"thumbnailLink":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeS_BPxLrCKEox_raAcnUIKjSj4TJ4-oVaY3TMdlsBk3XsSUjvgrZQYQ","thumbnailHeight":113,"thumbnailWidth":92}},{"kind":"customsearch#result","title":"John F. Kennedy | The Bully Pulpit","htmlTitle":"<b>John F</b>. <b>Kennedy</b> | The Bully Pulpit","link":"http://jrbenjamin.files.wordpress.com/2012/11/john-f-kennedy.jpg","displayLink":"jrbenjamin.com","snippet":"John F. Kennedy. “","htmlSnippet":"<b>John F</b>. <b>Kennedy</b>. “","mime":"image/jpeg","image":{"contextLink":"http://jrbenjamin.com/tag/john-f-kennedy/","height":772,"width":1280,"byteSize":136142,"thumbnailLink":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFl7WMOB3C-35071_vVuiaIfFUMgTcNSX2mZyVppFe4Q4j3yFMxoL4DA","thumbnailHeight":90,"thumbnailWidth":150}},{"kind":"customsearch#result","title":"JFK official portrait - John F. Kennedy Presidential Library & Museum","htmlTitle":"<b>JFK</b> official portrait - <b>John F</b>. <b>Kennedy</b> Presidential Library &amp; Museum","link":"http://www.jfklibrary.org/~/media/assets/Audiovisual/Still%20Photographs/Ernest%20Hemingway%20Photograph%20Collection/JFK%20Official.jpg","displayLink":"www.jfklibrary.org","snippet":"JFK official portrait","htmlSnippet":"<b>JFK</b> official portrait","mime":"image/jpeg","image":{"contextLink":"http://www.jfklibrary.org/Asset-Viewer/oaPraRSbwEKIuJ2h-Bi2VA.aspx","height":2847,"width":2217,"byteSize":837368,"thumbnailLink":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRyyEzdUG4ki2l-qiyc2Putxj8RipPLQcouCOc9Z0IfVPdV0UY8RmF5DVg","thumbnailHeight":150,"thumbnailWidth":117}}]};

	if(source === 'web')
		deferred.resolve(web);
	else
		deferred.resolve(img);
	/*End of block to delete*/
	
	
	return deferred.promise;
};








/**
	The only visible function in this module. It
	only creates a new analysis and launch it.
*/
var getInstance = function(){
	return new WebSearcher();
};
exports.getInstance = getInstance;