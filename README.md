# TWEB - Github API Project

## Buts du projet

Mettre en place une application utilisant Angular qui intéragit avec l'API de Github et la déployer sur Heroku.

## Fonctionnalités

* S'authentifier sur l'API de Github via OAuth
* Retrouver les informations personnelles d'un utilisateur Github
* Retrouver les repos publiques de l'utilisateur en question
* Afficher plusieurs statistiques d'un repo avec ChartJS
  * Nombre d'ajouts et de suppressions par semaine (line chart)
  * Nombre de commit durant les dix dernières semaines (bar chart)
  * Activité des commits de la dernière semaine (bar chart)

## Technologies utilisées

* Node.js
* jQuery
* Twitter Bootstrap
* AngularJS
* ChartJS
* Express

## Structure

* public (contenu destiné au client)
  * css (feuilles de style angular-chart et bootstrap)
  * ctrl (controlleur angular)
  * js (librairies angular, ChartJS et jQuery)
* main.js (code principal du serveur)
* index.html (vue principale)

## Node.js (server-side)

Node.js écoute sur le port 1337 et initialise Express qui permet de rendre le dossier *public* et son contenu accessible au client.

Node.js fournit également au client la page *index.html* qui est chargé lorsque la racine */* est atteinte.

## Appels de l'API (client-side)

Depuis la vue principale l'on peut entrer le nom d'utilisateur voulu, ici *xajkep*:

![](img/ss_personal_info.png)

Ensuite deux premières requêtes sont effectuée auprès de l'API.

### Récupération des données utilisateurs: GET /users/:username

*[Documentation](https://developer.github.com/v3/users/)*

Cette requête permet de retrouver l'url de l'avatar et les informations contenu dans le tableau de droite.

### Récupération des repos publiques de l'utilisateur: GET /repos/:owner/:repo

*[Documentation](https://developer.github.com/v3/repos/#get)*

Cette requête permet de retrouver tous les repos publiques de l'utilisateur.


![](img/ss_repos.png)

À noter que si le jeton d'authentification utilisé possédait les droits de lecture sur les repo privés, ceux-ci figureraient également dans ce tableau.

### Chargement des statistiques d'un repo

*[Documentation](https://developer.github.com/v3/repos/statistics/)*

On peut charger les statistiques d'un repo en utilisant le bouton "Load stats". Les requêtes utilisées pour récupérer les statistiques du repo sont les suivantes (dans l'ordre d'affichage des graphiques):
* GET /repos/:owner/:repo/stats/code_frequency
* GET /repos/:owner/:repo/stats/participation
* GET /repos/:owner/:repo/stats/commit_activity

Il a bien entendu été nécessaire de modifier les données reçues avant de les passer à Chart.js.

![](img/ss_stats_1.png)
![](img/ss_stats_2.png)
![](img/ss_stats_3.png)

## jQuery (client-side)

jQuery est utilisé pour simplifier et rendre plus concis certaines parties du code. En l'occurrence ici pour effectuer les appels à l'API c'est la méthode jQuery *$.ajax* qui est utilisée.

## Twitter Bootstrap (client-side)

Bootstrap est un framework HTML, CSS et JS pour développer des applications Web. Il est utilisé dans ce projet pour la mise en forme de la page principale.

## Angular (client-side)

Angular permet de gérer les données affichées sur la page avec un système vue/controlleur. La vue étant la page *index.html* et le controlleur étant le fichier *js/ctrl/api.js*.

La vue intérargit avec le controlleur grâce aux fonctions Angular déclarées dans le controlleur et aux diréctives Angular présentent dans la vue (attributs *ng-**).

Les deux fonctions Angular déclarée sont *user( )* et *stats( reponame )*, la première permet d'obtenir les informations de l'utilisateur et ses repos publiques. La seconde quant à elle effectue les trois requêtes de statistiques présentées plus haut et manipule les données reçues pour fournir à Chart.js les champs *labels*, *series* et *data* nécessaire au bon affichage des graphiques.

Une fois les données prêtent elles sont attribuées à des sous-variables de *$scope* permettant ainsi à la vue de charger les valeurs via l'utilisation de doubles crochet, example:

~~~js
// Dans le controlleur
...
$scope.maVariable = "bonjour";
...
~~~

~~~html
<!-- Dans la vue -->
...
<h1>{{maVariable}}</h1>
...
~~~

## Authentification (client-side)

L'authentification se fait via un jeton OAuth généré sur Github ([https://github.com/settings/tokens](https://github.com/settings/tokens))

Ce jeton est passé dans le header HTTP, comme ceci:
~~~
Authorization: token a90dc0cd257b523adca07df4cb93cd0c8a265ef6
~~~

![](img/ss_jeton.png)

Pour éviter que ce jeton permette d'accéder à des données privées ou bien de modifier des données de l'utilisateur, on prend soin de retirer tous les droits, de cette manière l'utilisation de ce jeton ne fait qu'utiliser notre identité. Notons tout de même que cela permet à tout le monde d'utiliser notre *rate limit* qui est la limite d'appels à l'API pour les utilisateur authentifié.

## Deploiement sur Heroku

~~~sh
$ heroku create tweb-github-api-project
$ git push heroku master
$ heroku open
~~~

Lien: [https://tweb-github-api-project.herokuapp.com/](https://tweb-github-api-project.herokuapp.com/)

## Problème connu

Lors du chargement des statistiques, il est parfois nécessaire d'appuyer deux fois sur le bouton "Load stats", car il est possible que l'API de Github réponde avec un status *202 Accepted* sans renvoyer de données. Ce qui déclanche d'ailleur une erreur, car dans ce cas les données ne sont pas définies.

Une requête qui fonctionne retournera un status *200 OK*, comme on peut le voir ci-dessous.

![](img/ss_probleme_connu.png)

## Liens, sources et documentation

* [Repo Github](https://github.com/xajkep/tweb-github-api-project)
* [Lien Heroku](https://tweb-github-api-project.herokuapp.com/)
* [Github API Documentation](https://developer.github.com/v3/)
* [Angular Chart Documentation](http://jtblin.github.io/angular-chart.js/)
* [jQuery Documentation](https://api.jquery.com/)
* [w3schools, Documentation pour le développement Web](http://www.w3schools.com/)
