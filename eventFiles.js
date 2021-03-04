//code for reading in files

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
