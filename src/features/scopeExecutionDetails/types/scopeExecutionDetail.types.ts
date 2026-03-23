import { z } from "zod";

export interface ScopeExecutionDetail {
    Id: string;
    ScopeExecutionID: string;
    GroupID: string;
    MatterID: string;
    ScopeFrom?: number | null;
    ScopeTo?: number | null;
    ScopeUnitTypeID?: string | null;
    Notes?: string | null;
}

export interface CreateScopeExecutionDetailCommand {
    ScopeExecutionID: string;
    GroupID: string;
    MatterID: string;
    ScopeFrom?: number | null;
    ScopeTo?: number | null;
    ScopeUnitTypeID?: string | null;
    Notes?: string | null;
}

export interface UpdateScopeExecutionDetailCommand extends CreateScopeExecutionDetailCommand {
    Id: string;
}

export const ScopeExecutionDetailSchema = z.object({
    ScopeExecutionID: z.string().min(1, "التنفيذ مطلوب"),
    GroupID: z.string().min(1, "المجموعة مطلوبة"),
    MatterID: z.string().min(1, "المادة/المقرر مطلوب"),
    ScopeFrom: z.coerce.number().optional().nullable(),
    ScopeTo: z.coerce.number().optional().nullable(),
    ScopeUnitTypeID: z.string().optional().nullable(),
    Notes: z.string().optional().nullable()
});
