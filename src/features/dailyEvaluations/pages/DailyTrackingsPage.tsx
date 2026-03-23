import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DailyTrackingTable } from "../components/DailyTrackingTable";
import { DailyTrackingForm } from "../components/DailyTrackingForm";
import { useDailyTrackingStore } from "../store/dailyTrackingStore";

export const DailyTrackingsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { clearSelection } = useDailyTrackingStore();

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
        window.alert("تفاصيل التقييم: " + item.Id);
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">التقييم اليومي</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm()}
                >
                    إضافة تقييم يومي
                </Button>
            </Box>

            <DailyTrackingTable
                onOpenForm={handleOpenForm}
                onOpenView={handleOpenView}
            />

            {isFormOpen && (
                <DailyTrackingForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    selectedItem={selectedItem}
                />
            )}
        </Box>
    );
};
