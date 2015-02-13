# robotEditorServer
RobotEditorServer est l'API du projet Hapteo.

## Qu'est ce que RobotEditorServer?


## Installation
robotEditorServer est développé en javascript + node.js. La partie nlp nécessite l'installation de JAVA et JAVA sdk.


## Dependencies

Hapteo utilise les frameforks suivants :

* [Standord CoreNLP](http://nlp.stanford.edu/software/corenlp.shtml)
* Stanford-core-nlp dans sa version wrapper node.js [core-nlp-master](https://github.com/hiteshjoshi/node-stanford-corenlp).

robotEditorServer utilise [Stanford CoreNLP](http://nlp.stanford.edu/software/corenlp.shtml) v3.4 ou supérieur. Vous devrez installer ce framework dans le réperoire /lib et  définir le chenin vers ce répertoire et sa version dans index.js (ex : var config = {"nlpPath":"./lib/stanford-corenlp-3.4","version":"3.4"};
)
Stanford Corenlp nécessite l'installation de JAVA. Ne pas oublier de  d'avoir défni comme variable d'environnement [JAVA_HOME](https://github.com/nearinfinity/node-java).





