function formatMoney(num){
    return (+num).toLocaleString("en-US");
}

console.log(formatMoney(123456789));  // 123,456,789
console.log(formatMoney(6781)) // 6,781
console.log(formatMoney(5)) // 5
