// Libs
var UI = require('ui');
var Vibe = require('ui/vibe');
var Wakeup = require('wakeup');

// Constants
const POMODORO = 25;
const GET_UP = 60;
const SMALL_BREAK = 5;
const LONG_BREAK = 15;

// Variables
var waterAmount = 0;
var pomodoroWakeup = 0;
var getUpWakeup = 0;
var smallBreakWakeup = 0;
var longBreakWakeup = 0;

// UI Variables

var pomodoro = new UI.Card({
  title: 'Pomodoro'
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
      title: 'Drink 8 cups of water daily :)'
    }, {
      title: 'Subtract Cup'
    }]
  }]
});

var getUp = new UI.Card({
  title: 'Get up every hour :)', 
  subtitle: 'Click the middle button to start it'
});

// Functions
function stringedWater(){
  var waterDate = new Date();
  if ((waterAmount === 0) && (localStorage.getItem('waterAmount') !== null) && (localStorage.getItem('waterDate') !== null) && (waterDate.getDate() == localStorage.getItem('waterDate'))){
    waterAmount = localStorage.getItem('waterAmount');
  }
  var wa = waterAmount.toString();
  return (wa + ' cups of water today');
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
          localStorage.setItem("pomodoroWakeupId", e.id);
          break;
        case 'GetUp':
          getUpWakeup = Wakeup.get(e.id);
          localStorage.setItem("getUpWakeupId", e.id);
          break;
        case 'Small':
          smallBreakWakeup = Wakeup.get(e.id);
          localStorage.setItem("smallBreakWakeupId", e.id);
          break;
        case 'Long':
          longBreakWakeup = Wakeup.get(e.id);
          localStorage.setItem("longBreakWakeupId", e.id);
          break;
      }
    }
  }); 
}

function checkWakeup(elementName) {
  switch(elementName) {
    case 'Pomodoro':
      if ((pomodoroWakeup === 0) && (localStorage.getItem("pomodoroWakeupId") !== null)) {
        pomodoroWakeup = Wakeup.get(localStorage.getItem("pomodoroWakeupId"));
      }
      return pomodoroWakeup;
    case 'GetUp':
      if ((getUpWakeup === 0) && (localStorage.getItem("getUpWakeupId") !== null)) {
        getUpWakeup = Wakeup.get(localStorage.getItem("getUpWakeupId"));
      }
      return getUpWakeup;
    case 'Small':
      if ((smallBreakWakeup === 0) && (localStorage.getItem("smallBreakWakeupId") !== null)) {
        smallBreakWakeup = Wakeup.get(localStorage.getItem("smallBreakWakeupId"));
      }
      return smallBreakWakeup;
    case 'Long':
      if ((longBreakWakeup === 0) && (localStorage.getItem("longBreakWakeupId") !== null)) {
        longBreakWakeup = Wakeup.get(localStorage.getItem("longBreakWakeupId"));
      }
      return longBreakWakeup;
    default:
      return false;
  }
}

function wakeupSeconds(elementName) {
  var wake = checkWakeup(elementName);
  if ((wake !== false) || (wake !== 0)) {
    return (Math.floor(wake.time - (Date.now() / 1000)));
  } else {
    return -1;
  }
}

function clearWakeup(elementName) {
  var wakeElement = '';
  switch(elementName) {
    case 'Pomodoro':
      pomodoroWakeup = 0;
      pomodoro.subtitle('Click the middle button to start');
      pomodoro.body('');
      wakeElement = 'pomodoroWakeupId';
      break;
    case 'GetUp':
      getUpWakeup = 0;
      getUp.subtitle('Click the middle button to start');
      getUp.body('');
      wakeElement = 'getUpWakeupId';
      break;
    case 'Small':
      smallBreakWakeup = 0;
      pomodoro.subtitle('Click the middle button to start');
      pomodoro.body('');
      wakeElement = 'smallBreakWakeupId';
      break;
    case 'Long':
      longBreakWakeup = 0;
      getUp.subtitle('Click the middle button to start');
      getUp.body('');
      wakeElement = 'longBreakWakeupId';
      break;
  }
  Wakeup.cancel(localStorage.getItem(wakeElement));
  localStorage.removeItem(wakeElement);
}

