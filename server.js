const express = require('express') // require the express package
const app = express() // initialize your express app instance
const cors = require('cors');
const axios = require('axios'); // require the package
const mongoose = require("mongoose");
app.use(cors()) // after you initialize your express app instance
app.use(express.json())
require('dotenv').config();
const PORT = process.env.PORT;



mongoose.connect("mongodb://localhost:27017/exam401", { useNewUrlParser: true });
const Schema = mongoose.Schema;

const DrinkSchema = new Schema({
  strDrink: String,
  strDrinkThumb: String,
  idDrink: String,

});

const DrinkModel = mongoose.model("Drink", DrinkSchema);

// inside your callback function
// axios.get(url).then(response => response.data).catch(error => console.log(error));
// a server endpoint 

app.get('/', // our endpoint name
  function (req, res) { // callback function of what we should do with our request
    res.send('Hello World') // our endpoint function response
  })

// inside your callback function
// axios.get(url).then(response => response.data).catch(error => console.log(error));
// a server endpoint 

// endpoint
app.get('/getData', getDataHandler)
app.post('/addToFav', addToFavHandler)
app.get('/getFavData', getFavDataHandler)
app.delete('/deletFav', deletFavHandler)
app.put('/updateFav', updateFavHandler)



// get data from API 
class Drink {
  constructor(item) {
     this.strDrink = item.strDrink;
      this.strDrinkThumb = item.strDrinkThumb;
      this.idDrink = item.idDrink ;
  }
}

// function 
function getDataHandler (req,res){
  const url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic'
  axios.get(url).then(result => {
    let drinkArr =result.data.map(item=>{
       return new Drink(item)
    })
    res.send(drinkArr)
  })
  console.log(drinkArr)
}

function addToFavHandler (req ,res){
  const {strDrink, strDrinkThumb, idDrink,} = req.body ;
  let newDrink = new DrinkModel({
    strDrink: strDrink,
    strDrinkThumb: strDrinkThumb,
    idDrink:idDrink,
  } )
  newDrink.save()
console.log('newDrink', newDrink)
}

function  getFavDataHandler(req,res){
  DrinkModel.find({},(err,data)=>{
    res,send(data)
  })
}

function deletFavHandler (req, res){
  const id=req.query.id;
  DrinkModel.find({ idDrink : id},(err,data)=>{
    DrinkModel.find({},(err,data)=>{
      res,send(data)
    })
  })
}

function  updateFavHandler(req,res){
  const {strDrink, strDrinkThumb, idDrink,} = req.body ;
  DrinkModel.find({ idDrink : id},(err,data)=>{
    data[0].strDrink =strDrink ;
    data[0].strDrinkThumb =strDrinkThumb ;
    data[0].idDrink =idDrink ;
    data[0].save()
    .then(()=>{
      DrinkModel.find({},(err,data)=>{
        res,send(data)
      })

    })
  })
}



app.listen(PORT, console.log(`listen on ${PORT}`)) // kick start the express server to work