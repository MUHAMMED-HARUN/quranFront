import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { usePersonStore } from "../store/personStore";
import { usePersonQuery } from "../hooks";

export const PersonCard = () => {
    const { isCardOpen, closeCard, selectedIds } = usePersonStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = usePersonQuery(id);

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!response) return <Typography>لا يوجد بيانات</Typography>;

        const person = (response as any)?.Value || response;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">{person.FirstName} {person.FatherName} {person.LastName}</Typography>
                <Divider />
                <Typography><strong>الرقم الوطني:</strong> {person.NationalNumber}</Typography>
                <Typography><strong>الجنس:</strong> {person.Gender ? "ذكر" : "أنثى"}</Typography>
                <Typography><strong>اسم الأم:</strong> {person.MotherName} {person.MotherLastName}</Typography>
                <Typography><strong>تاريخ الميلاد:</strong> {person.BirthDate ? person.BirthDate.split("T")[0] : ""}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل الشخص</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
