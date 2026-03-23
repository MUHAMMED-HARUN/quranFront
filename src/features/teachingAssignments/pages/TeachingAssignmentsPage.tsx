import React from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";


import { useTeachingAssignmentStore } from "../store/teachingAssignmentStore";
import { useDeleteTeachingAssignmentMutation } from "../hooks";
import { TeachingAssignmentTable, TeachingAssignmentForm, TeachingAssignmentCard } from "../components";

export const TeachingAssignmentsPage = () => {
    const { selectedIds, openForm, openCard, clearSelection } = useTeachingAssignmentStore();
    const deleteMutation = useDeleteTeachingAssignmentMutation();

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
                إدارة تكاليف المعلمين
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        إضافة تكليف
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

            <TeachingAssignmentTable />
            <TeachingAssignmentForm />
            <TeachingAssignmentCard />
        </Box>
    );
};
