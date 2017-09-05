function dis() {
    return this;
}

var five = dis.call(5);
console.log(five);

five.potato = 'potato';
console.log(five.potato);
five++;
console.log(five);
console.log(five.potato);

five.potato = 'potato?';
console.log(five.potato);
