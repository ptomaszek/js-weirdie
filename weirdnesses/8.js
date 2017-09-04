function dis() {
    return this
}

var five = dis.call(5);
console.log(five);

five.potato = 'potato';
console.log(five.potato);

console.log(five * 5);
console.log(five.potato);

console.log(++five);
console.log(five.potato);

five.potato = 'potato?';
console.log(five.potato);
