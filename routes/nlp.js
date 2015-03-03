//"use strict";

/**
	This module will take care of all the nlp process,
	including the call to stanford-corenlp
*/

var q = require('q');
var sentence = require('./sentence');
/**
* This class takes care of every aspct of NLP: text processing, semantic ananlysis...
*/
function Nlp(){
	this.isCoreNlpEnabled = true;
	this.stanfordConfig = {"nlpPath":"./lib/stanford-corenlp-34","version":"3.4"};
	this.stanford = require('stanford-corenlp');
	this.coreNLP = null;

	if(this.isCoreNlpEnabled){
		this.loadCorenlp();
	}
}

/**
* This function load the corenlp library
*/
Nlp.prototype.loadCorenlp = function(){
	console.log("******* BE Patient : Core nlp is loading, it might take up to one minute… ");

	this.coreNLP = new this.stanford.StanfordNLP(this.stanfordConfig);
	this.coreNLP.loadPipelineSync();

	console.log("******* Core nlp is loaded ! ");
};


/**
* [Asynchronous] execute he whole text analysis, returns, for each text's sentence, a relevant (hopefully) needle
* @param {[String]} text to process
* @return [needles]
*/
Nlp.prototype.userTextAnalysis = function(text){
	var deferred = q.defer();
	var ctx = this;
	// First step is to separate each sentence, we use the stanford parser for that
	this.processText(text).then(
		function(result){
			// Then we create a representation of the whole user input, sentence after sentence
			var userInputRepresentation = [];
			var sentences = ctx.extractSentences(result);
			var nbSentences = sentences.length;

			for(var cpt=0; cpt<nbSentences; cpt++){
				var s = sentence.getInstance();
				s.generateSentence(sentences[cpt]);
				s.setOrder(cpt);
				userInputRepresentation.push(s);
			}

			console.log("user input analysis completed, "+nbSentences+" sentences found");
			deferred.resolve(userInputRepresentation);
		},
		function(error){
			console.log('error while parsing input text with stanford-corenlp: '+error);
			deferred.reject();
		}

	).done();

	return deferred.promise;

}


/**
* Extract sentences from the result of a stanford parser
* @param [JSON] JSON result from parser
* @return [JSON] Sentences with information for each word
*/
Nlp.prototype.extractSentences = function(parsedText){
	var res = [];
	// sentence is a table of JSON object: {$, tokens, parse, dependencies, parsedTree}
	var tmp = parsedText.document.sentences.sentence;
	var nbSentences= tmp.length;

	for(var cpt=0; cpt<nbSentences; cpt++){
		res.push(tmp[cpt]);
	}

	return res;
};

/**
* [Asynchronous] analyzes a text through the stanford parser and sends back the result
* @param {[Strings]} text to process
* @return [stanford parser outpu]
*/
Nlp.prototype.processText = function(text){
	
	var deferred = q.defer();
	if(this.isCoreNlpEnabled){
		this.coreNLP.process(text, function(err, result) {
			if(err){
				deferred.reject(err);
			}
			else{
				deferred.resolve(result);	
			}
		});
	}
	else{
		var samples = require('./corenlpSamples');
		var result = samples.frenchSample;
		deferred.resolve(result);
	}
	
	return deferred.promise;
};


/**
	The only visible function in this module. It
	only creates a new analysis and launch it.
*/
var getInstance = function(){
	return new Nlp();
};
module.exports.getInstance = getInstance;