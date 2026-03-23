import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { useInstituteClassStore } from "../store/instituteClassStore";
import { useInstituteClassQuery } from "../hooks";
import { useInstituteQuery } from "../../institutes/hooks";

export const InstituteClassCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useInstituteClassStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = useInstituteClassQuery(id);

    const record = (response as any)?.Value || response;

    // Also fetch Institute to show its name (since DTO may only have InstituteID)
    const { data: instituteResponse, isLoading: isInstLoading } = useInstituteQuery(record?.InstituteID || null);
    const institute = (instituteResponse as any)?.Value || instituteResponse;

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading || isInstLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!record) return <Typography>لا يوجد بيانات</Typography>;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">تفاصيل الارتباط</Typography>
                <Divider />
                <Typography><strong>الجهة/المعهد:</strong> {institute?.Name || record.InstituteID}</Typography>
                <Typography><strong>اسم الحلقة:</strong> {record.Class?.Name}</Typography>
                <Typography><strong>مستوى الحلقة:</strong> {record.Class?.Level}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>بطاقة ارتباط الجهة والحلقة</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
