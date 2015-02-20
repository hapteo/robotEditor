# robotEditorServer
RobotEditorServer est l'API du projet Hapteo.

## Qu'est ce que RobotEditorServer?
RobotEditor est un POC.

## Installation
robotEditorServer est développé en javascript + node.js.


## Dépendances
Hapteo utilise les frameworks suivants :

* [Standord CoreNLP](http://nlp.stanford.edu/software/corenlp.shtml)
* Stanford-core-nlp dans sa version wrapper node.js [core-nlp-master](https://github.com/hiteshjoshi/node-stanford-corenlp).
* Le module NodeJS [googleapis](https://www.npmjs.com/package/googleapis), et plus précisément la partie custom search

La partie nlp nécessite l'installation de JAVA et JAVA sdk. robotEditorServer utilise [Stanford CoreNLP](http://nlp.stanford.edu/software/corenlp.shtml) v3.4 ou supérieur. Vous devrez installer ce framework dans le réperoire /lib et définir le chenin vers ce répertoire et sa version dans index.js (ex : var config = {"nlpPath":"./lib/stanford-corenlp-3.4","version":"3.4"};
)
Stanford Corenlp nécessite l'installation de JAVA. Ne pas oublier de définir comme variable d'environnement [JAVA_HOME](https://github.com/nearinfinity/node-java).

L'utilisation de googleapis nécessite d'avoir à disposition:
* une clef pour l'API custom search. Cette clef peut-être obtenue via [la console d'un projet](https://console.developers.google.com/project?_ga=1.123096587.1006488701.1424181039)
* L'identifiant d'un moteur de recherhe personnalisé (CX). Un tel moteur peut être créé sur [cette page](https://www.google.com/cse/all). Il vaut mieux le paramétrer comme pouvant accéder à "tout internet"

Ces deux clefs doivent ensuite être placées dans un fichier private_keys.js, qui n'est pas inclu dans les sources par mesure de sécurité. Il suffit de placer à l'intérieur le contenu suivant:

```javascript
var api = 'YOUR_API_KEY';
var cx = 'CX_NUMBER';
exports.api = api;
exports.cx = cx;
```



