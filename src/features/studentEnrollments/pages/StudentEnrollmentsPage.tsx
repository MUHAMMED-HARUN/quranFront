import React from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";


import { useStudentEnrollmentStore } from "../store/studentEnrollmentStore";
import { useDeleteStudentEnrollmentMutation } from "../hooks";
import { StudentEnrollmentTable, StudentEnrollmentForm, StudentEnrollmentCard } from "../components";

export const StudentEnrollmentsPage = () => {
    const { selectedIds, openForm, openCard, clearSelection } = useStudentEnrollmentStore();
    const deleteMutation = useDeleteStudentEnrollmentMutation();

    const handleAdd = () => {
        openForm();
    };

    const handleEdit = () => {
        if (selectedIds.length === 1) {
            openForm(selectedIds[0]);
        }
    };

    const handleViewCard = () => {
        if (selectedIds.length === 1) {
            openCard();
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;

        if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.length} عنصر؟`)) {
            for (const id of selectedIds) {
                await deleteMutation.mutateAsync(id);
            }
            clearSelection();
        }
    };

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                إدارة تسجيل الطلاب في المجموعات
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        تسجيل طالب
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        disabled={selectedIds.length !== 1}
                    >
                        تعديل
                    </Button>

                    <Button
                        variant="outlined"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        onClick={handleViewCard}
                        disabled={selectedIds.length !== 1}
                    >
                        عرض البيانات
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0}
                    >
                        حذف المحددة
                    </Button>
                </Stack>
            </Paper>

            <StudentEnrollmentTable />
            <StudentEnrollmentForm />
            <StudentEnrollmentCard />
        </Box>
    );
};
