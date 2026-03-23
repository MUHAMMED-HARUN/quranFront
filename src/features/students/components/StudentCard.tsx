import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { useStudentStore } from "../store/studentStore";
import { useStudentQuery } from "../hooks";

export const StudentCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useStudentStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = useStudentQuery(id);

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!response) return <Typography>لا توجد بيانات</Typography>;

        const student = (response as any)?.Value || response;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">تفاصيل الطالب</Typography>
                <Divider />
                <Typography><strong>الاسم:</strong> {student.FirstName} {student.FatherName} {student.LastName}</Typography>
                <Typography><strong>رقم الهوية:</strong> {student.NationalNumber}</Typography>
                <Typography><strong>تاريخ الميلاد:</strong> {new Date(student.BirthDate).toLocaleDateString("ar-EG")}</Typography>
                <Typography><strong>الجنس:</strong> {student.Gender === 1 ? "ذكر" : "أنثى"}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>بطاقة الطالب</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
