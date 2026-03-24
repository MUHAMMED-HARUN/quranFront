import React from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, CircularProgress, Divider
} from "@mui/material";
import { useDailyEvaluationStore } from "../store/dailyEvaluationStore";
import { useDailyEvaluationsQuery } from "../hooks/useDailyEvaluations";

export const DailyEvaluationCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useDailyEvaluationStore();
    const { data: response, isLoading } = useDailyEvaluationsQuery();

    const isSingleSelection = selectedIds.length === 1;
    const evaluations = Array.isArray(response) ? response : ((response as any)?.Value || []);
    const item = isSingleSelection ? evaluations.find((x: any) => (x.Id || x.ID) === selectedIds[0]) : null;

    const getLevelText = (level: number) => {
        switch (level) {
            case 0: return "ممتاز";
            case 1: return "جيد جدا";
            case 2: return "جيد";
            case 3: return "مقبول";
            case 4: return "ضعيف";
            default: return "-";
        }
    };

    return (
        <Dialog open={isCardOpen} onClose={closeCard} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل التقييم</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : item ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="subtitle1"><strong>رقم التسجيل:</strong> {item.StudentEnrollmentID || "-"}</Typography>
                        <Divider />
                        <Typography variant="body1"><strong>التاريخ:</strong> {item.Date ? item.Date.split("T")[0] : "-"}</Typography>
                        <Typography variant="body1"><strong>النطاق المقروء:</strong> من {item.From} إلى {item.To}</Typography>
                        <Typography variant="body1"><strong>نوع الوحدة:</strong> {item.UnitTypeID}</Typography>
                        <Typography variant="body1"><strong>المادة التعليمة:</strong> {item.MatterID}</Typography>
                        <Typography variant="body1"><strong>مستوى التقييم:</strong> {getLevelText(item.LevelID !== undefined ? item.LevelID : item.Level)}</Typography>
                    </Box>
                ) : (
                    <Typography color="error">تعذر الحصول على التفاصيل.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCard} variant="contained" color="primary">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};
