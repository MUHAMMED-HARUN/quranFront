import React, { useState } from "react";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { ProgramTable, ProgramForm, ProgramCard } from "../components";
import { useProgramStore } from "../store/programStore";
import { useDeleteProgramMutation } from "../hooks";

export const ProgramsPage = () => {
    const {
        selectedIds,
        openForm,
        openCard,
        setFilters,
        clearSelection,
    } = useProgramStore();
    const deleteMutation = useDeleteProgramMutation();
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        setFilters({ searchTerm: searchInput });
    };

    const handleDelete = () => {
        if (window.confirm("هل أنت متأكد من حذف البرنامج المحدد؟")) {
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
                    إدارة البرامج الأكاديمية
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openForm} size="large" sx={{ borderRadius: 2 }}>
                    إضافة برنامج جديد
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
            <ProgramTable />

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
            <ProgramForm />
            <ProgramCard />
        </Container>
    );
};
