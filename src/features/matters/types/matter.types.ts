export interface Matter {
    ID: string;
    Name: string;
    ActorName?: string;
    Description?: string;
    Level?: string;
    MatterType: number;
    SubjectID: string;
    SubjectName?: string;
}

export interface CreateMatterCommand {
    Name: string;
    ActorName?: string;
    Description?: string;
    Level?: string;
    MatterType: number;
    SubjectID: string;
}

export interface UpdateMatterCommand {
    ID: string;
    Name: string;
    ActorName?: string;
    Description?: string;
    Level?: string;
    MatterType: number;
    SubjectID: string;
}
