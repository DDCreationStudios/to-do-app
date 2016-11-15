var bodyParser=require("body-parser");
var mongoose=require("mongoose");
//connect database
mongoose.connect("mongodb://test:test@ds147537.mlab.com:47537/todo");
//Create a schema, ie a blueprint
var todoSchema= new mongoose.Schema({
  item: String
});

var Todo = mongoose.model("Todo", todoSchema);


//var data=[{item:"get milk"}, {item:"walk dog"}, {item:"coding"}];
var urlencodedParser=bodyParser.urlencoded({extended:false});

module.exports=function(app){
  app.get("/", function(req, res){
    //get data from mongodb and pass it to view
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render("todo", {todos:data});
    });
  });
  app.post("/todo", urlencodedParser, function(req, res){
    //get data from the view and add it to mongodb
    var newTodo=Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });
  app.delete("/todo/:item", function(req, res){
    //delete the requested item from mongodb
    Todo.find({item:req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
      if(err) throw err;
      res.json(data);
    });//replacing "-" with a space
  });
};
