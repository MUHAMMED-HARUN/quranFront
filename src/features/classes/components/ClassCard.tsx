import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { useClassStore } from "../store/classStore";
import { useClassQuery } from "../hooks";

export const ClassCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useClassStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = useClassQuery(id);

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!response) return <Typography>لا يوجد بيانات</Typography>;

        const cls = (response as any)?.Value || response;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">{cls.Name}</Typography>
                <Divider />
                <Typography><strong>المستوى:</strong> {cls.Level}</Typography>
                <Typography><strong>البرنامج الأكاديمي:</strong> {cls.ProgramID}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل الحلقة</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
