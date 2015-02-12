var express = require('express');
var router = express.Router();

console.log("******* BE Patient : Core nlp is loading, it might take up to one minute… ");
var NLP = require('stanford-corenlp');
var config = {"nlpPath":"./lib/stanford-corenlp-3.4","version":"3.4"};

var isCorenlpEnabled = false;
var coreNLP;
var corenlpSample;

//Set isCorenlpEnabled to true to enable corenlp parsing otherwise will use one of the sample result (corenlpSample.sample1, corenlpSample.sample2…) set in corenlpSamples.js
if (isCorenlpEnabled) {
	coreNLP = new NLP.StanfordNLP(config)
	coreNLP.loadPipelineSync();
}
else 
	corenlpSample = require('./corenlpSamples');

console.log("******* Core nlp is loaded… ");


var phraseCleaner = require ("./phraseCleaner")
var imageSearcher = require ("./imageSearcher")

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


/* POST analyze page with string. */
router.post('/analyze', function(req, res, next) {

	var params = getParams(req);

	if (params.string === undefined || params.string.length == 0) {
		res.status(500).send("Body malformed : String parameter is missing");
	} else {
		if (isCorenlpEnabled) {
			//send text to coreNLP and return result with status 200		
			coreNLP.process(params.string, function(err, result) {
				//console.log('\n'+JSON.stringify(result));
				var needles = phraseCleaner.clean(result);
				var images = imageSearcher.searchImage(needles);
				res.status(200).send(images);
			});
		} else {
			//use corenlpSamples.samplexxx 		
			//console.log('\n'+JSON.stringify(corenlpSample.sample1));
			var needles = phraseCleaner.clean(corenlpSample.sample1);
			var images = imageSearcher.searchImage(needles);
			res.status(200).send(images);
		}
	}

});


module.exports = router;
