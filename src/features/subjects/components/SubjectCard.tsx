import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { useSubjectStore } from "../store/subjectStore";
import { useSubjectQuery } from "../hooks";

export const SubjectCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useSubjectStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = useSubjectQuery(id);

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!response) return <Typography>لا يوجد بيانات</Typography>;

        const subject = (response as any)?.Value || response;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">{subject.SubjectName}</Typography>
                <Divider />
                <Typography><strong>ملاحظات:</strong> {subject.Notes || "لا يوجد"}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل المادة</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
