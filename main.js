/**
 * TWEB - Github API Project
 *
 * @author  Benoît Zuckschwerdt
 * @date    2016-01-07
 *
 * @version 0.1
 *
 * Code serveur principal:
 *  + ...
 */
var PORT = process.env.PORT || 1337;

var express = require('express');
var app = express();

// Met le serveur en écoute sur le port spécifié.
var server = app.listen(PORT, function() {
  console.log("listen on port "+PORT);
});

// Permet au code client d'utiliser les dossiers et fichiers
// contenu dans le dossier public.
app.use(express.static('public'));

// Envoie le fichier index.html lorsque l'on cherche
// a atteindre la racine /.
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
