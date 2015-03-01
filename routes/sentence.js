//"use strict";

/**
* This is an easier way to deal with the stanford parser results AND to transfer user input analysis from class
* to class
*/
function Sentence(){
	this.tokens = [];
	this.nbTokens = 0;
	this.literal = "";
	this.needle = "";
	this.img = [];
	this.web = [];
	this.order = 0;
}

/**
* Takes a stanford parsed sentence and generates a sentence model easily usable for us
* @param {JSON} the stanford parsed sentence
* @return [String] the original sentence
*/
Sentence.prototype.generateSentence=function(parsedSentence){
	this.tokens = parsedSentence.tokens.token;
	this.nbTokens = this.tokens.length;
	this.literal = this.extractLiteral();
	this.needle = this.extractNeedle();
}

/**
* Define the location of the sentence in the text, can be considered as an identifier
* @param {order:integer} the sentence's order
* @return [0:integer]
*/
Sentence.prototype.setOrder=function(order){
	this.order = order;
};
/**
* Create a string to recover the original sentence
* @param {JSON} the stanford tokens list
* @return [String] the original sentence
*/
Sentence.prototype.extractLiteral=function(){
	var literal = "";
	for(var cpt=0; cpt<this.nbTokens; cpt++){
		literal += this.tokens[cpt].word+" ";
	}

	return literal;
}


/**
* Create a string with the mist relevant words in order to make a web search with it
* @param {JSON} the stanford tokens list
* @return [String] the needle associated with this sentence
*/
Sentence.prototype.extractNeedle=function(){
	var needle = "";
	for(var cpt=0; cpt<this.nbTokens; cpt++){
		needle += this.tokens[cpt].lemma+" ";
	}

	return needle;
}


/**
	The only visible function in this module. It
	only creates a new analysis and launch it.
*/
var getInstance = function(){
	return new Sentence();
};
module.exports.getInstance = getInstance;