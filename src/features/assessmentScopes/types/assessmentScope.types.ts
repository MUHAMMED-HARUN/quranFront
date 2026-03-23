import { z } from "zod";

export enum ScopeType {
    SubjectExam = 1,
    LevelExam = 2,
    Competition = 3,
    Qualification = 4,
    Individual = 5
}

export interface AssessmentScope {
    ID: string;
    Name: string;
    ScopeType: ScopeType;
    ProgramID: string;
    ParentScopeID?: string;
    ClassID?: string;
    InstituteClassID?: string;
    ScopeUnitTypeID: string;
    LogicalOperatorBetweenGroups: number;
    IsFinalDecisionScope: boolean;
    StartDate?: string;
    EndDate?: string;
    Notes?: string;
}

export interface CreateAssessmentScopeCommand {
    Name: string;
    ScopeType: ScopeType;
    ProgramID: string;
    ParentScopeID?: string;
    ClassID?: string;
    InstituteClassID?: string;
    ScopeUnitTypeID: string;
    LogicalOperatorBetweenGroups: number;
    IsFinalDecisionScope: boolean;
    StartDate?: string;
    EndDate?: string;
    Notes?: string;
}

export interface UpdateAssessmentScopeCommand extends CreateAssessmentScopeCommand {
    ID: string;
}

export const AssessmentScopeSchema = z.object({
    Name: z.string().min(1, "الاسم مطلوب"),
    ScopeType: z.nativeEnum(ScopeType).default(ScopeType.SubjectExam),
    ProgramID: z.string().min(1, "المشروع مطلوب"),
    ParentScopeID: z.string().optional().nullable(),
    ClassID: z.string().optional().nullable(),
    InstituteClassID: z.string().optional().nullable(),
    ScopeUnitTypeID: z.string().min(1, "وحدة النطاق مطلوبة"),
    LogicalOperatorBetweenGroups: z.number().default(0),
    IsFinalDecisionScope: z.boolean().default(false),
    StartDate: z.string().optional().nullable(),
    EndDate: z.string().optional().nullable(),
    Notes: z.string().optional().nullable()
});
