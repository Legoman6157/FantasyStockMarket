var gold = 50;

function basicClick(n) {
    gold = gold + n;
    document.getElementById("gold").innerHTML = gold;
}

var adventurers = 0;

function hireAdventurer(n) {
    var adventurerCost = Math.floor(10 * Math.pow(1.25,adventurers))
    if (gold >= adventurerCost) {
        adventurers = adventurers + 1;
        gold = gold - adventurerCost;
        document.getElementById('gold').innerHTML = gold.toFixed(2);
        document.getElementById('adventurers').innerHTML = adventurers;
    }
    var nextCost = Math.floor(10 * Math.pow(1.25,adventurers));
    document.getElementById('adventurerCost').innerHTML = nextCost;
}

var scrolls = 0;
var scrollPrice = 55;
var scrollBias = 0;
var scrollVol = 2;
var scrollMax = 300;
var scrollMin = 13;

function ev(title, text,posVol, negVol, jum){
  this.posVol=posVol;
  this.negVol=negVol;
  this.title=title;
  this.text=text;
  this.jump=jump;
}
var randEv = new ev();
var events = [];
function b_up() {scrollBias = scrollBias + 1; document.getElementById('scrollBias').innerHTML = scrollBias;}
function b_down() {scrollBias = scrollBias - 1; document.getElementById('scrollBias').innerHTML = scrollBias;}
function v_up() {scrollVol = scrollVol + 1; document.getElementById('scrollVol').innerHTML = scrollVol;}
function v_down() {scrollVol = scrollVol - 1; document.getElementById('scrollVol').innerHTML = scrollVol;}


function buyScroll(n) {
    if (gold >= scrollPrice) {
        scrolls = scrolls + 1;
        gold = Number((gold - scrollPrice).toFixed(2));
        document.getElementById('gold').innerHTML = gold;
        document.getElementById('scrolls').innerHTML = scrolls;
    }
}

function sellScroll(n) {
    if (scrolls > 0) {
        scrolls = scrolls - 1;
        gold = Number((gold + scrollPrice).toFixed(2));
        document.getElementById('gold').innerHTML = gold;
        document.getElementById('scrolls').innerHTML = scrolls;
    }
}

function priceShift(bias, vol) {
    var rv = 1 + ((Math.random() * vol) - vol/2 + bias)/100;
    console.log("rv: " + rv);
    return rv;
}

var hour = 0;
var die = 0;
function get_event(n){
  randEv=events[Math.floor(Math.random() * events.length)];
}
window.setInterval(function() {
    hour = hour + 1;
    basicClick(adventurers);

    scrollPrice = scrollPrice * priceShift(scrollBias,scrollVol);

    document.getElementById('scrollHigh').innerHTML = scrollBias + scrollVol;
    document.getElementById('scrollLow').innerHTML = scrollBias - scrollVol;
    document.getElementById('scrollPrice').innerHTML = scrollPrice.toFixed(2);
    document.getElementById('tradingDay').innerHTML = Math.floor(hour/12) + 1;
    document.getElementById('hour').innerHTML = hour;
}, 500);


function create_events(){
  //var events = [];
  alert("Events loaded!");
  create = new ev(swords, blanks, "Axes in Fashion",
  "After a recent raid by some dashing vikings, people have become smitten with axes."
  , 10, 0, -20, 0);
  events.push(create);
}
document.getElementById('file').onchange = function(){
  //open the file
  var file = this.files[0];
  var reader = new FileReader();
  //this syntax might be just straight up wrong to be honest I kinda confused myself
  reader.onload = function(create_event){
    //read in code by each line (this syntax might be very wrong to be honest I am a little confused)
    var lines = reader.readAsText(file).result.split('\n');
    for(var line = 0; line < lines.length; line++){
      //read the event name
      var eventName = lines[line];
      line++;
      //read the event text
      var eventText = lines[line];
      line++;
      //set variables for each stock to be read in accordingly
      var stockIndex = 0;
      var name1 = "blanks";
      var name2 = "blanks";
      var bias1 = 0;
      var bias2 = 0;
      var vol1 = 0;
      var vol2 = 0;
      //read in any line with the -s flag (which should be the first thing in the string), switching the stockIndex when necessary
      while(line.includes('-s')){
          var stockVals = line.split(' ');
          if(stockIndex == 0){
              name1 = stockVals[1];
              bias1 = stockVals[2];
              vol1 = stockVals[3];
          }
          else if(stockIndex == 1) {
              name2 = stockVals[1];
              bias2 = stockVals[2];
              vol2 = stockVals[3];
          }
          stockIndex++;
          line++;
      }
      //load the event, create the new event and push it
      alert("Events loaded!");
      var create = new ev(name1, name2, eventName, eventText, bias1, bias2, vol1, vol2);
      events.push(create);
    }
  };
};
function king(name, description, typeUp, typeDown){
  this.name = name;
  this.description = description;
  this.typeUp = typeUp;
  this.typeDown = typeDown;
}





<div class="stock-option-container">
  <h3>Wine</h3>
  <button onClick="buyItem(10, wine)">+10</button>
  <button onClick="buyItem(1, wine)">Buy axe</button>
  <button onClick="sellItem(1, wine)">Sell axe</button>
  <button onClick="sellItem(10, wine)">-10</button>
  <br/>
  Axes: <span id="wineQuantity">0</span>
  <br/>
  Axe Price: <span id="winePrice">0</span>g
  <div id="wine-position-container" style="display: inline" style="visibility: hidden">
    <br/>
    Average Cost: <span id="wineAverageCost">0</span>g
    <br/>
    <!-- lord help me what is the correct way to do this -->
    Total Return: <span id="wineTotalReturnColor"><span id="wineTotalReturnSign">+</span><span id="wineTotalReturn">0</span>g</span>
  </div>
  <br/>
  Bias [<span id="wineBias">0</span>]: <button onClick="b_up(wine)">+</button> <button onClick="b_down(wine)">-</button>
  <br/>
  Volatility [<span id="wineVol">0</span>]: <button onClick="v_up(wine)">+</button> <button onClick="v_down(wine)">-</button>
</div>
<div class="stock-option-container">
    <h3>Dragon Scales</h3>
    <button onClick="buyItem(10, dragon_scales)">+10</button>
    <button onClick="buyItem(1, dragon_scales)">Buy shield</button>
    <button onClick="sellItem(1, dragon_scales)">Sell shield</button>
    <button onClick="sellItem(10, dragon_scales)">-10</button>
    <br/>
    Shields: <span id="dragon_scaleQuantity">0</span>
    <br/>
    Shield Price: <span id="dragon_scalePrice">0</span>g
    <div id="dragon_scale-position-container" style="display: inline" style="visibility: hidden">
      <br/>
      Average Cost: <span id="dragon_scaleAverageCost">0</span>g
      <br/>
      <!-- lord help me what is the correct way to do this -->
      Total Return: <span id="dragon_scaleTotalReturnColor"><span id="dragon_scaleTotalReturnSign">+</span><span id="dragon_scaleTotalReturn">0</span>g</span>
    </div>
    <br/>
    Bias [<span id="dragon_scaleBias">0</span>]: <button onClick="b_up(dragon_scales)">+</button> <button onClick="b_down(dragon_scales)">-</button>
    <br/>
    Volatility [<span id="dragon_scaleVol">0</span>]: <button onClick="v_up(dragon_scales)">+</button> <button onClick="v_down(dragon_scales)">-</button>
</div>
