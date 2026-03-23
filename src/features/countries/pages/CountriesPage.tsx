import React from "react";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Map as CityIcon,
} from "@mui/icons-material";
import { CountryTable, CountryForm, CountryCard } from "../components";
import { useCountryStore } from "../store/countryStore";
import { useDeleteCountryMutation } from "../hooks";
import { useNavigate } from "react-router-dom";

export const CountriesPage = () => {
    const navigate = useNavigate();
    const {
        openForm,
        selectedIds,
        clearSelection,
        filters,
        setFilters,
        openCard,
    } = useCountryStore();

    const deleteMutation = useDeleteCountryMutation();

    const handleAddNew = () => {
        clearSelection();
        openForm();
    };

    const handleEdit = () => {
        if (selectedIds.length === 1) {
            openForm();
        }
    };

    const handleDetails = () => {
        if (selectedIds.length === 1) {
            openCard(selectedIds[0]);
        }
    };

    const handleChildrenDetails = () => {
        if (selectedIds.length === 1) {
            navigate(`/cities?countryId=${selectedIds[0]}`);
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} dir="rtl">
            {/* 1. Header (tableData<TableTitle>, addAction) */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h4" component="h1">
                    إدارة الدول
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddNew}
                >
                    إضافة دولة
                </Button>
            </Box>

            {/* 2. Filters */}
            <Box mb={3} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}>
                <TextField
                    size="small"
                    label="البحث"
                    variant="outlined"
                    value={filters.SearchTerm || ""}
                    onChange={(e) => setFilters({ ...filters, SearchTerm: e.target.value })}
                    placeholder="ابحث عن دولة..."
                />
            </Box>

            {/* 3. Data Table (dataRows) */}
            <CountryTable />

            {/* 4. Actions Bar */}
            <Box display="flex" gap={2} mt={3}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    disabled={selectedIds.length !== 1}
                    onClick={handleEdit}
                >
                    تعديل
                </Button>
                <Button
                    variant="outlined"
                    color="info"
                    startIcon={<VisibilityIcon />}
                    disabled={selectedIds.length !== 1}
                    onClick={handleDetails}
                >
                    معلومات خاصة (Entity Card)
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CityIcon />}
                    disabled={selectedIds.length !== 1}
                    onClick={handleChildrenDetails}
                >
                    معلومات مفصلة (المدن)
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    disabled={selectedIds.length === 0 || deleteMutation.isPending}
                    onClick={handleDelete}
                >
                    {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
                </Button>
            </Box>

            {/* Modals */}
            <CountryForm />
            <CountryCard />
        </Container>
    );
};
