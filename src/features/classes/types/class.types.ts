export interface Class {
    ClassID: string;
    Name: string;
    Level: number;
    ProgramID: string;
}

export interface CreateClassCommand {
    Name: string;
    Level: number;
    ProgramID: string;
}

export interface UpdateClassCommand {
    ClassID: string;
    Name: string;
    Level: number;
    ProgramID: string;
}