function timer(constantTime, element, elementName) {
  setTimeout(function (){
    var secondsLeft = wakeupSeconds(elementName);
    if (secondsLeft > 0) {
      element.subtitle(Math.floor(secondsLeft / 60).toString() + ' minutes left');
      element.body('Click the middle button to stop');
      timer(constantTime, element, elementName);
    }
  }, 1000);
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

getUp.on('show', function(e) {
  if ((checkWakeup('GetUp') === 0) && (checkWakeup('LongBreak') === 0)) {
    getUp.subtitle('Click the middle button to start');
    getUp.body('');
  } else if ((checkWakeup('GetUp') === 0) && (checkWakeup('LongBreak') !== 0)) {
    timer(LONG_BREAK, getUp, 'LongBreak');
  } else {
    timer(GET_UP, getUp, 'GetUp');
  }
});

getUp.on('click', 'select', function(e) {
  if (checkWakeup('GetUp') === 0) {
    createWakeup(GET_UP, 'GetUp');
    timer(GET_UP, getUp, 'GetUp'); 
  } else {
    clearWakeup('GetUp');
  }
});

getUp.on('longClick', 'select', function(e) {
  if (checkWakeup('LongBreak') === 0) {
    createWakeup(LONG_BREAK, 'LongBreak');
    timer(LONG_BREAK, getUp, 'LongBreak'); 
  } else {
    clearWakeup('LongBreak');
  }
});


water.on('show', function(e){
   water.item(0, 1, { title: stringedWater() });
});

water.on('select', function(e) {
  switch(e.itemIndex) {
    case 0:
      if (waterAmount < 8) {
        waterAmount++; 
      }
      break;
    case 2:
      if (waterAmount > 0) {
        waterAmount--; 
      }
  }
  var waterDate = new Date();
  localStorage.setItem("waterAmount", waterAmount);
  localStorage.setItem("waterDate", waterDate.getDate());
  if (waterAmount == 8) {
    water.item(0, 1, { title: 'Challenge completed!' });
  } else {
    water.item(0, 1, { title: stringedWater() }); 
  }
});

pomodoro.on('show', function(e) {
  if ((checkWakeup('Pomodoro') === 0) && (checkWakeup('SmallBreak') === 0)) {
    pomodoro.subtitle('Click the middle button to start');
    pomodoro.body('');
  } else if ((checkWakeup('Pomodoro') === 0) && (checkWakeup('SmallBreak') !== 0)) {
    timer(SMALL_BREAK, pomodoro, 'SmallBreak');
  } else {
    timer(POMODORO, pomodoro, 'Pomodoro');
  }
});

pomodoro.on('click', 'select', function(e) {
  if (checkWakeup('Pomodoro') === 0) {
    createWakeup(POMODORO, 'Pomodoro');
    timer(POMODORO, pomodoro, 'Pomodoro'); 
  } else {
    clearWakeup('Pomodoro');
  }
});

pomodoro.on('longClick', 'select', function(e) {
  if (checkWakeup('SmallBreak') === 0) {
    createWakeup(SMALL_BREAK, 'SmallBreak');
    timer(SMALL_BREAK, pomodoro, 'SmallBreak'); 
  } else {
    clearWakeup('SmallBreak');
  }
});

Wakeup.on('wakeup', function(e) {
  Vibe.vibrate('double');
  switch(e.data.wElementName) {
    case 'Pomodoro':
      pomodoroWakeup = 0;
      localStorage.removeItem("pomodoroWakeupId");
      pomodoro.subtitle('Finished at: ' + Date(e.time));
      pomodoro.show();
      break;
    case 'GetUp':
      getUpWakeup = 0;
      localStorage.removeItem("getUpWakeupId");
      getUp.subtitle('Finished at: ' + Date(e.time));
      getUp.show();
      break;
    case 'Small':
      smallBreakWakeup = 0;
      localStorage.removeItem("smallBreakWakeupId");
      pomodoro.subtitle('Finished at: ' + Date(e.time));
      pomodoro.show();
      break;
    case 'Long':
      longBreakWakeup = 0;
      localStorage.removeItem("longBreakWakeupId");
      getUp.subtitle('Finished at: ' + Date(e.time));
      getUp.show();
      break;
  }
});