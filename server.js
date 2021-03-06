var express = require("express"),
    mongoose = require("mongoose"),
    app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/client"));

app.use(express.bodyParser());
/*
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
*/

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);


app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) { res.json(toDos); });
});

app.post("/todos", function (req, res) {
    console.log(req.body);
    var newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
    newToDo.save(function (err, result) {
      if (err !== null) {
          // the element did not get saved!
          console.log(err);
          res.send("ERROR");
      } else {
          // our client expects *all* of the todo items to be returned, so we'll do
          // an additional request to maintain compatibility
          ToDo.find({}, function (err, result) {
        if (err !== null) {
            // the element did not get saved!
            res.send("ERROR");
        }
        res.json(result);
          });
      }
    });
});

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
