//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
// const myMapData = require(__dirname + "/gmaps.js");




const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://EF13:1313@cluster0.fk4x7.gcp.mongodb.net/vehicles_databse", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
mongoose.set('useUnifiedTopology', true);

//Schemas//

const carsSchema = {
      
    make:String,
    model: String,
    year: String,
    seats: String,
    color: String,
    vin: String,
    current_mileage: String,
    service_interval: String,
    next_service: String,
    annual_sales:Number,
};
const trucksSchema = {
    id:String,
    make:String,
    model:String,
    year:String,
    seats:String,
    bed_length:String,
    color:String,
    vin:String,
    current_mileage:String,
    service_interval:String,
    next_service:String,
    annual_sales:Number,
}

const boatsSchema ={
    make:String,
    model:String,
    year:String,
    length:String,
    width:String,
    hin:String,
    current_hours:Number,
    service_Interval:String,
    next_service:String,
    annual_sales:Number,
}

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    googleId:String
});

///////////DYNAMIC USERNAME///////////////
let users = [];


//Plugins
userSchema.plugin(findOrCreate);
userSchema.plugin(passportLocalMongoose);

//Models//
const User = new mongoose.model("User", userSchema);
const Car = mongoose.model("Car", carsSchema);
const Truck = mongoose.model("Truck", trucksSchema);
const Boat = mongoose.model("Boat", boatsSchema);



passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
  });
});



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://fredsgarages.com/auth/google/cars",
    // callbackURL: "https://safe-escarpment-24838.herokuapp.com/auth/google/cars",
    // callbackURL: "http://localhost:3000/auth/google/cars",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
      const googleProfile = profile;
      users.push(googleProfile);
      
      

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
    });
  }
));

 
////////////////// LOGIN SECTION ///////////////////////

app.get("/", function(req,res){
    res.render("garage");
});

app.get("/auth/google", 
    passport.authenticate('google',{ scope:["profile"] })
);

app.get("/auth/google/cars", 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/home");
    
  });

app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});


app.get("/home", function(req, res){
    if(req.isAuthenticated()){
         
Car.find({
    make:"Tesla",
    make:"Jeep",
 }, function(err,foundCar){
    res.render("home", {carItems:foundCar,users:users});
    });
  };
});

       
app.get("/carInventory", function(req, res){
    if(req.isAuthenticated()){
    Car.find({}, function(err,foundCar){
    res.render("carInventory", {carItems:foundCar,users:users});
     });
  };
});   

app.get("/truckInventory", function(req, res){
        if(req.isAuthenticated()){
        Truck.find({}, function(err,foundTruck){
          res.render("truckInventory", {truckItems:foundTruck,users:users});
       
             });
           };
        });  
app.get("/boatInventory", function(req, res){
        if(req.isAuthenticated()){
        Boat.find({}, function(err,foundBoat){
            res.render("boatInventory", {boatItems:foundBoat,users:users});
         
               });
             };
          });    

app.get("/cars", function(req, res){
        if(req.isAuthenticated()){
        Car.find({
          make:"Tesla",
        }, function(err,foundCar){
          res.render("cars", {carItems:foundCar});
       
             });
           };
        });        
    
app.get("/boats", function(req, res){
       if(req.isAuthenticated()){
       Boat.find({make: "Cheoy Lee"}, function(err,foundBoat){
          res.render("boats", {boatItems:foundBoat});
         
             });
           };
        });
app.get("/trucks", function(req, res){
       if(req.isAuthenticated()){
       Truck.find({make:"Jeep"}, function(err,foundTruck){
          res.render("trucks", {truckItems:foundTruck});
            
             });
           };
        }); 
app.get("/submitCars", function(req, res){
       if(req.isAuthenticated()){
             res.render("submitCars");
                
             };
          });         


app.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  users.push(user);
  
  

  



req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/home");
        });
      }
    });
  
  });

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
  });

app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
      //   passport.authenticate("local")(req, res, function(){
          res.redirect("/login");
        // });
      }
    });
  });

app.post("/login", function(req,res){
    const user = new User({
      username:req.body.username,
      password:req.body.password,
      
      
});
    

req.login(user, function(err){
      if (err){
        console.log(err)
      } else {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/home");
        })
      }
    });
  });




///////////////// REQUESTS TARGETING SPECIFIC CAR PARAMS (GET/PUT/DELETE) ////////////////////////

app.route("/cars/:id")

.get(function(req,res){

Car.find({make: "Tesla"},function(err,foundCar){
    if (foundCar) {
      res.render("tesla", {carItems:foundCar});
    } else {
        res.send("No Cars matching that desciption") ;
        }
    });
})
.put(function(req,res){
  Car.update(
     {Make: req.params.id},
     {Make: req.body.Make, Model: req.body.Model,
      Year: req.body.Year, Seats: req.body.Seats,
      Color:req.body.Color, VIN:req.body.Vin,
      Current_Mileage:req.body.Current_Mileage, Service_Interval:req.body.Service_Interval,
      Next_Service:req.body.Next_Service
    },
      {overwrite: true},
      function(err){
          if(!err){
              res.send("Successfully updated Cars.");
          }
       }
    );  
 })

.delete(function(req,res){
    Car.deleteOne(
    {Make: req.params.id},
    function(err){
        if (!err){
            res.send("Successfully deleted Car");
        } else {
            res.send(err);
        }
      }
   );
});







///////////////// REQUESTS TARGETING ALL CARS (GET/POST) ////////////////////////

