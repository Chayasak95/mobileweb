export class StudentManager {
    constructor() {
        this.students = [];
        this.loadFromLocalStorage();
    }
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }
    getAllStudents() {
        return this.students;
    }
    // แก้ไข: ค้นหาได้ทั้งจาก ชื่อ หรือ นามสกุล [cite: 1050-1053]
    findStudentsByName(keyword) {
        return this.students.filter(s => s.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
            s.last_name.toLowerCase().includes(keyword.toLowerCase()));
    }
    findStudentsByMajor(major) {
        return this.students.filter(s => s.major.toLowerCase().includes(major.toLowerCase()));
    }
    // เพิ่มใหม่: ค้นหาด้วย Email [cite: 1054-1055]
    findStudentByEmail(email) {
        return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
    }
    saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(this.students));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("students");
        if (data) {
            this.students = JSON.parse(data);
        }
    }
}
