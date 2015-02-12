var express = require('express');
var router = express.Router();

console.log("******* BE Patient : Core nlp is loading, it might take up to one minute… ");
var NLP = require('stanford-corenlp');
var config = {"nlpPath":"./lib/stanford-corenlp-3.4","version":"3.4"};
//var coreNLP = new NLP.StanfordNLP(config)
//coreNLP.loadPipelineSync();
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
		//send text to coreNLP and return result with status 200
	/*	coreNLP.process(params.string, function(err, result)*/ {
			var needles = phraseCleaner.clean("result");
			var images = imageSearcher.searchImage(needles);
			
			//console.log(err,JSON.stringify(result));
			res.status(200).send(images);
		}
		/*);*/
	}

});


module.exports = router;
