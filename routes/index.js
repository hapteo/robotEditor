//"use strict";

var express = require('express');
var router = express.Router();
var webSearcher = require ("./webSearcher").getInstance();
var nlp = require('./nlp.js').getInstance();
var q = require('q');

//get params from body
var getParams  = function(req) { 
	if (req.is("application/x-www-form-urlencoded")) {
		return req.body;
		} else 	
		if (req.is("text/plain")) {
			return  JSON.parse(req.body) ;
		}		
	};



/* GET Documentation : home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Hapteo' });
});


/* GET Documentation : analyze page. */
router.get('/analyze', function(req, res, next) {
	res.render('analyze', { title: '/analyze' });
});

/* GET Documentation : test the workflow. */
router.get('/test', function(req, res, next) {
	res.render('test', {title: 'test'});
});


/** 
* POST analyze page with string. 
* @todo: sanitize user input !
*/
router.post('/analyze', function(req, res, next) {

	var params = getParams(req);
	var output = "no answer";

	if (params.string === undefined || params.string.length == 0) {
		output="Body malformed : String parameter is missing";
		res.render('test', { title: 'test', answer:output });
	} else {
		// This function takes all the user's text and sends back a table of Sentences{tokens, nbTokens, literal, needle, img, web}
		nlp.userTextAnalysis(params.string).then(
			function(sentences_apart){

				// once sentences are separated, web search is done to retrieve relevant web content
				webSearcher.go(sentences_apart).then(

					function(sentences_completed){
						/*
						var test = [];
						for(var cpt=0; cpt<sentences_completed.length; cpt++){
							if(sentences_completed[cpt].img[0].url){
								test.push(sentences_completed[cpt].img[0].url);
							}
							else{
								test.push("http://undefined.fr");	
							}
							
						}
						*/
						res.render('test', { title: 'test', answer:sentences_completed });		

						// Now, all the sentences have been attached to images and webresult. Nlp is once again used 
						// to rank these results
					},
					function(error){
						res.render('test', { title: 'test', answer:error });
					}
				).done();
				
			},
			function(error){
				res.render('test', { title: 'test', answer:error });
			}

		).done();
	}
	

});


module.exports = router;
