import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
    useEnrollStudentInScopeExecutionDetailsQuery,
    useCreateEnrollStudentInScopeExecutionDetailMutation,
    useUpdateEnrollStudentInScopeExecutionDetailMutation,
    useDeleteEnrollStudentInScopeExecutionDetailMutation
} from "../hooks/useEnrollStudentInScopeExecutionDetails";
import { useEnrollStudentInScopeExecutionDetailStore } from "../store/enrollStudentInScopeExecutionDetailStore";
import { EnrollStudentInScopeExecutionDetailTable } from "../components/EnrollStudentInScopeExecutionDetailTable";
import { EnrollStudentInScopeExecutionDetailForm } from "../components/EnrollStudentInScopeExecutionDetailForm";
import { EnrollStudentInScopeExecutionDetail } from "../types/enrollStudentInScopeExecutionDetail.types";

const EnrollStudentInScopeExecutionDetailsPage: React.FC = () => {
    const {
        searchTerm,
        setSearchTerm,
        setFormOpen,
        setSelectedItem,
        setIsEditing
    } = useEnrollStudentInScopeExecutionDetailStore();

    const { data: response, isLoading } = useEnrollStudentInScopeExecutionDetailsQuery();
    const createMutation = useCreateEnrollStudentInScopeExecutionDetailMutation();
    const updateMutation = useUpdateEnrollStudentInScopeExecutionDetailMutation();
    const deleteMutation = useDeleteEnrollStudentInScopeExecutionDetailMutation();

    // The backend returns { IsSuccess, Value: data } due to MediatR wrapper standard
    const items = response?.Value || [];

    const handleAddClick = () => {
        setSelectedItem(null);
        setIsEditing(false);
        setFormOpen(true);
    };

    const handleEditClick = (item: EnrollStudentInScopeExecutionDetail) => {
        setSelectedItem(item);
        setIsEditing(true);
        setFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا التسجيل؟")) {
            deleteMutation.mutate(id);
        }
    };

    const handleFormSubmit = async (data: any) => {
        try {
            if (data.Id) {
                await updateMutation.mutateAsync(data);
            } else {
                await createMutation.mutateAsync(data);
            }
            setFormOpen(false);
        } catch (error) {
            console.error("Failed to save enrollment:", error);
            // Optionally, we could show a snackbar here
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                    التسجيل في النطاقات التفصيلية
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    تسجيل طالب جديد
                </Button>
            </Box>

            <EnrollStudentInScopeExecutionDetailTable
                data={items}
                isLoading={isLoading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <EnrollStudentInScopeExecutionDetailForm
                onSubmit={handleFormSubmit}
                isSaving={createMutation.isPending || updateMutation.isPending}
            />
        </Container>
    );
};

export default EnrollStudentInScopeExecutionDetailsPage;
