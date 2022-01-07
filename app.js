
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set('view engine', 'ejs');                   /*EJS view machine*/
app.use(bodyParser.urlencoded({extended: true}));/*body-parser*/


// Connect To Database
// DatabaseName --> wikiDB

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

// Create a Shema / Table / Collection
const articlShcema = {
    title:String,
    content:String
};

// Create a Model 
Article = mongoose.model("article",articlShcema);



/*********************************************************/
app.route("/articles")

.get(function(req,res){
    Article.find({},function(err,found){
        res.send(found);
    });
})

.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send  ("succesfully added");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Deleted Successfully");
        }
    });
});

/******************************************************************/
 
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,found){
        if(found){
            res.send(found);
        }
        else{
            res.send("no match found");
        }
    });
})

.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,
        content:req.body.content},
        {overwrite:true},
        
        function(err){
                if(!err){
                    res.send("succesfully updated");
                }
        }
    )
})

.patch(function(req,res){
    Article.update({title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("patched succesfully");
            }
        }
        );
})

.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle} ,

        function(err){
            if(!err){
                res.send("Deleted successfully");
            }
        });
});


/***********************************************************************/
app.listen(3000,function(){
  
    console.log("SERVER working SUCCESSFULY");
  });
  