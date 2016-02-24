// Libs
var UI = require('ui');
var Vibe = require('ui/vibe');
var Wakeup = require('wakeup');

// Constants
const POMODORO = 2;
const GET_UP = 60;
const SMALL_BREAK = 5;
const LONG_BREAK = 15;

// Variables
var waterAmount = 0;
var pomodoroWakeup = 0;
var getUpWakeup = 0;
var smallBreakWakeup = 0;
var longBreakWakeup = 0;

// functions
function stringedWater(){
  var wa = waterAmount.toString();
  return (wa + ' cups of water today');
}

// App
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
Wakeup.cancel('all');

var pomodoro = new UI.Card({
  title: 'Pomodoro', 
  subtitle: 'Click the middle button to start it'
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
  title: 'Get up every hour :)', 
  subtitle: 'Click the middle button to start it'
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

getUp.on('click', 'select', function(e) {
  timer(GET_UP, getUp, 'GetUp');
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

pomodoro.on('click', 'select', function(e) {
  timer(POMODORO, pomodoro, 'Pomodoro');
});

function timer(constantTime, element, elementName) {
  if (checkWakeup(elementName) === 0) {
    createWakeup(constantTime, elementName);
  }
  setTimeout(function (){
    var secondsLeft = wakeupSeconds(elementName);
    if (secondsLeft > 0) {
      element.subtitle(Math.floor(secondsLeft / 60).toString() + ' minutes left');
      timer(constantTime, element, elementName);
    }
  }, 1000);
}

function createWakeup(constantTime, elementName) {
  Wakeup.schedule({
    time: (Date.now() / 1000) + 60 * constantTime,
    data: {
      wElementName: elementName
    }
  },
  function(e) {
    if (e.failed) {
      console.log('Wakeup failed: ' + JSON.stringify(e));
    } else {
      switch(elementName) {
        case 'Pomodoro':
          pomodoroWakeup = Wakeup.get(e.id);
          break;
        case 'GetUp':
          getUpWakeup = Wakeup.get(e.id);
          break;
        case 'Small':
          smallBreakWakeup = Wakeup.get(e.id);
          break;
        case 'Long':
          longBreakWakeup = Wakeup.get(e.id);
          break;
      }
    }
  }); 
}

function checkWakeup(elementName) {
  switch(elementName) {
    case 'Pomodoro':
      return pomodoroWakeup;
    case 'GetUp':
      return getUpWakeup;
    case 'Small':
      return smallBreakWakeup;
    case 'Long':
      return longBreakWakeup;
    default:
      return false;
  }
}

function wakeupSeconds(elementName) {
  var wake = checkWakeup(elementName);
  if (wake !== false) {
    return (Math.floor(wake.time - (Date.now() / 1000)));
  } else {
    return -1;
  }
}

Wakeup.on('wakeup', function(e) {
  Vibe.vibrate('double');
  switch(e.data.wElementName) {
    case 'Pomodoro':
      pomodoroWakeup = 0;
      pomodoro.subtitle('Finished at: ' + Date(e.time));
      pomodoro.show();
      break;
    case 'GetUp':
      getUpWakeup = 0;
      getUp.subtitle('Finished at: ' + Date(e.time));
      getUp.show();
      break;
    case 'Small':
      smallBreakWakeup = 0;
      break;
    case 'Long':
      longBreakWakeup = 0;
      break;
  }
});