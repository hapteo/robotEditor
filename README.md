# robotEditorServer
RobotEditorServer est l'API du projet Hapteo.

## Qu'est ce que RobotEditorServer?
RobotEditor est un POC.

## Installation
robotEditorServer est développé en javascript + node.js.


## Dependencies
Hapteo utilise les frameworks suivants :

* [Standord CoreNLP](http://nlp.stanford.edu/software/corenlp.shtml)
* Stanford-core-nlp dans sa version wrapper node.js [core-nlp-master](https://github.com/hiteshjoshi/node-stanford-corenlp).

La partie nlp nécessite l'installation de JAVA et JAVA sdk. robotEditorServer utilise [Stanford CoreNLP](http://nlp.stanford.edu/software/corenlp.shtml) v3.4 ou supérieur. Vous devrez installer ce framework dans le réperoire /lib et définir le chenin vers ce répertoire et sa version dans index.js (ex : var config = {"nlpPath":"./lib/stanford-corenlp-3.4","version":"3.4"};
)
Stanford Corenlp nécessite l'installation de JAVA. Ne pas oublier de définir comme variable d'environnement [JAVA_HOME](https://github.com/nearinfinity/node-java).





