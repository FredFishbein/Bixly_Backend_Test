
module.exports = myMap

function myMap(){
var map = new GMaps({
    el: '#map',
    lat: -12.043333,
    lng: -77.028333
  });
  return myMap;
}