import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    People as PeopleIcon,
} from "@mui/icons-material";


import { useGroupStore } from "../store/groupStore";
import { useDeleteGroupMutation } from "../hooks";
import { GroupTable, GroupForm, GroupCard } from "../components";

export const GroupsPage = () => {
    const { selectedIds, openForm, openCard, clearSelection } = useGroupStore();
    const deleteMutation = useDeleteGroupMutation();
    const navigate = useNavigate();

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

    const handleViewStudents = () => {
        if (selectedIds.length === 1) {
            navigate(`/groups/${selectedIds[0]}/students`);
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
                إدارة المجموعات
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        إضافة مجموعة
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
                        variant="contained"
                        color="secondary"
                        startIcon={<PeopleIcon />}
                        onClick={handleViewStudents}
                        disabled={selectedIds.length !== 1}
                    >
                        عرض الطلاب
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

            <GroupTable />
            <GroupForm />
            <GroupCard />
        </Box>
    );
};
