//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-Local-Mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://EF13:1313@cluster0.fk4x7.gcp.mongodb.net/vehicles_databse", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

//Schemas//

const CarsSchema = {
    Make:String,
    Model: String,
    Year: String,
    Seats: String,
    Color: String,
    VIN: String,
    Current_Mileage: String,
    Service_Interval: String,
    Next_Service: String,
};
const TrucksSchema = {
    Make:String,
    Model:String,
    Year:String,
    Seats:String,
    Bed_Length:String,
    Color:String,
    VIN:String,
    Current_Mileage:String,
    Service_Interval:String,
}

const BoatsSchema ={
    Make:String,
    Model:String,
    Year:String,
    Length:String,
    Width:String,
    HIN:String,
    Current_Hours:String,
    Service_Interval:String,
    Next_Service:String,
}

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


//Plugins
userSchema.plugin(findOrCreate);

//Models//
const User = new mongoose.model("User", userSchema);
const Car = mongoose.model("Car", CarsSchema);
const Truck = mongoose.model("Truck", TrucksSchema);
const Boat = mongoose.model("Boat", BoatsSchema);


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
    callbackURL: "http://localhost:3000/auth/google/bixly",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

////////////////// LOGIN SECTION ///////////////////////

app.get("/auth/google",
    passport.authenticate('google',{ scope:["profile"] })
);

app.get("/auth/google/bixly", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/cars' || '/boats' || 'trucks');
  });

app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function (req,res) {
    const NewUser = new User ({
        email: req.body.username,
        password:req.body.password
    });
    NewUser.save(function(err){
        if (err){
            console.log(err)
        }else{
            res.render("login");
        }    
    })
});
// app.post("/login", function(req,res) {
//     const username = req.body.username;
//     const password =req.body.password;

//     User.findOne({email:username}, function(err, foundUser){
//     if(err) {
//         console.log(err);
//         }else{
//             if(foundUser) {
//                 if(foundUser.password === password){
//                     res.redirect
//                 }
//             }
//         }
//     });
// });



///////////////// REQUESTS TARGETING SPECIFIC CAR PARAMS (GET/PUT/DELETE) ////////////////////////

app.route("/cars/:id")

.get(function(req,res){
if (req.isAuthenticated()){
Car.findOne({Make: req.params.id},function(err,foundCar){
    if (foundCar) {
    res.send(foundCar);
    } else {
        res.send("No Cars matching that desciption") ;
        }
    });
  };
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


app.route("/cars").get(function(req,res){
if (req.isAuthenticated()){
    Car.find(function(err,foundCars){
        if (!err){
        res.send(foundCars);
        } else {
            res.send(err);
            }
       });
    
    };
})


.post(function(req,res){
    

    const newCar = new Car({
        Make:req.body.Make,
        Model:req.body.Model,
        Year:req.body.Year,
        Seats:req.body.Seats,
        Color:req.body.Color,
        VIN:req.body.Vin,
        Current_Mileage:req.body.Current_Mileage,
        Service_Interval:req.body.Service_Interval,
        Next_Service:req.body.Next_Service
    });
newCar.save();
});


///////////////// REQUESTS TARGETING SPECIFIC TRUCK PARAMS (GET/PUT/DELETE) ////////////////////////

app.route("/trucks/:id") 

.get(function(req,res){
    if (req.isAuthenticated()){
Truck.findOne({Make: req.params.id},function(err,foundTruck){
    if (foundTruck) {
    res.send(foundTruck);
    } else {
        res.send("No Trucks matching that desciption") ;
        }
    });
  }; 
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
    {Make: req.params.id},
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


app.route("/trucks")

.get(function (req,res){
     if (req.isAuthenticated()){
Truck.find(function(err,foundTrucks){
     if (!err){
     res.send(foundTrucks);
     } else {
         res.send(err);
         }
    });
  };
})

.post(function(req,res){
    

    const newTruck = new Truck({
        Make:req.body.Make,
        Model:req.body.Model,
        Year:req.body.Year,
        Seats:req.body.Seats,
        Bed_Length:req.body.Bed_Length,
        Color:req.body.Color,
        VIN:req.body.Vin,
        Current_Mileage:req.body.Current_Mileage,
        Service_Interval:req.body.Service_Interval,
    
    });
newTruck.save();
});


///////////////// REQUESTS TARGETING SPECIFIC BOAT PARAMS (GET/PUT/DELETE) ////////////////////////

app.route("/boats/:id")

.get(function(req,res){
    if (req.isAuthenticated()){
Boat.findOne({Make: req.params.id},function(err,foundBoat){
    if (foundBoat) {
    res.send(foundBoat);
    } else {
        res.send("No Boats matching that desciption") ;
        }
    });
  };  
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
     if (req.isAuthenticated()){
Boat.find(function(err,foundBoats){
     if (!err){
     res.send(foundBoats);
     } else {
         res.send(err);
         }
    });
  }; 
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




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
