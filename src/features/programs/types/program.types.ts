export interface Program {
    ProgramID: string;
    Name: string;
    Notes?: string;
}

export interface CreateProgramCommand {
    Name: string;
    Notes?: string;
}

export interface UpdateProgramCommand {
    ProgramID: string;
    Name: string;
    Notes?: string;
}
