var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

let count = 0;

let counter =
{
  name: "counter",
  count: 0,
}

app.get("/update_cmpt", function(req, res) {
  counter.count++;
  counter.count = parseInt(req.query["v"]);
  res.json(counter);
})


/*******************************
 * 2.1 Configuration
 *******************************/

let msg =
{
  msg: ""
}


app.get('/test/*', function(req, res) {
  let responseObj = {
    msg: req.params[0]
  };
  res.json(responseObj);
});


/*******************************
 * 2.3 Un micro-service avec un état
 *******************************/
// Déclaration du compteur global
let cpt = { value: 0 };

// Route /cpt/query : retourne la valeur du compteur
app.get('/cpt/query', function(req, res) {
  res.json(cpt);
  console.log("Returned Counter:", cpt.value);
});

// Route /cpt/inc : incrémente de 1 ou d'une valeur donnée
app.get('/cpt/inc', function(req, res) {
  let responseSuccess = { "code": 0 };
  let responseError = { "code": -1 };

  // Vérifier si un paramètre v est passé
  if (req.query.v !== undefined) {
    let increment = req.query.v;

    // Vérifier si c'est un entier positif
    if (/^\d+$/.test(increment)) {
      cpt.value += parseInt(increment);
      res.json(responseSuccess);
      console.log(`Incremented Counter by ${increment}:`, cpt.value);
    } else {
      res.json(responseError);
      console.log("Invalid increment value:", increment);
    }
  } else {
    // Incrémentation simple de 1
    cpt.value++;
    res.json(responseSuccess);
    console.log("Incremented Counter by 1:", cpt.value);
  }
});



app.listen(8080, "0.0.0.0"); //commence à accepter les requêtes
console.log("App listening on port 8080...");



