import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { useInstituteStore } from "../store/instituteStore";
import { useInstituteQuery } from "../hooks";

export const InstituteCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useInstituteStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = useInstituteQuery(id);

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!response) return <Typography>لا يوجد بيانات</Typography>;

        const institute = (response as any)?.Value || response;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">{institute.Name}</Typography>
                <Divider />
                <Typography><strong>ملاحظات:</strong> {institute.Notes || "لا يوجد"}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل الجهة</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
