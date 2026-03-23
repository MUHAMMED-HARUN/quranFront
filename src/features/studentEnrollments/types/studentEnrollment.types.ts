export interface StudentEnrollment {
    StudentEnrollmentID: string;
    StudentID: string;
    GroupID: string;
    Date: string; // ISO Date String

    // Optional navigation properties if they arrive from GET queries
    Student?: any;
    Group?: any;
}

export interface CreateStudentEnrollmentCommand {
    StudentID: string;
    GroupID: string;
    Date: string;
}

export interface UpdateStudentEnrollmentCommand {
    StudentEnrollmentID: string;
    StudentID: string;
    GroupID: string;
    Date: string;
}
