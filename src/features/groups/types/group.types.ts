export interface Group {
    GroupID: string;
    InstituteClassID: string;
    GroupName: string;
    Code: string;
}

export interface CreateGroupCommand {
    InstituteClassID: string;
    GroupName: string;
    Code: string;
}

export interface UpdateGroupCommand {
    GroupID: string;
    InstituteClassID: string;
    GroupName: string;
    Code: string;
}
