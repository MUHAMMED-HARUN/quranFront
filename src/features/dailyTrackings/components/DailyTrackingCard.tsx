import React from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, CircularProgress, Divider
} from "@mui/material";
import { useDailyTrackingStore } from "../store/dailyTrackingStore";
import { useDailyTrackingsQuery } from "../hooks/useDailyTrackings";

export const DailyTrackingCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useDailyTrackingStore();
    const { data: response, isLoading } = useDailyTrackingsQuery();

    const isSingleSelection = selectedIds.length === 1;
    const trackings = Array.isArray(response) ? response : ((response as any)?.Value || []);
    const item = isSingleSelection ? trackings.find((x: any) => (x.Id || x.ID) === selectedIds[0]) : null;

    return (
        <Dialog open={isCardOpen} onClose={closeCard} maxWidth="sm" fullWidth>
            <DialogTitle>التفاصيل</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : item ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="subtitle1"><strong>معرّف المادة:</strong> {item.MatterID || "-"}</Typography>
                        <Divider />
                        <Typography variant="body1"><strong>معرّف الطالب:</strong> {item.StudentID || "-"}</Typography>
                        <Typography variant="body1"><strong>الوحدة الحالية:</strong> {item.CurrentUnit}</Typography>
                        <Typography variant="body1"><strong>إجمالي الوحدات:</strong> {item.TotalScopeUnit}</Typography>
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
