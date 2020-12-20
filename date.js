module.exports.getDate=getDate;


function getDate(){
const today = new Date();
let options = {
  weekday:"long",
  month:"long",
  day: "numeric"
};
let day=today.toLocaleDateString("en-us",options);
return day;
};
