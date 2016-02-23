var UI = require('ui');
var waterAmount = 0;

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