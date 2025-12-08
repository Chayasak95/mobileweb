import { Student } from "../models/Student.js";

export class StudentManager {
    private students: Student[] = [];

    constructor() {
        this.loadFromLocalStorage();
    }

    addStudent(student: Student): void {
        this.students.push(student);
        this.saveToLocalStorage();
    }

    getAllStudents(): Student[] {
        return this.students;
    }

    
    findStudentsByName(keyword: string): Student[] {
        return this.students.filter(s => 
            s.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
            s.last_name.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    findStudentsByMajor(major: string): Student[] {
        return this.students.filter(s => 
            s.major.toLowerCase().includes(major.toLowerCase())
        );
    }

    
    findStudentByEmail(email: string): Student | undefined {
        return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
    }

    saveToLocalStorage(): void {
        localStorage.setItem("students", JSON.stringify(this.students));
    }

    loadFromLocalStorage(): void {
        const data = localStorage.getItem("students");
        if (data) {
            this.students = JSON.parse(data);
        }
    }
}