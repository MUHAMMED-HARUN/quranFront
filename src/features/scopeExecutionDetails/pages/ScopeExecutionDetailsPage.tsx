import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container, TextField } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { ScopeExecutionDetailTable } from "../components/ScopeExecutionDetailTable";
import { ScopeExecutionDetailForm } from "../components/ScopeExecutionDetailForm";
import { ScopeExecutionDetailCard } from "../components/ScopeExecutionDetailCard";
import { useScopeExecutionDetailStore } from "../store/scopeExecutionDetailStore";
import { StudentScopeExecutionsDetailsRegisterForm } from "../../studentScopeExecutionsDetailsRegisters/components/StudentScopeExecutionsDetailsRegisterForm";

export const ScopeExecutionDetailsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedDetailForEnroll, setSelectedDetailForEnroll] = useState<any>(null);
    const { clearSelection, setFilters, filters, setSelectedIds, openCard } = useScopeExecutionDetailStore();

    const [searchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState("");

    // Read the query parameter on mount and set the search filter
    useEffect(() => {
        const executionName = searchParams.get("executionName");
        if (executionName) {
            setSearchInput(executionName);
            setFilters({ search: executionName });
        }
    }, [searchParams, setFilters]);

    const handleSearch = () => {
        setFilters({ search: searchInput });
    };

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
        setSelectedIds([item.Id || item.ID]);
        openCard();
    };

    const handleOpenEnrollForm = (item: any) => {
        setSelectedDetailForEnroll(item);
        setIsEnrollFormOpen(true);
    };

    const handleCloseEnrollForm = () => {
        setSelectedDetailForEnroll(null);
        setIsEnrollFormOpen(false);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">إدارة تفاصيل تنفيذ النطاقات</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm()}
                    size="large"
                    sx={{ borderRadius: 2 }}
                >
                    إضافة تفاصيل جديدة
                </Button>
            </Box>

            {/* Filters Section */}
            <Box display="flex" gap={2} mb={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1}>
                <TextField
                    label="بحث باسم التنفيذ"
                    variant="outlined"
                    size="small"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    sx={{ minWidth: 300 }}
                />
                <Button variant="outlined" onClick={handleSearch}>بحث</Button>
            </Box>

            <ScopeExecutionDetailTable
                onOpenForm={handleOpenForm}
                onOpenView={handleOpenView}
                onEnrollStudent={handleOpenEnrollForm}
            />

            {isFormOpen && (
                <ScopeExecutionDetailForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    selectedItem={selectedItem}
                />
            )}

            {isEnrollFormOpen && (
                <StudentScopeExecutionsDetailsRegisterForm
                    isOpen={isEnrollFormOpen}
                    onClose={handleCloseEnrollForm}
                    scopeExecutionDetail={selectedDetailForEnroll}
                />
            )}
            
            <ScopeExecutionDetailCard />
        </Container>
    );
};
