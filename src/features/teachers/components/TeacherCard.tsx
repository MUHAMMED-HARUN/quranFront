import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Divider } from "@mui/material";
import { useTeacherStore } from "../store/teacherStore";
import { useTeacherQuery } from "../hooks";

export const TeacherCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useTeacherStore();
    const id = selectedIds.length === 1 ? selectedIds[0] : null;

    const { data: response, isLoading, isError, error } = useTeacherQuery(id);

    const handleClose = () => closeCard();

    const renderContent = () => {
        if (isLoading) return <CircularProgress />;
        if (isError) return <Typography color="error">{(error as Error).message}</Typography>;
        if (!response) return <Typography>لا توجد بيانات</Typography>;

        const teacher = (response as any)?.Value || response;

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">تفاصيل المعلم</Typography>
                <Divider />
                <Typography><strong>الاسم:</strong> {teacher.FirstName} {teacher.FatherName} {teacher.LastName}</Typography>
                <Typography><strong>رقم الهوية:</strong> {teacher.NationalNumber}</Typography>
                <Typography><strong>تاريخ الميلاد:</strong> {new Date(teacher.BirthDate).toLocaleDateString("ar-EG")}</Typography>
                <Typography><strong>الجنس:</strong> {teacher.Gender === 1 ? "ذكر" : "أنثى"}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>بطاقة المعلم</DialogTitle>
            <DialogContent dividers>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};
