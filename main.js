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
var scrollPrice = 10;
var scrollBias = 20;
var scrollVol = 10;
//scrollVolume? buy too much and tank the price

document.getElementById('scrollBias').innerHTML = scrollBias;
document.getElementById('scrollVol').innerHTML = scrollVol;

function b_up() {scrollBias = scrollBias + 1; document.getElementById('scrollBias').innerHTML = scrollBias;}
function b_down() {scrollBias = scrollBias - 1; document.getElementById('scrollBias').innerHTML = scrollBias;}
function v_up() {scrollVol = scrollVol + 1; document.getElementById('scrollVol').innerHTML = scrollVol;}
function v_down() {scrollVol = scrollVol - 1; document.getElementById('scrollVol').innerHTML = scrollVol;}


function buyScroll(n) {
    if (gold >= scrollPrice * n) {
        scrolls = scrolls + n;
        gold = Number((gold - scrollPrice * n).toFixed(2));
        document.getElementById('gold').innerHTML = gold;
        document.getElementById('scrolls').innerHTML = scrolls;
    }
}

function sellScroll(n) {
    if (scrolls >= n) {
        scrolls = scrolls - n;
        gold = Number((gold + scrollPrice * n).toFixed(2));
        document.getElementById('gold').innerHTML = gold;
        document.getElementById('scrolls').innerHTML = scrolls;
    }
}

//-----------------------------------------------------------------------------

function priceShift(bias, vol, price) {
    // returns the value of daily movement. E.g. -$15 for the day
    // Bias is the 'target' price
    // Vol is the range of prices, stored as absolute value of offset from bias
    // The price can not move more than range/4 (vol/2) per day
    // if the price is within 1 maxMove of ceiling or floor, the price will
    //      either stay the same, or it will move opposite of ceil/floor

    var maxMove = Math.floor(vol /2); //dont move more than vol/2
    var move = Math.floor((Math.random() * maxMove + 1));

    if (price >= bias+vol) { //if price > ceiling, it must trend down
        return 0 - move;
    } else if (price <= bias-vol) { // if price < floor, it must trend up
        return move;
    } else { //otherwise just 50/50 up or down
        if (Math.floor(Math.random() * 2) == 0) {
            return move;
        } else {
            return 0 - move;
        }
    }
}

//hello

var time = 0;

window.setInterval(function() {
    time = time + 1;
    basicClick(adventurers);

    if (time % 24 == 0) {
        scrollPrice = scrollPrice + priceShift(scrollBias, scrollVol, scrollPrice);
    }
    if (time % 6 == 0) {
        scrollPrice = scrollPrice + priceShift(scrollBias, scrollVol, scrollPrice);
    }

    document.getElementById('scrollPrice').innerHTML = scrollPrice.toFixed(2);
    document.getElementById('tradingDay').innerHTML = Math.floor(time/24) + 1;
    document.getElementById('tradingHour').innerHTML = Math.floor(time % 24);
    document.getElementById('hour').innerHTML = time;
}, 500);
