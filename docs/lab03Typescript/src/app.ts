import { Student } from "./models/Student.js";
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";

const manager = new StudentManager();

function renderTable() {
    const tableBody = document.getElementById("studentTableBody")!;
    tableBody.innerHTML = ""; // เคลียร์ของเก่า
    const students = manager.getAllStudents();
    
    // ใช้ Generic Function แสดงผลใน Console
    showList<Student>(students); 

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
(document.getElementById("addBtn") as HTMLButtonElement).onclick = () => {
    const id = (document.getElementById("id") as HTMLInputElement).value;
    const title_name = (document.getElementById("title_name") as HTMLInputElement).value;
    const first_name = (document.getElementById("first_name") as HTMLInputElement).value;
    const last_name = (document.getElementById("last_name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const year = Number((document.getElementById("year") as HTMLInputElement).value);
    const major = (document.getElementById("major") as HTMLInputElement).value;

    const student: Student = { id, title_name, first_name, last_name, email, year, major };
    manager.addStudent(student);
    alert("บันทึกข้อมูลสำเร็จ!");
    renderTable();
};

// ปุ่มค้นหาด้วยชื่อ (Search Name)
(document.getElementById("searchNameBtn") as HTMLButtonElement).onclick = () => {
    const keyword = (document.getElementById("searchName") as HTMLInputElement).value;
    const results = manager.findStudentsByName(keyword);
    alert(`พบข้อมูล: ${results.length} คน`);
    console.log(results);
};

// ปุ่มค้นหาด้วยสาขา (Search Major)
(document.getElementById("searchMajorBtn") as HTMLButtonElement).onclick = () => {
    const keyword = (document.getElementById("searchMajor") as HTMLInputElement).value;
    const results = manager.findStudentsByMajor(keyword);
    alert(`พบในสาขา: ${results.length} คน`);
    console.log(results);
};

// โหลดข้อมูลครั้งแรก
renderTable();