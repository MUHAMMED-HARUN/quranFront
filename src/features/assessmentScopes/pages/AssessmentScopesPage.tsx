import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { AssessmentScopeTable } from "../components/AssessmentScopeTable";
import { AssessmentScopeForm } from "../components/AssessmentScopeForm";
import { useAssessmentScopeStore } from "../store/assessmentScopeStore";

export const AssessmentScopesPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { selectedIds, clearSelection } = useAssessmentScopeStore();

    const handleOpenForm = (item?: any) => {
        setSelectedItem(item || null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setSelectedItem(null);
        setIsFormOpen(false);
        clearSelection();
    };

    const handleOpenView = (item: any) => {
        // We can create a simple read-only view or card mode here as required by the pattern
        window.alert("تفاصيل: " + item.Name);
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">إدارة نطاقات التقييم</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm()}
                >
                    إضافة نطاق جديد
                </Button>
            </Box>

            <AssessmentScopeTable
                onOpenForm={handleOpenForm}
                onOpenView={handleOpenView}
            />

            {isFormOpen && (
                <AssessmentScopeForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    selectedItem={selectedItem}
                />
            )}
        </Box>
    );
};
