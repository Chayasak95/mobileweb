"use strict";
// 1. ประกาศตัวแปรแบบระบุ Type
let message = "Hello TypeScript!";
console.log(message);
// 2. ฟังก์ชันแบบระบุ Type (รับตัวเลข คืนค่าตัวเลข)
function multiply(a, b) {
    return a * b;
}
console.log("5 x 10 = " + multiply(5, 10));
