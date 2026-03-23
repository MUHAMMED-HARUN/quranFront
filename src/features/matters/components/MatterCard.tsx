import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Divider
} from "@mui/material";
import { useMatterStore } from "../store/matterStore";
import { useMatterQuery } from "../hooks";

export const MatterCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useMatterStore();
    const isSingleSelection = selectedIds.length === 1;
    const { data: response, isLoading } = useMatterQuery(isSingleSelection ? selectedIds[0] : null);

    const matter = (response as any)?.Value || response;

    return (
        <Dialog open={isCardOpen} onClose={closeCard} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل المادة</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : matter ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="subtitle1"><strong>اسم المادة:</strong> {matter.Name}</Typography>
                        <Divider />
                        <Typography variant="body1"><strong>المسؤول:</strong> {matter.ActorName || "-"}</Typography>
                        <Typography variant="body1"><strong>المقرر:</strong> {matter.SubjectName || "-"}</Typography>
                        <Typography variant="body1"><strong>وصف:</strong> {matter.Description || "-"}</Typography>
                        <Typography variant="body1"><strong>المستوى:</strong> {matter.Level || "-"}</Typography>
                        <Typography variant="body1"><strong>النوع:</strong> {matter.MatterType === 0 ? "نظري" : "عملي"}</Typography>
                    </Box>
                ) : (
                    <Typography color="error">تعذر جلب تفاصيل المادة.</Typography>
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
