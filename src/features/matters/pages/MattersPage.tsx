import React, { useState } from "react";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { MatterTable, MatterForm, MatterCard } from "../components";
import { useMatterStore } from "../store/matterStore";
import { useDeleteMatterMutation } from "../hooks";

export const MattersPage = () => {
    const {
        selectedIds,
        openForm,
        openCard,
        setFilters,
        clearSelection,
    } = useMatterStore();
    const deleteMutation = useDeleteMatterMutation();
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        setFilters({ search: searchInput });
    };

    const handleDelete = () => {
        if (window.confirm("هل أنت متأكد من حذف المادة المحددة؟")) {
            deleteMutation.mutate(selectedIds[0], {
                onSuccess: () => {
                    clearSelection();
                },
            });
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    إدارة المواد (Matters)
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openForm} size="large" sx={{ borderRadius: 2 }}>
                    إضافة مادة جديدة
                </Button>
            </Box>

            {/* Filters Section */}
            <Box display="flex" gap={2} mb={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1}>
                <TextField
                    label="بحث سريع"
                    variant="outlined"
                    size="small"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    sx={{ minWidth: 300 }}
                />
                <Button variant="outlined" onClick={handleSearch}>بحث</Button>
            </Box>

            {/* Main Table */}
            <MatterTable />

            {/* Actions Bar */}
            <Box display="flex" gap={2} mt={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1} alignItems="center">
                <Typography variant="body2" color="textSecondary" sx={{ mr: "auto" }}>
                    تم تحديد {selectedIds.length} عنصر
                </Typography>

                <Button variant="outlined" color="info" startIcon={<VisibilityIcon />} disabled={selectedIds.length !== 1} onClick={openCard}>
                    عرض التفاصيل
                </Button>

                <Button variant="outlined" color="warning" startIcon={<EditIcon />} disabled={selectedIds.length !== 1} onClick={openForm}>
                    تعديل
                </Button>

                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} disabled={selectedIds.length !== 1} onClick={handleDelete}>
                    حذف
                </Button>
            </Box>

            {/* Modals */}
            <MatterForm />
            <MatterCard />
        </Container>
    );
};
