const { response } = require('express');
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

/*******************************
 * 2.4 Un micro-service avec un état
 *******************************/

var allMsgsV1 = ["Hello World", "foobar", "CentraleSupelec Forever"]

// Version 2 of Messages store list :
let allMsgs = [
  { msg: "Hello World", pseudo: "user 1", date: "01/01/1970" },
  { msg: "foobar", pseudo: "user 1", date: "01/01/1970" },
  { msg: "CentraleSupelec Forever", pseudo: "user 1", "date": "01/01/1970" }
];



// Route /msg/get/:msgId to get a specific message
app.get("/msg/get/*", function(req, res) {

  let id = req.params[0];
  if (parseInt(id) || id == 0) {
    id = parseInt(id);
    if (id < allMsgs.length) {
      msgToSend = { "code": 1, "msg": "" };
      msgToSend.msg = allMsgs[id];
      res.json(msgToSend);
      console.log("Successfule get message with id:", id);
    } else {
      res.json({ "code": 0 });
      console.log("Error get message with id, length:", id);
    }
  }
  else {
    res.json({ "code": 0 });
    console.log("Error get message with id, provided parameters:", id);
  }

})

//Route /msg/nber to get the number of messages
app.get("/msg/nber", function(req, res) {
  let response = { "length": allMsgs.length };
  res.json(response);
  console.log("Successful get number of messages");
}
);

//Route /msg/getAll to get all messages
app.get("/msg/getAll", function(req, res) {
  let response = { "datas": allMsgs };
  res.json(response);
});

//Route /msg/post/:msg to post a new message v1
/* Depracated version */
/*
app.get("/msg/post/*", function(req, res) {
  let response = { "code": 0, "msg": 0 };
  try {
    let newMsg = req.params[0];
    let formattedMsg = {
      msg: unescape(newMsg), pseudo: "user 1", date: new Date().toLocaleString()
    }
    allMsgs.push(formattedMsg);
    let response = { "code": 1, "posted_in": allMsgs.length - 1 };
    res.json(response);
    console.log("Successful post message:", newMsg);
  }
  catch (e) {
    console.log("Error post message:", e);
    res.json(response);
  }

});
*/
//Route /msg/post/:msg to post a new message v2

app.get("/msg/post", function(req, res) {
  let response = { "code": 0, "msg": 0 };
  try {
    let newMsg = req.query["msg"];
    let pseudo = req.query["pseudo"];
    let formattedMsg = {
      msg: decodeURIComponent(newMsg), pseudo: decodeURIComponent(pseudo), date: new Date().toLocaleString()
    }
    allMsgs.push(formattedMsg);
    let response = { "code": 1, "posted_in": allMsgs.length - 1 };
    res.json(response);
    console.log("Successful post message:", newMsg, "pseudo : ", pseudo);
  }
  catch (e) {
    console.log("Error post message:", e);
    res.json(response);
  }

});

app.get("/msg/delete", function(req, res) {
  let response = { "code": 0, "msg": "All Messages are successfully deleted" };
  allMsgs = [];
  console.log("All Messages are successfully deleted : ", allMsgs);

  res.json(response);
});

app.listen(8080, "0.0.0.0"); //commence à accepter les requêtes
console.log("App listening on port 8080...");



