import { Person } from "../../people/types";

export interface Teacher extends Person {
    TeacherID: string;
}

export interface SetPersonAsTeacherCommand {
    PersonID: string;
}

export interface UpdateTeacherCommand {
    TeacherID: string;
    NewPersonID: string;
}
