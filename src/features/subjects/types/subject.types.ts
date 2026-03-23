export interface Subject {
    SubjectID: string;
    SubjectName: string;
    Notes?: string;
}

export interface CreateSubjectCommand {
    SubjectName: string;
    Notes?: string;
}

export interface UpdateSubjectCommand {
    SubjectID: string;
    SubjectName: string;
    Notes?: string;
}
