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
