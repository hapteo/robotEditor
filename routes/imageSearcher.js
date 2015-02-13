var imageSearcher = exports = module.exports = {};

/**
 * Clean data from nlp analyzer.
 *
 *
 * @param {[Strings]} needles : List of cleaned strings to input into google image search engine
 * @return {[hash of images linked with keywords to output]]}}  
 *{
 * "investiture John Kennedy”: [
 * 					{"http://img1_1.jpg” : {pertinence:100}},
 * 					{"http://img1_2.jpg” : {pertinence:85}},
 * 					{"http://img1_3.jpg” : {pertinence:75}}
 * 					],
 * "baie cochons 1961”: [
 * 					{"http://img2_1.jpg” : {pertinence:100}},
 * 					{"http://img2_2.jpg” : {pertinence:35}},
 * 					]
 * }
 */

imageSearcher.searchImage = function(needles){
return '{["keyword":"imageURL"]}';
};