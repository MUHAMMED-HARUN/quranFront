import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { StudentAssessmentTable } from "../components/StudentAssessmentTable";
import { StudentAssessmentForm } from "../components/StudentAssessmentForm";
import { useStudentAssessmentStore } from "../store/studentAssessmentStore";

export const StudentAssessmentsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { clearSelection } = useStudentAssessmentStore();

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
        window.alert("تفاصيل التقييم:\nالدرجة: " + item.Score + "\nملاحظات: " + (item.Notes || "-"));
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">إدارة تقييمات الطلاب</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm()}
                >
                    إضافة تقييم جديد
                </Button>
            </Box>

            <StudentAssessmentTable
                onOpenForm={handleOpenForm}
                onOpenView={handleOpenView}
            />

            {isFormOpen && (
                <StudentAssessmentForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    selectedItem={selectedItem}
                />
            )}
        </Box>
    );
};
