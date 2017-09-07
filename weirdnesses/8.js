function dis() { return this; }

var five = dis.call(5);
printThis(five);

five.potato = 'potato';
printThis(five.potato);

five++;
printThis(five);
printThis(five.potato);

five.potato = 'potato?';
printThis(five.potato);
