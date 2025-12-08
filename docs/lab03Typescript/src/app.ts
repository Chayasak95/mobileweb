// 1. ประกาศตัวแปรแบบระบุ Type
let message: string = "Hello TypeScript!";
console.log(message);

// 2. ฟังก์ชันแบบระบุ Type (รับตัวเลข คืนค่าตัวเลข)
function multiply(a: number, b: number): number {
    return a * b;
}

console.log("5 x 10 = " + multiply(5, 10));