app.route("/cars")
app.post("/submitCars", function (req, res) {

    const newCar = new Car({
        make:req.body.inputMake,
        model:req.body.inputModel,
        year:req.body.inputYear,
        seats:req.body.inputSeats,
        color:req.body.inputColor,
        vin:req.body.inputVin,
        current_mileage:req.body.inputCurrent_Mileage,
        service_interval:req.body.inputService_Interval,
        next_service:req.body.inputNext_Service,
        annual_sales:req.body.inputAnnual_Sales
    });
    newCar.save();
    res.redirect("carInventory");
});


app.post("/navbar", function (req, res) {

  const carSearch = req.body.inputMake;
  if(carSearch === "Tesla"){
    res.redirect("cars/tesla");
  }else{
    res.send(err);
  }
});

app.post("/delete", function(req,res){
  console.log(req.body);
  const checkedItemId =(req.body.deleteButton);

Car.findOneAndDelete(checkedItemId,function(err){
  
  if (err){
    console.log(err);
    }else{
      res.redirect("/carInventory");
    }   
  });
});
app.post("/delete2", function(req,res){
  const checkedItemId =(req.body.checkboxForTruck);
  console.log(req.body);


Truck.findByIdAndRemove(checkedItemId,function(err){
  if (err){
    console.log(err);
    }else{
      res.redirect("/truckInventory");
    }   
  });
});
app.post("/delete3", function(req,res){
  const checkedItemId =(req.body.checkboxForBoat);
  console.log(req.body);



  Boat.findByIdAndRemove(checkedItemId,function(err){
  if (err){
    console.log(err);
    }else{
      res.redirect("/boatInventory");
    }   
  });
});
  









///////////////// REQUESTS TARGETING SPECIFIC TRUCK PARAMS (GET/PUT/DELETE) ////////////////////////

app.route("/trucks/:id") 

.get(function(req,res){
   
Truck.findOne({Make: req.params.id},function(err,foundTruck){
    if (foundTruck) {
    res.send(foundTruck);
    } else {
        res.send("No Trucks matching that desciption") ;
        }
    });
 
})
.put(function(req,res){
  Truck.update(
     {Make: req.params.id},
     {Make: req.body.Make, Model: req.body.Model,
      Year: req.body.Year, Seats: req.body.Seats,
      Bed_Length:req.body.Bed_Length, Color:req.body.Color,
      VIN:req.body.Vin, Current_Mileage:req.body.Current_Mileage,
      Service_Interval:req.body.Service_Interval
    },
      {overwrite: true},
      function(err){
          if(!err){
              res.send("Successfully updated Trucks.");
          }
      }
    );  
 })

 .delete(function(req,res){
    Truck.deleteOne(
    {Make: Ford},
    function(err){
        if (!err){
            res.send("Successfully deleted Truck");
        } else {
            res.send(err);
        }
      }
   );
});



///////////////// REQUESTS TARGETING ALL TRUCKS (GET/POST) ////////////////////////

app.post("/submitTrucks", function (req, res) {

  const newTruck = new Truck({
      make:req.body.inputMake,
      model:req.body.inputModel,
      year:req.body.inputYear,
      seats:req.body.inputSeats,
      bed_length: req.body.inputBedLength,
      color:req.body.inputColor,
      vin:req.body.inputVin,
      current_mileage:req.body.inputCurrentMileage,
      service_interval:req.body.inputServiceInterval,
      next_service:req.body.inputNextService,
      
  });
  newTruck.save();
  res.redirect("truckInventory");
});

app.post("/deleteForTruck", function(req,res){
  console.log(req.body);
  const checkedItemId =(req.body.deleteButtonForTrucks);

Truck.findOneAndDelete(checkedItemId,function(err){
  
  if (err){
    console.log(err);
    }else{
      res.redirect("/truckInventory");
    }   
  });
});


///////////////// REQUESTS TARGETING SPECIFIC BOAT PARAMS (GET/PUT/DELETE) ////////////////////////

app.route("/boats/:id")

.get(function(req,res){
    
Boat.findOne({Make: req.params.id},function(err,foundBoat){
    if (foundBoat) {
    res.send(foundBoat);
    } else {
        res.send("No Boats matching that desciption") ;
        }
    });
   
})
.put(function(req,res){
  Boat.update(
     {Make: req.params.id},
     {Make: req.body.Make, Model: req.body.Model,
      Year: req.body.Year, Length: req.body.Length,
      Width:req.body.Width, HIN:req.body.Hin,
      Current_Hours:req.body.Current_Hours, Service_Interval:req.body.Service_Interval,
      Next_Service:req.body.Next_Service
    },
      {overwrite: true},
      function(err){
          if(!err){
              res.send("Successfully updated Boats.");
          }
      }
    );  
 })

 .delete(function(req,res){
    Boat.deleteOne(
    {Make: req.params.id},
    function(err){
        if (!err){
            res.send("Successfully deleted Boat");
        } else {
            res.send(err);
        }
      }
   );
});



///////////////// REQUESTS TARGETING ALL BOATS (GET/POST) ////////////////////////


app.route("/boats")

.get(function (req,res){
     
Boat.find(function(err,foundBoats){
     if (!err){
     res.send(foundBoats);
     } else {
         res.send(err);
         }
    });
  
})

.post(function(req,res){
    

    const newBoat = new Boat({
        Make:req.body.Make,
        Model:req.body.Model,
        Year:req.body.Year,
        Length:req.body.Length,
        Width:req.body.Width,
        HIN:req.body.Hin,
        Current_Hours:req.body.Current_Hours,
        Next_Service:req.body.Next_Service,
    
    });
newBoat.save();
});




app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});

