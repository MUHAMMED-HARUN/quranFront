import { z } from "zod";

export interface DailyTracking {
    Id: string;
    MatterID: string;
    StudentID: string;
    CurrentUnit: number;
    ScopeUnitTypeID: string;
    TotalScopeUnit: number;
}

export interface CreateDailyTrackingCommand {
    MatterID: string;
    StudentID: string;
    CurrentUnit: number;
    ScopeUnitTypeID: string;
    TotalScopeUnit: number;
}

export interface UpdateDailyTrackingCommand extends CreateDailyTrackingCommand {
    Id: string;
}

export const DailyTrackingSchema = z.object({
    MatterID: z.string().min(1, "المقرر مطلوب"),
    StudentID: z.string().min(1, "الطالب مطلوب"),
    CurrentUnit: z.coerce.number().min(0, "يجب أن تكون قيمة موجبة"),
    ScopeUnitTypeID: z.string().min(1, "وحدة النطاق مطلوبة"),
    TotalScopeUnit: z.coerce.number().min(0, "يجب أن تكون قيمة موجبة"),
});
