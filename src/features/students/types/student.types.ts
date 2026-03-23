import { Person } from "../../people/types";

export interface Student extends Person {
    StudentID: string;
}

export interface SetPersonAsStudentCommand {
    PersonID: string;
}

export interface UpdateStudentCommand {
    StudentID: string;
    NewPersonID: string;
}
