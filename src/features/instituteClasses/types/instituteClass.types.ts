import { Class } from "../../classes/types";

export interface InstituteClass {
    InstituteClassID: string;
    InstituteID: string;
    Class: Class;
}

export interface CreateInstituteClassCommand {
    InstituteID: string;
    ClassID: string;
}

export interface UpdateInstituteClassCommand {
    InstituteClassID: string;
    InstituteID: string;
    ClassID: string;
}
