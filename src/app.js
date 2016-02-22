var UI = require('ui');

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

var water = new UI.Card({
  title: 'So Water'
});

var getup = new UI.Card({
  title: 'Wow, Get Up'
});

main.on('select', function(e) {
  switch(e.itemIndex) {
    case 0:
      getup.show();
      break;
    case 1:
      pomodoro.show();
      break;
    case 2:
      water.show();
  }
});