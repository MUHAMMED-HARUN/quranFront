import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box,
    Chip
} from "@mui/material";
import { EnrollmentStatus } from "../types/enrollStudentInScopeExecution.types";

interface EnrollStudentInScopeExecutionCardProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
}

const statusTextMap: Record<number, string> = {
    [EnrollmentStatus.Enrolled]: "مسجل",
    [EnrollmentStatus.InProgress]: "قيد التنفيذ",
    [EnrollmentStatus.Completed]: "مكتمل",
    [EnrollmentStatus.Dropped]: "منسحب",
    [EnrollmentStatus.Suspended]: "معلق",
};

const statusColorMap: Record<number, "default" | "primary" | "secondary" | "success" | "warning" | "error"> = {
    [EnrollmentStatus.Enrolled]: "primary",
    [EnrollmentStatus.InProgress]: "warning",
    [EnrollmentStatus.Completed]: "success",
    [EnrollmentStatus.Dropped]: "error",
    [EnrollmentStatus.Suspended]: "default",
};

export const EnrollStudentInScopeExecutionCard = ({ isOpen, onClose, item }: EnrollStudentInScopeExecutionCardProps) => {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", bgcolor: "primary.main", color: "white" }}>
                تفاصيل تسجيل الطالب
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={3}>
                    <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
                        <Typography variant="h6" fontWeight="bold">بيانات الطالب</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box>
                        <Typography variant="body2" color="textSecondary">الرقم الوطني:</Typography>
                        <Typography variant="body1" fontWeight="bold">{item.NationalNumber}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="textSecondary">اسم الطالب:</Typography>
                        <Typography variant="body1" fontWeight="bold">{item.StudentName}</Typography>
                    </Box>

                    <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
                        <Typography variant="h6" fontWeight="bold" mt={2}>بيانات التسجيل</Typography>
                        <Divider sx={{ my: 1 }} />
                    </Box>

                    <Box>
                        <Typography variant="body2" color="textSecondary">تاريخ التسجيل:</Typography>
                        <Typography variant="body1">{String(item.EnrollmentDate).split("T")[0]}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="textSecondary">الحالة:</Typography>
                        <Chip
                            sx={{ mt: 1 }}
                            label={statusTextMap[item.Status] || "غير معروف"}
                            color={statusColorMap[item.Status] || "default"}
                            size="small"
                        />
                    </Box>

                    {item.StartDate && (
                        <Box>
                            <Typography variant="body2" color="textSecondary">تاريخ البدء:</Typography>
                            <Typography variant="body1">{String(item.StartDate).split("T")[0]}</Typography>
                        </Box>
                    )}
                    {item.CompletionDate && (
                        <Box>
                            <Typography variant="body2" color="textSecondary">تاريخ الانتهاء:</Typography>
                            <Typography variant="body1">{String(item.CompletionDate).split("T")[0]}</Typography>
                        </Box>
                    )}

                    <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
                        <Typography variant="body2" color="textSecondary">الملاحظات:</Typography>
                        <Typography variant="body1">{item.Notes || "لا توجد"}</Typography>
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog >
    );
};
