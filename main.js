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
var axes = new Item("axe", 50, 50, 30);
var shields = new Item("shield", 30, 30, 10);
var grain = new Item("grain", 15, 12, 5);
var leather = new Item("leather", 12, 12, 5);
var livestock = new Item("livestock", 17, 20, 20);
var wine = new Item("wine", 100, 90, 25);
var crystals = new Item("crystal", 90, 90, 20);
var dragon_scales = new Item("dragon scales", 150, 200, 45);
var scepters = new Item("scepter", 75, 80, 30);
var tomes = new Item("tome", 40, 40, 10);
var troll_teeth = new Item("troll teeth", 25, 40, 17);
var goblin_hide = new Item("goblin hide", 10, 10, 10);
var rum = new Item("rum", 20, 30, 10);
var cyclops_eyes = new Item("cyclops eye", 80, 80, 20);
var unicorn_horn = new Item("unicorn horn", 120, 110, 30);
var phoenix_ash = new Item("phoenix ash", 200, 200, 50);
var blanks =new Item("blanks", 0, 0, 0);
var allItems = [scrolls, swords, axes, shields, grain, leather, livestock,
 wine, crystals, dragon_scales, scepters, tomes, troll_teeth,
 goblin_hide, rum, cyclops_eyes, unicorn_horn, phoenix_ash];
var war =[swords, axes, shields];
var magic = [scrolls, crystals, scepters, tomes];
var goods = [grain, livestock, leather, wine, rum];
var monster_parts = [dragon_scales, troll_teeth, cyclops_eyes,
goblin_hide, unicorn_horn, phoenix_ash];

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
            document.getElementById(item.name + "AverageCost").innerHTML = (item.total_cost / item.shares.length).toFixed(2);
        } else {
            document.getElementById(item.name + "AverageCost").innerHTML = 0;
        }
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

function create_kings(){
  //var events = [];
  alert("Kings loaded!");
  k1 = new king("Queen Audra II",
  "A sorcerrer's apprentence", magic, war);
  k2 = new king("King Bartholemau I",
  "A military general who believes the neibouring kindom will declar war", war, goods)
  kings.push(k1);
  kings.push(k2);
}

function pick_candidates(){
  var rand;
  var candidate;
  for(var i=0; i<2; i++){
    rand = Math.floor(Math.random() * kings.length);
    candidate = kings[rand];
    candidates.push(candidate);
    kings.splice(rand, 1);
  }
}

function succession(){
  var i;
  currKing= candidates[[Math.floor(Math.random() * candidates.length)]];
  for(i=0; i<currKing.typeUp.size; i++){
    currKing.typeUp[i].price+=10;
    currKing.typeUp[i].bias+=20;
  }
  for(i=0; i<currKing.typeDown.size; i++){
    if(currKing.typeDown[i].price-10>1){
      currKing.typeDown[i].price-=10;
    }
    else{
      currKing.typeDown[i].price=1
    }
    if(currKing.typeDown[i].bias-20<10){
      currKing.typeDown[i].price=10
    }
    else{
      currKing.typeDown[i].bias-=20;
    }
  }
}

function get_event(randEv){
  var randEv = new ev();
  randEv=events[Math.floor(Math.random() * events.length)];
  alert(randEv.title);
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
}
function create_events(){
  var events = [];
  alert("Events loaded!");
  create = new ev(swords, blanks, "Axes in Fashion",
  "After a recent raid by some dashing vikings, people have become smitten with axes."
  , 10, 0, -20, 0);
  ev1 = new ev(swords, axes, "War declared!", "A neighboring kingdom has declared war on our noble nation, causing many to buy weapons.", 10, 10, 20, 20);
  ev2 = new ev(swords, shields, "Invasion!", "Our kingdom has been invaded! Invest in swords and shields to protect yourself!", 5, 5, 15, 20);
  ev4 = new ev(grain, blanks, "Drought", "Our land has not received rainfall since the last full moon, causing the crops to grow less.", 20, 0, -25, 0);
  ev5 = new ev(crystals, blanks, "Eureka!", "Explorers have discovered a foreign land trading thousands of crystals!", 15, 0, 15, 0);
  ev6 = new ev(crystals, blanks, "Tariff", "Our traders have placed a tariff on exported crystals, causing less of them to be shipped to our nation.", 15, 0, -15, 0);
  ev7 = new ev(dragon_scales, blanks, "Save the dragons!", "Activists have insisted that people stop killing dragons for their scales.", 5, 0, -5, 0);
  ev8 = new ev(unicorn_horn, blanks, "Save the unicorns!", "Activists have insisted that people stop killing unicorns for their horns.", 5, 0, -5, 0);
  ev9 = new ev(tomes, blanks, "Tomes in fashion!", "I'm not quite sure what a tome is, but a lot of people seem to be buying them right now! Invest!", 10, 0, 10, 0);
  ev10 = new ev(cyclops_eyes, blanks, "Cyclops island discovered!", "An island inhabited by cyclopses has been discovered and pillaged, leading to a surplus in cyclops eyes.", 10, 0, 5, 0);
  ev11 = new ev(leather, blanks, "Leather in fashion!", "Many people are buying leather as a new fashion trend.", 10, 0, 10, 0);
  ev12 = new ev(leather, blanks, "Leather out of fashion!", "People have seemed to lose interest in leather. Expect stocks to fall.", 10, 0, -5, 0);
  //ev13 = new ev(pegasus_feathers, blanks, "Feathers in fashion!", "People have begun wearing pegasus feathers in their hair as a good luck charm! Invest!", 8, 0, 6, 0);
  ev14 = new ev(scepters, blanks, "A surplus in scepters!", "There seems to be a huge interest in scepters recently! Expect stocks to raise!", 5, 0, 7, 0);
  ev15 = new ev(phoenix_ash, blanks, "Ash everywhere!", "It is phoenix season, and their ash is going in fashion!", 7, 0, 27, 0);
  ev16 = new ev(troll_teeth, blanks, "Trolled!", "Troll teeth are going out of fashion.", 5, 0, -10, 0);
  ev17 = new ev(goblin_hide, blanks, "Hides in fashion!", "People have become increasingly impressed with goblin hides, causing prices to increase!", 5, 0, 3, 0);
  events.push(create);
  events.push(ev1);
  events.push(ev2);
//  events.push(ev3);
  events.push(ev4);
  events.push(ev5);
  events.push(ev6);
  events.push(ev7);
  events.push(ev8);
  events.push(ev9);
  events.push(ev10);
  events.push(ev11);
  events.push(ev12);
  //events.push(ev13);
  events.push(ev14);
  events.push(ev15);
  events.push(ev16);
  events.push(ev17);
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

    document.getElementById("tradingDay").innerHTML = Math.floor(time/24) + 1;
    document.getElementById("tradingHour").innerHTML = Math.floor(time % 24);
    document.getElementById("hour").innerHTML = time;
}, gamespeed);
