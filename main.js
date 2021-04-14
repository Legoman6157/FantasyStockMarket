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

// Update components of index.html ---------------------------------------------

//TODO

// Quest system prototype ------------------------------------------------------

// Initialize cooldown trackers
var CDs = [
	{t: begCD = 0, name: "begCD", price: 0},
	{t: darkCD = 0, name: "darkCD", price: 250}
	//{t: dragonCD = 300, name: "dragonCD", price: 1000}
];

function begQuest() { // Quest ID: 0
	if (CDs[0].t < 0) {
		gold += 10;
		CDs[0].t = 30;
	}
}

function darkQuest() { // Quest ID: 1
	if (CDs[1].t < 0 && gold >= CDs[1].price) {
		gold -= CDs[1].price;
		let die = Math.floor(Math.random() * 2 + 0.10);
		let n = scrolls.shares.length
		if (die == 1) {
			for (i = 0; i < n; i++) {
				scrolls.shares.push(0);
			}
		} else {
			n -= Math.floor(Math.random() * n);
			for (i = 0; i < n; i++) {
				scrolls.shares.shift();
			}
		}
		document.getElementById("scrollQuantity").innerHTML = scrolls.shares.length;
		CDs[1].t = 60;
	}
}

// A quest to unlock dragon eggs

// Item handling ---------------------------------------------------------------

class Item {
    constructor(name, price, bias, vol, unlocked=true) {
        this.name = name;
        this.price = price;
        this.bias = bias;		//Item will trend towards this price value
        this.vol = vol;			//The +/- value that represents max/min price fluctuation

        this.total_cost = 0;	//a running sum of the total amount spent: the sum of all
								//  elemments in this.shares
        this.shares = []; 		//an array that stores a history of purchases. the length is quantity owned
								//  organized as a queue, use push() to add purchases
								//  to the history, and shift() to remove from front
    }
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
//        document.getElementById(item.name + "AverageCost").innerHTML = (item.total_cost / item.shares.length).toFixed(2)
    }
}

function sellItem(n, item) {
    if (n > item.shares.length) {
        n = item.shares.length;
    }
    if (item.shares.length >= n) {
        for (i = 0; i < n; i++) {
            item.total_cost -= item.shares.shift() //pop oldest price from front
        }
        gold = Number((gold + item.price * n).toFixed(2));

        // Update the page
        document.getElementById("gold").innerHTML = gold;
        document.getElementById(item.name + "Quantity").innerHTML = item.shares.length;
//        if (item.shares.length > 0) {
//            document.getElementById(item.name + "AverageCost").innerHTML = (item.total_cost / item.shares.length).toFixed(2)
//       } else {
//            document.getElementById(item.name + "AverageCost").innerHTML = 0;
//        }
    }
}
function ev(item1, item2, title, text, Vol1, Vol2, jump1, jump2){
  this.item1=item1;
  this.item2=item2;
  this.Vol1=Vol1;
  this.Vol2=Vol2;
  this.title=title;
  this.text=text;
  this.jump1=jump1;
  this.jump2=jump2
}
var randEv = new ev();
var events = [];
var kings = [];
function king(name, description, typeUp, typeDown){
  this.name = name;
  this.description = description;
  this.typeUp = typeUp;
  this.typeDown = typeDown;
}


function get_event(randEv){
  var randEv = new ev();
  randEv=events[Math.floor(Math.random() * events.length)];
  //alert(randEv.title);
  if(randEv.item1.name != "blanks"){
    randEv.item1.vol += randEv.Vol1;
    randEv.item1.bias += randEv.jump1;
    //randEv.item1.price +=randEv.jump1;
  }
  if(randEv.item2.name != "blanks"){
    randEv.item2.vol += randEv.Vol2;
    randEv.item2.bias += randEv.jump2;
  }
}
function create_events(){
  //var events = [];
  alert("Events loaded!");
  create = new ev(swords, blanks, "Axes in Fashion",
  "After a recent raid by some dashing vikings, people have become smitten with axes."
  , 10, 0, -20, 0);
  events.push(create);
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

// Tab functions ---------------------------------------------------------------

$(document).ready(function() {
  $("#stock-tab").click(function() {
    if ($("#stock-tab").hasClass("inactive-tab")) {
      $("#stock-outer-container").show();
      $("#quest-outer-container").hide();
      $("#monarch-outer-container").hide();
      setActiveTab("#stock-tab");
    }
  })
  $("#quest-tab").click(function() {
    if ($("#quest-tab").hasClass("inactive-tab")) {
      $("#stock-outer-container").hide();
      $("#quest-outer-container").show();
      $("#monarch-outer-container").hide();
      setActiveTab("#quest-tab");
      console.log("Switching to quest tab");
    }
  })
  $("#monarch-tab").click(function() {
    if ($("#monarch-tab").hasClass("inactive-tab")) {
      $("#stock-outer-container").hide();
      $("#quest-outer-container").hide();
      $("#monarch-outer-container").show();
      setActiveTab("#monarch-tab");
      console.log("Switching to monarch tab");
    }
  })
});

function setActiveTab(activeTabID) {
  if ($("#stock-tab").hasClass("active-tab")) {
    $("#stock-tab").removeClass("active-tab");
    $("#stock-tab").addClass("inactive-tab");
  }

  if ($("#quest-tab").hasClass("active-tab")) {
    $("#quest-tab").removeClass("active-tab");
    $("#quest-tab").addClass("inactive-tab");
  }

  if ($("#monarch-tab").hasClass("active-tab")) {
    $("#monarch-tab").removeClass("active-tab");
    $("#monarch-tab").addClass("inactive-tab");
  }

  $(activeTabID).removeClass("inactive-tab");
  $(activeTabID).addClass("active-tab");
}

// End of tab functions --------------------------------------------------------

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
    if (time % 36 == 0){
      get_event(randEv);
    }

    // Calculate and update the price, average cost, total return values.
    // only show average cost/total return if you actually own the item
    for (item of allItems) {

        document.getElementById(item.name + "Price").innerHTML = item.price.toFixed(2);
        document.getElementById(item.name + "Bias").innerHTML = item.bias.toFixed(2);
        document.getElementById(item.name + "Vol").innerHTML = item.vol.toFixed(2);
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

	// Tick quest cds
	for (CD of CDs) {
		CD.t--;
		if (CD.t > 0) {
			document.getElementById(CD.name).innerHTML = CD.t;
			document.getElementById(CD.name + "color").style.color = 'red';
		} else {
			document.getElementById(CD.name + "color").style.color = 'black';
			if (CD.price > 0) {
				document.getElementById(CD.name).innerHTML = CD.price;
			} else {
				document.getElementById(CD.name).innerHTML = "Free";
			}
		}
	}

    document.getElementById("tradingDay").innerHTML = Math.floor(time/24) + 1;
    document.getElementById("tradingHour").innerHTML = Math.floor(time % 24);
    document.getElementById("hour").innerHTML = time;
}, gamespeed);
