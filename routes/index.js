var express = require('express');
var router = express.Router();
var webSearcher = require ("./webSearcher");
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


/* POST analyze page with string. 
TODO: sanitize user input !
*/
router.post('/analyze', function(req, res, next) {

	var params = getParams(req);
	var output = "no answer";

	if (params.string === undefined || params.string.length == 0) {
		output="Body malformed : String parameter is missing";
		res.render('test', { title: 'test', answer:output });
	} else {
		nlp.userTextAnalysis(params.string).then(
			function(result){
				res.render('test', { title: 'test', answer:JSON.stringify(result) });
			},
			function(error){
				res.render('test', { title: 'test', answer:error });
			}

		).done();
	}
	

});


module.exports = router;
