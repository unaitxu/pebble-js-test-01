var UI = require('ui');
var Vibe = require('ui/vibe');
var waterAmount = 0;
var pomodoroTime = 25;
var getUpTime = 60;
var smallBreak = 5;
var longBreak = 15;

var main = new UI.Menu({
  backgroundColor: 'black',
  textColor: '#66d9ef',
  highlightBackgroundColor: '#66d9ef',
  highlightTextColor: 'black',
  sections: [{
    items: [{
      title: 'Get Up'
    }, {
      title: 'Pomodoro'
    }, {
      title: 'Water'
    }]
  }]
});

main.show();

var pomodoro = new UI.Card({
  title: 'Much Pomo'
});

var water = new UI.Menu({
  backgroundColor: 'black',
  textColor: '#66d9ef',
  highlightBackgroundColor: '#66d9ef',
  highlightTextColor: 'black',
  sections: [{
    items: [{
      title: 'Add Cup'
    }, {
      title: stringedWater()
    }, {
      title: 'Subtract Cup'
    }]
  }]
});

var getUp = new UI.Card({
  title: 'Wow, Get Up'
});

main.on('select', function(e) {
  switch(e.itemIndex) {
    case 0:
      getUp.show();
      break;
    case 1:
      pomodoro.show();
      break;
    case 2:
      water.show();
  }
});

water.on('select', function(e) {
  switch(e.itemIndex) {
    case 0:
      waterAmount++;
      water.item(0, 1, { title: stringedWater() });
      break;
    case 1:   
      break;
    case 2:
      waterAmount--;
      water.item(0, 1, { title: stringedWater() });
  }
});

function stringedWater(){
  var wa = waterAmount.toString();
  return (wa + ' cups of water today');
}

pomodoro.on('click', 'select', function(e) {
  timer(pomodoroTime, pomodoro, 'Pomodoro');
});

getUp.on('click', 'select', function(e) {
  timer(getUpTime, getUp, 'GetUp');
});

function finishedTimer(elementName, element) {
  Vibe.vibrate('double');
  switch(elementName) {
    case 'Pomodoro':
      pomodoroTime = 25;
      element.title(pomodoroTime.toString() + ' minutes left!');
      break;
    case 'GetUp':
      getUpTime = 60;
      element.title(getUpTime.toString() + ' minutes left!');
      break;
    case 'Small':
      smallBreak = 5;
      element.title(smallBreak.toString() + ' minutes left!');
      break;
    case 'Long':
      longBreak = 15;
      element.title(longBreak.toString() + ' minutes left!');
      break;
  }
}

function timer(timeLeft, element, elementName) {
  setTimeout(function (){
    if (timeLeft > 0) {
      timeLeft--;
      element.title(timeLeft.toString() + ' minutes left!');
      timer(timeLeft, element, elementName);
    } else {
      finishedTimer(elementName, element);
    }
  }, 60000);
}