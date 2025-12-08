import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";
const manager = new StudentManager();
// Seed sample students so the table isn't empty on first load
try {
    manager.addStudent({ id: '663380001', title_name: 'นาย', first_name: 'สมชาย', last_name: 'ใจดี', email: 'somchai@example.com', year: 2022, major: 'Computer Science' });
    manager.addStudent({ id: '663380002', title_name: 'นางสาว', first_name: 'อร', last_name: 'สวย', email: 'orn@example.com', year: 2023, major: 'Information Technology' });
} catch (e) {
    // ignore if manager.addStudent not available
}
// expose for debug/seed helpers in the page
window.manager = manager;
function renderTable() {
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = ""; // เคลียร์ของเก่า
    const students = manager.getAllStudents();
    // ใช้ Generic Function แสดงผลใน Console
    showList(students);
    students.forEach((s) => {
        tableBody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.title_name} ${s.first_name} ${s.last_name}</td>
                <td>${s.email}</td>
                <td>${s.year}</td>
                <td>${s.major}</td>
            </tr>
        `;
    });
}
// ปุ่มเพิ่มนักศึกษา
document.getElementById("addBtn").onclick = () => {
    const id = document.getElementById("id").value;
    const title_name = document.getElementById("title_name").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const year = Number(document.getElementById("year").value);
    const major = document.getElementById("major").value;
    const student = { id, title_name, first_name, last_name, email, year, major };
    manager.addStudent(student);
    alert("บันทึกข้อมูลสำเร็จ!");
    renderTable();
};
// ปุ่มค้นหาด้วยชื่อ (Search Name)
document.getElementById("searchNameBtn").onclick = () => {
    const keyword = document.getElementById("searchName").value;
    const results = manager.findStudentsByName(keyword);
    alert(`พบข้อมูล: ${results.length} คน`);
    console.log(results);
};
// ปุ่มค้นหาด้วยสาขา (Search Major)
document.getElementById("searchMajorBtn").onclick = () => {
    const keyword = document.getElementById("searchMajor").value;
    const results = manager.findStudentsByMajor(keyword);
    alert(`พบในสาขา: ${results.length} คน`);
    console.log(results);
};
// โหลดข้อมูลครั้งแรก
renderTable();
