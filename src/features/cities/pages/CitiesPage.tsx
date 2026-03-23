import React from "react";
import { Box, Typography, Button, Container, TextField } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { CityTable, CityForm, CityCard } from "../components";
import { useCityStore } from "../store/cityStore";
import { useDeleteCityMutation } from "../hooks";
import { useSearchParams } from "react-router-dom";

export const CitiesPage = () => {
    const [searchParams] = useSearchParams();
    const {
        openForm,
        selectedIds,
        clearSelection,
        filters,
        setFilters,
        openCard,
    } = useCityStore();

    const deleteMutation = useDeleteCityMutation();

    React.useEffect(() => {
        const countryIdUrl = searchParams.get("countryId");
        if (countryIdUrl && countryIdUrl !== filters.CountryID) {
            setFilters({ ...filters, CountryID: countryIdUrl });
        }
    }, [searchParams, filters, setFilters]);

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
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">
                    إدارة المدن
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddNew}>
                    إضافة مدينة
                </Button>
            </Box>

            {/* Filters */}
            <Box mb={3} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}>
                <TextField
                    size="small"
                    label="البحث"
                    variant="outlined"
                    value={filters.SearchTerm || ""}
                    onChange={(e) => setFilters({ ...filters, SearchTerm: e.target.value })}
                    placeholder="ابحث عن مدينة..."
                />
            </Box>

            {/* Table */}
            <CityTable />

            {/* Actions */}
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
                    تفاصيل (معلومات خاصة)
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
            <CityForm />
            <CityCard />
        </Container>
    );
};
