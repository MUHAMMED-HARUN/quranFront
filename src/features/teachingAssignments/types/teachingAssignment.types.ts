export interface TeachingAssignment {
    TeachingAssignmentID: string;
    TeacherID: string;
    GroupID: string;
    SubjectID: string;

    // Optional navigation fields if they exist from a DTO mapper, though usually the Form just uses IDs
    Teacher?: any;
    Group?: any;
    Subject?: any;
}

export interface CreateTeachingAssignmentCommand {
    TeacherID: string;
    GroupID: string;
    SubjectID: string;
}

export interface UpdateTeachingAssignmentCommand {
    TeachingAssignmentID: string;
    TeacherID: string;
    GroupID: string;
    SubjectID: string;
}
