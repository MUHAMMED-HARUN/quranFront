import React, { useState } from "react";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    ListAlt as ListAltIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ScopeExecutionTable, ScopeExecutionForm, ScopeExecutionCard } from "../components";
import { useScopeExecutionStore } from "../store/scopeExecutionStore";
import { useDeleteScopeExecutionMutation, useScopeExecutionsQuery } from "../hooks/useScopeExecutions";

export const ScopeExecutionsPage = () => {
    const {
        selectedIds,
        openForm,
        openCard,
        setFilters,
        clearSelection,
    } = useScopeExecutionStore();

    const { data: listResponse } = useScopeExecutionsQuery();
    const deleteMutation = useDeleteScopeExecutionMutation();
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        setFilters({ search: searchInput });
    };

    const handleDelete = () => {
        if (window.confirm("هل أنت متأكد من الحذف؟")) {
            deleteMutation.mutate(selectedIds[0], {
                onSuccess: () => {
                    clearSelection();
                },
            });
        }
    };

    const handleNavigateDetails = () => {
        if (selectedIds.length === 1) {
            const executions = Array.isArray(listResponse) ? listResponse : ((listResponse as any)?.Value || []);
            const exec = executions.find((x: any) => (x.Id || x.ID) === selectedIds[0]);
            if (exec) {
                // Navigate to scope-execution-details page and pass the Name in the query param so that page auto-filters
                navigate(`/scope-execution-details?executionName=${encodeURIComponent(exec.Name)}`);
            }
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    إدارة عمليات تنفيذ النطاقات
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openForm} size="large" sx={{ borderRadius: 2 }}>
                    إضافة تنفيذ جديد
                </Button>
            </Box>

            {/* Filters Section */}
            <Box display="flex" gap={2} mb={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1}>
                {/* 
                  Note: The actual hooking up of searchInput requires backend 'Search' endpoint mirroring ScopeExecutionDetails.
                  If the endpoint is not yet defined, it acts purely locally or is ready for future implementation.
                */}
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
            <ScopeExecutionTable />

            {/* Actions Bar */}
            <Box display="flex" gap={2} mt={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1} alignItems="center">
                <Typography variant="body2" color="textSecondary" sx={{ mr: "auto" }}>
                    تم تحديد {selectedIds.length} عنصر
                </Typography>

                <Button variant="outlined" color="success" startIcon={<ListAltIcon />} disabled={selectedIds.length !== 1} onClick={handleNavigateDetails}>
                    عرض البيانات التفصيلية
                </Button>

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
            <ScopeExecutionForm />
            <ScopeExecutionCard />
        </Container>
    );
};
