// Placeholder 'clicker' stuff -------------------------------------------------

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
        document.getElementById("gold").innerHTML = gold.toFixed(2);
        document.getElementById("adventurers").innerHTML = adventurers;
    }
    var nextCost = Math.floor(10 * Math.pow(1.25,adventurers));
    document.getElementById("adventurerCost").innerHTML = nextCost;
}

// Item handling ---------------------------------------------------------------

function Item(name, price, bias, vol) {
    this.name = name;
    this.price = price;
    this.bias = bias;       //Item will trend towards this price value
    this.vol = vol;         //The +/- value that represents max/min price fluctuation

    this.total_cost = 0;    //a running sum of the total amount spent: the sum of all
                            //  elemments in this.shares
    this.shares = [];       //an array that stores a history of purchases. the length is quantity owned
                            //  organized as a queue, use push() to add purchases
                            //  to the history, and shift() to remove from front
                            //
}

var scrolls = new Item("scroll", 10, 20, 10);
var swords = new Item("sword", 80, 80, 20);
var allItems = [scrolls, swords];

//debug functions to control bias/volatility
for (item of allItems) {
    document.getElementById(item.name + "Bias").innerHTML = item.bias; //lol
    document.getElementById(item.name + "Vol").innerHTML = item.vol;
}

function b_up(item) {item.bias = item.bias + 1; document.getElementById(item.name + "Bias").innerHTML = item.bias;}
function b_down(item) {item.bias = item.bias - 1; document.getElementById(item.name + "Bias").innerHTML = item.bias;}
function v_up(item) {item.vol = item.vol + 1; document.getElementById(item.name + "Vol").innerHTML = item.vol;}
function v_down(item) {item.vol = item.vol - 1; document.getElementById(item.name + "Vol").innerHTML = item.vol;}


function buyItem(n, item) {
    if (gold < item.price * n) {
        n = Math.trunc(gold/item.price);
        console.log(n);
    }
    if (gold >= item.price * n) {
        for (i = 0; i < n; i++) {
            item.shares.push(item.price) //push prices into purchase history.
            item.total_cost += item.price;
        }
        console.log(item.shares + " - total: " + item.total_cost);
        gold = Number((gold - item.price * n).toFixed(2));

        // Update the page
        document.getElementById("gold").innerHTML = gold;
        document.getElementById(item.name + "Quantity").innerHTML = item.shares.length;
        document.getElementById(item.name + "AverageCost").innerHTML = (item.total_cost / item.shares.length).toFixed(2)
    } // TODO: else: buy as many as you can
}

function sellItem(n, item) {
    if (n > item.shares.length) {
        n = item.shares.length;
    }
    if (item.shares.length >= n) {
        for (i = 0; i < n; i++) {
            item.total_cost -= item.shares.shift(item.price) //pop oldest price from front
        }
        gold = Number((gold + item.price * n).toFixed(2));

        // Update the page
        document.getElementById("gold").innerHTML = gold;
        document.getElementById(item.name + "Quantity").innerHTML = item.shares.length();
        if (item.shares.length > 0) {
            document.getElementById(item.name + "AverageCost").innerHTML = (item.total_cost / item.shares.length).toFixed(2)
        } else {
            document.getElementById(item.name + "AverageCost").innerHTML = 0;
        }
    }
}

// Game loop and price modulation-----------------------------------------------

function priceShift(bias, vol, price) {
    // Returns the value of daily movement. E.g. -$15 for the day
    // Bias is the 'target' price
    // Vol is the range of prices, stored as absolute value of offset from bias
    // The price can not move more than vol/2 per day
    // if the price is within 1 maxMove of ceiling or floor, the price will
    //      either stay the same, or it will move opposite of ceil/floor

    var maxMove = Math.floor(vol/2); //dont move more than vol/2
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

var time = 0;
var gamespeed = 500;

window.setInterval(function() {
    // This function will run every 'gamespeed' ms. Generally updates the price of
    // items (as well as the player's money from 'clicker' stuff) and then
    // draws this to the screen.

    time = time + 1;
    basicClick(adventurers);

    //essentially, do a double price update at midnight
    if (time % 24 == 0) {
        for (item of allItems) {
            item.price = item.price + priceShift(item.bias, item.vol, item.price);
        }
    }
    if (time % 6 == 0) {
        for (item of allItems) {
            item.price = item.price + priceShift(item.bias, item.vol, item.price);
        }
    }

    // Calculate and update the price, average cost, total return values.
    // only show average cost/total return if you actually own the item
    for (item of allItems) {

        document.getElementById(item.name + "Price").innerHTML = item.price.toFixed(2);
        if (item.shares.length > 0) {
            document.getElementById(item.name + "-position-container").style.visibility="visible";

            let t_total_return = ((item.price * item.shares.length) - item.total_cost)
            if (t_total_return >= 0) {
                document.getElementById(item.name + "TotalReturnColor").style.color = 'green';
                document.getElementById(item.name + "TotalReturnSign").innerHTML = '+';
            } else {
                document.getElementById(item.name + "TotalReturnColor").style.color = 'red';
                document.getElementById(item.name + "TotalReturnSign").innerHTML = '';
            }
            document.getElementById(item.name + "TotalReturn").innerHTML = t_total_return.toFixed(2);

        } else {
            document.getElementById(item.name + "-position-container").style.visibility="hidden";
        }
    }

    document.getElementById("tradingDay").innerHTML = Math.floor(time/24) + 1;
    document.getElementById("tradingHour").innerHTML = Math.floor(time % 24);
    document.getElementById("hour").innerHTML = time;
}, gamespeed);
