function dis() { return this; }

var five = dis.call(5);
evaluateThis(five);

five.potato = 'potato';
evaluateThis(five.potato);

five++;
evaluateThis(five);
evaluateThis(five.potato);

five.potato = 'potato?';
evaluateThis(five.potato);
