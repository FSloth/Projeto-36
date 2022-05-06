var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feedDog;
var feedtime;

//create feed and lastFed variable here
var feed, lastFed


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedDog = createButton("Feed Dog");
  feedDog.position(800,95);
  feedDog.mousePressed(feedDogs);

  addFood = createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedtime = database.ref("timefood");
  feedtime.on("value",function(data){
    lastFed = data.val();
  })
 
  //write code to display text lastFed time here
  if(lastFed >= 12){
  textSize(30);
  fill("blue");
  text("última refeição: " + lastFed + " P.m", 50, 300)
  }else
  if(lastFed <= 12){
  textSize(30);
  fill("red");
  text("última refeição: " + lastFed + "A.m", 50, 300)
  }
  
  

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDogs(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var foodstockval = foodObj.getFoodStock();
  if(foodstockval <=0){
    foodObj.updateFoodStock(foodstockval*0);
  }else{
    foodObj.updateFoodStock(foodstockval -1)
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    timefood:hour(),
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
