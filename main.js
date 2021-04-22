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
	{t: darkCD = 0, name: "darkCD", price: 250},
	{t: swordCD = 0, name: "swordCD", price: 100},
	{t: wineCD = 0, name: "wineCD", price: 25}
	//{t: dragonCD = 300, name: "dragonCD", price: 1000}
];

// Gives you 10 dollars
// Cooldown: 30 seconds
function begQuest() { // Quest ID: 0
	if (CDs[0].t < 0) {
		gold += 10;
		CDs[0].t = 30;
	}
}

// Doubles your scrolls at a 60% chance, you lose a random amount on fail
// Cooldown: 60 seconds
function darkQuest() { // Quest ID: 1
	if (CDs[1].t < 0 && gold >= CDs[1].price) {
		gold -= CDs[1].price;
		let die = Math.floor(Math.random() * 2 + 0.20);
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

// Upgrades the price of swords by 12% permanently
// Cooldown: 45 seconds
function swordQuest() { // Quest ID: 2
	if (CDs[2].t < 0 && gold >= CDs[2].price) {
		gold -= CDs[2].price;
		swords.bias = Math.floor( swords.bias * 1.12);
		CDs[2].t = 45;
	}
}

// Temporarily pumps the price of wine, with a 10% chance of crashing
// Cooldown: 60 seconds
function wineQuest() { // Quest ID: 3
	if (CDs[3].t < 0 && gold >= CDs[3].price) {
		gold -= CDs[3].price;
		let die = Math.floor(Math.random() + 0.9);
		if (die == 1) { //90% chance
			wine.price = Math.floor(wine.price * 2);
		} else {
			wine.bias = Math.floor(wine.bias / 2);
			wine.price = Math.floor(wine.bias / 1.5);
		}
		CDs[3].t = 60;
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
var axes = new Item("axe", 50, 50, 30);
var shields = new Item("shield", 30, 30, 10);
var grain = new Item("grain", 15, 12, 5);
var leather = new Item("leather", 12, 12, 5);
var livestock = new Item("livestock", 17, 20, 20);
var wine = new Item("wine", 100, 90, 25);
var crystals = new Item("crystal", 90, 90, 20);
var dragon_scales = new Item("dragon_scale", 150, 200, 45);
var scepters = new Item("scepter", 75, 80, 30);
var tomes = new Item("tome", 40, 40, 10);
var troll_teeth = new Item("troll_teeth", 25, 40, 17);
var goblin_hide = new Item("goblin_hide", 10, 10, 10);
var rum = new Item("rum", 20, 30, 10);
var cyclops_eyes = new Item("cyclops_eye", 80, 80, 20);
var unicorn_horn = new Item("unicorn_horn", 120, 110, 30);
var phoenix_ash = new Item("phoenix_ash", 200, 200, 50);
var blanks =new Item("blanks", 0, 0, 0);
var allItems = [scrolls, swords, wine, dragon_scales];
var war =[swords];
var magic = [scrolls];
var goods = [wine];
var monster_parts = [dragon_scales];
//, grain, leather, livestock, wine, crystals, dragon_scales, scepters, tomes, troll_teeth, goblin_hide, rum, cyclops_eyes, unicorn_horn, phoenix_ash
//debug functions to control bias/volatility
//for (item of allItems) {
  //  document.getElementById(item.name + "Bias").innerHTML = item.bias; //lol
  //  document.getElementById(item.name + "Vol").innerHTML = item.vol;
//}

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
//            document.getElementById(item.name + "AverageCost").innerHTML = (item.total_cost / item.shares.length).toFixed(2);
//        } else {
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
var candidates =[];

function king(name, description, typeUp, typeDown){
  this.name = name;
  this.description = description;
  this.typeUp = typeUp;
  this.typeDown = typeDown;
}
var currKing = new king("King Neutralitus III",
"A king who cares little for the kingdoms economic affairs.", null, null);
document.getElementById("KingName").innerHTML = currKing.name;
document.getElementById("KingDescription").innerHTML = currKing.description;
function create_kings(){
  //var events = [];
  //alert("Kings loaded!");
  k1 = new king("Queen Audra II",
  "A sorcerrer's apprentence", scrolls, swords);
  k2 = new king("King Bartholemau I",
  "A military general who believes the neibouring kindom will declar war", swords, wine);
  k3 = new king("Duke Hedoclease", "A man who believes that life is short and must be enjoyed", wine, scrolls);
  k4 = new king("Morgana the Huntress", "A distant relative to the current monarch. Famous for her monster hunting.", dragon_scales, wine);
  k5 = new king("Rodrick the Kind", "The youngest of the royal line and a lover of all living creatures", scrolls, dragon_scales);
  k6 = new king("Mordred the Duelist", "A mysterious figure that is only known for their dueling prowess.", swords, scrolls);
  kings.push(k1);
  kings.push(k2);
  kings.push(k3);
  kings.push(k4);
  kings.push(k5);
  kings.push(k6);
}

function pick_candidates(){
  //alert("pick candidates!");
  var rand;
  var candidate;
  for(var i=0; i<2; i++){
    rand = Math.floor(Math.random() * kings.length);
    candidate = kings[rand];
    candidates.push(candidate);
    kings.splice(rand, 1);
    document.getElementById("Succ"+i+"Name").innerHTML = candidate.name;
    document.getElementById("Succ"+i+"Desc").innerHTML = candidate.description;

  }
}

function succession(){
  makePopup("A new ruler has been crowned!");
  var i;
  currKing= candidates[[Math.floor(Math.random() * candidates.length)]];
  candidates.length=0;

  //for(i=0; i<currKing.typeUp.size; i++){
    currKing.typeUp.price+=10;
    currKing.typeUp.bias+=20;
  //}

  //for(i=0; i<currKing.typeDown.size; i++){
    if(currKing.typeDown.price-10>1){
      currKing.typeDown.price-=10;
    }
    else{
      currKing.typeDown.price=1
    }
    if(currKing.typeDown.bias-20<10){
      currKing.typeDown.price=10
    }
    else{
      currKing.typeDown.bias-=20;
    }
  //}
  document.getElementById("KingName").innerHTML = currKing.name;
  document.getElementById("KingDescription").innerHTML = currKing.description;
  pick_candidates();

}
var lastEv = null;
function get_event(){
  var randEv = new ev();
  randEv=events[Math.floor(Math.random() * events.length)];

  var m = randEv.title.concat("\n");
  var message = m.concat(randEv.text)
  makePopup(message);

  if(randEv.item1.name != "blanks"){
    if(randEv.item1.vol + randEv.Vol1<1){
      randEv.item1.vol = 1;
    }
    else{
      randEv.item1.vol += randEv.Vol1;
    }
    if(randEv.item1.bias + randEv.jump1<10){
      randEv.item1.bias = 10;
    }
    else{
      randEv.item1.bias += randEv.jump1;
    }
    //randEv.item1.price +=randEv.jump1;
  }
  if(randEv.item2.name != "blanks"){
    randEv.item2.vol += randEv.Vol2;
    randEv.item2.bias += randEv.jump2;
  }
  if(lastEv!=null){
    lastEv.item1.vol -= randEv.Vol1;
    lastEv.item2.vol -= randEv.Vol2;
  }
  lastEv=randEv
}
function create_events(){

  create = new ev(swords, blanks, "Axes in Fashion",
  "After a recent raid by some dashing vikings, people have become smitten with axes and lost interest in swrods."
  , 10, 0, -20, 0);
  ev1 = new ev(wine, blanks, "Celebration!", "The royal family has blessed us with a new child. The kindom dinks in merryment!", 10, 0, 20, 0)
  ev2 = new ev(scrolls, blanks, "Magical Interests!", "Many in the kingdom have taken up an interest in novice magic.", 8, 0, 10, 0)
  //ev1 = new ev(swords, axes, "War declared!", "A neighboring kingdom has declared war on our noble nation, causing many to buy weapons.", 10, 10, 20, 20);
  //ev2 = new ev(swords, shields, "Invasion!", "Our kingdom has been invaded! Invest in swords and shields to protect yourself!", 5, 5, 15, 20);
  //ev4 = new ev(grain, blanks, "Drought", "Our land has not received rainfall since the last full moon, causing the crops to grow less.", 20, 0, -25, 0);
  //ev5 = new ev(crystals, blanks, "Eureka!", "Explorers have discovered a foreign land trading thousands of crystals!", 15, 0, 15, 0);
  //ev6 = new ev(crystals, blanks, "Tariff", "Our traders have placed a tariff on exported crystals, causing less of them to be shipped to our nation.", 15, 0, -15, 0);
  ev3 = new ev(dragon_scales, blanks, "Save the dragons!", "Activists have insisted that people stop killing dragons for their scales.", 5, 0, -5, 0);
  //ev8 = new ev(unicorn_horn, blanks, "Save the unicorns!", "Activists have insisted that people stop killing unicorns for their horns.", 5, 0, -5, 0);
  //ev9 = new ev(tomes, blanks, "Tomes in fashion!", "I'm not quite sure what a tome is, but a lot of people seem to be buying them right now! Invest!", 10, 0, 10, 0);
  //ev10 = new ev(cyclops_eyes, blanks, "Cyclops island discovered!", "An island inhabited by cyclopses has been discovered and pillaged, leading to a surplus in cyclops eyes.", 10, 0, 5, 0);
  //ev11 = new ev(leather, blanks, "Leather in fashion!", "Many people are buying leather as a new fashion trend.", 10, 0, 10, 0);
  //ev12 = new ev(leather, blanks, "Leather out of fashion!", "People have seemed to lose interest in leather. Expect stocks to fall.", 10, 0, -5, 0);
  //ev13 = new ev(pegasus_feathers, blanks, "Feathers in fashion!", "People have begun wearing pegasus feathers in their hair as a good luck charm! Invest!", 8, 0, 6, 0);
  //ev14 = new ev(scepters, blanks, "A surplus in scepters!", "There seems to be a huge interest in scepters recently! Expect stocks to raise!", 5, 0, 7, 0);
  //ev15 = new ev(phoenix_ash, blanks, "Ash everywhere!", "It is phoenix season, and their ash is going in fashion!", 7, 0, 27, 0);
  //ev16 = new ev(troll_teeth, blanks, "Trolled!", "Troll teeth are going out of fashion.", 5, 0, -10, 0);
  //ev17 = new ev(goblin_hide, blanks, "Hides in fashion!", "People have become increasingly impressed with goblin hides, causing prices to increase!", 5, 0, 3, 0);
  events.push(create);
  events.push(ev1);
  events.push(ev2);
  events.push(ev3);
//  events.push(ev4);
//  events.push(ev5);
//  events.push(ev6);
//  events.push(ev7);
//  events.push(ev8);
//  events.push(ev9);
//  events.push(ev10);
//  events.push(ev11);
//  events.push(ev12);
  //events.push(ev13);
//  events.push(ev14);
//  events.push(ev15);
//  events.push(ev16);
//  events.push(ev17);
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

var mainTabIDs = [
  "#stock-tab",
  "#quest-tab",
  "#monarch-tab"
]
var mainContentIDs = [
  "#stock-outer-container",
  "#quest-outer-container",
  "#monarch-outer-container"
]

function setActiveMainTab(activeTabNum) {
  for (var i = 0; i < mainTabIDs.length; i++) {
    $(mainTabIDs[i]).removeClass("active-tab");
    $(mainTabIDs[i]).addClass("inactive-tab");
    $(mainContentIDs[i]).hide();
  }

  $(mainTabIDs[activeTabNum]).removeClass("inactive-tab");
  $(mainTabIDs[activeTabNum]).addClass("active-tab");
  $(mainContentIDs[activeTabNum]).show();
}

var stockTabIDs = [
  "#war-tab",
  "#magic-tab",
  "#goods-tab",
  "#monster-parts-tab"
]

var stockContentIDs = [
  "#war-container",
  "#magic-container",
  "#goods-container",
  "#monster-parts-container"
]

function setActiveStockTab(activeTabNum) {
  for (var i = 0; i < stockTabIDs.length; i++) {
    $(stockTabIDs[i]).removeClass("active-tab");
    $(stockTabIDs[i]).addClass("inactive-tab");
    $(stockContentIDs[i]).hide();
  }

  $(stockTabIDs[activeTabNum]).removeClass("inactive-tab");
  $(stockTabIDs[activeTabNum]).addClass("active-tab");
  $(stockContentIDs[activeTabNum]).show();
}

var numPopups = 0;

function makePopup(message) {
  var $newPopup = $("<div></div>");
  var $div_msg = $("<div>" + message + "</div>");
  $div_msg.css("height", "80%");
  $div_msg.css("width", "100%");
  $div_msg.css("overflow-y", "scroll");
  var $acknowledgeButton = $("<button>",
  {
    text: "Okay"
  });
  $acknowledgeButton.click(function() {
    $(this).parent().remove();
    numPopups--;
    if (numPopups === 0)
      $("#popup-container").css("z-index", 0);
  });
  $newPopup.addClass("popup");
  $newPopup.append($div_msg);
  $newPopup.append($acknowledgeButton);
  $("#popup-container").append($newPopup);
  $("#popup-container").css("z-index", 3);
  numPopups++;
}

function hideWelcome() {
  $("#welcome-image").remove();
  $("#welcome-title").remove();
  $("#start-button").remove();
  console.log("Hiding welcome message");
}


// End of tab functions --------------------------------------------------------

var time = 0;
var gamespeed = 500;
window.setInterval(function() {
    // This function will run every 'gamespeed' ms. Generally updates the price of
    // items (as well as the player's money from 'clicker' stuff) and then
    // draws this to the screen.
    var randEv = new ev()
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
      get_event();
    }

    if(time % 100 ==0){
      succession();
    }

    // Calculate and update the price, average cost, total return values.
    // only show average cost/total return if you actually own the item
    document.getElementById("KingName").innerHTML = currKing.name;
    document.getElementById("KingDescription").innerHTML = currKing.description;
    var count = 0;
    for(king of candidates){
      document.getElementById("Succ"+count+"Name").innerHTML = king.name;
      document.getElementById("Succ"+count+"Desc").innerHTML = king.description;
      count++;
    }
    for (item of allItems) {

        document.getElementById(item.name + "Price").innerHTML = item.price.toFixed(2);
    //    document.getElementById(item.name + "Bias").innerHTML = item.bias.toFixed(2);
    //    document.getElementById(item.name + "Vol").innerHTML = item.vol.toFixed(2);
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
  //  document.getElementById("hour").innerHTML = time;
}, gamespeed);
