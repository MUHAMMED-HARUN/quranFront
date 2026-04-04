export interface StudentEnrollment {
    StudentEnrollmentID: string;
    StudentID: string;
    StudentName?: string;
    NationalNumber?: string;
    GroupID: string;
    GroupName?: string;
    Date: string; // ISO Date String
    IsActive?: boolean;
    HasInProgressDetails?: boolean;
    HasPendingOrApprovedNominations?: boolean;
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
