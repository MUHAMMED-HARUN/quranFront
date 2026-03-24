import React, { useState } from 'react';
import { Box, Button, Typography, Container, TextField, Autocomplete, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { EnrollStudentInScopeExecutionTable, EnrollStudentInScopeExecutionForm, EnrollStudentInScopeExecutionCard } from "../components";
import { useEnrollStudentInScopeExecutionStore } from "../store/enrollStudentInScopeExecutionStore";
import { useSearchScopeExecutionsQuery } from "../../scopeExecutions/hooks";

export const EnrollStudentInScopeExecutionsPage = () => {
    const {
        openForm,
        closeForm,
        isFormOpen,
        isCardOpen,
        openCard,
        closeCard,
        setFilters,
        filters
    } = useEnrollStudentInScopeExecutionStore();

    const [executionSearch, setExecutionSearch] = useState("");
    const { data: executionRes, isFetching: isExecutionSearching } = useSearchScopeExecutionsQuery(executionSearch);
    const executionOptions = Array.isArray(executionRes) ? executionRes : ((executionRes as any)?.Value || (executionRes as any)?.value || (executionRes as any)?.Data || (executionRes as any)?.data || []);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleOpenView = (item: any) => {
        setSelectedItem(item);
        openCard();
    };

    const handleCloseCard = () => {
        setSelectedItem(null);
        closeCard();
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">إدارة تسجيل الطلاب في النطاقات</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => openForm()}
                    size="large"
                    sx={{ borderRadius: 2 }}
                >
                    إضافة تسجيل جديد
                </Button>
            </Box>

            <Box display="flex" gap={2} mb={3} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1} alignItems="center">
                <Autocomplete
                    options={executionOptions}
                    getOptionLabel={(option: any) => option.Name || option.name || ""}
                    isOptionEqualToValue={(option, value) => (option.Id || option.id || option.ID) === (value?.Id || value?.id || value?.ID || value)}
                    loading={isExecutionSearching}
                    onInputChange={(e, newInputValue) => setExecutionSearch(newInputValue)}
                    onChange={(e, newValue: any) => setFilters({ scopeExecutionId: newValue ? (newValue.Id || newValue.id || newValue.ID) : null })}
                    renderOption={(props, option: any) => (
                        <li {...props} key={option.Id || option.id || option.ID}>
                            <Typography variant="body1" fontWeight="bold">
                                {option.Name || option.name}
                            </Typography>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="اختر النطاق الدراسي لعرض الطلاب"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 350 }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {isExecutionSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />

                <TextField
                    label="بحث بالاسم أو الرقم الوطني"
                    variant="outlined"
                    size="small"
                    value={filters.search || ""}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    sx={{ minWidth: 250 }}
                />
            </Box>

            <EnrollStudentInScopeExecutionTable
                scopeExecutionId={filters.scopeExecutionId}
                onOpenView={handleOpenView}
            />

            {isFormOpen && (
                <EnrollStudentInScopeExecutionForm
                    isOpen={isFormOpen}
                    onClose={closeForm}
                    defaultScopeExecutionId={filters.scopeExecutionId}
                />
            )}

            <EnrollStudentInScopeExecutionCard
                isOpen={isCardOpen}
                onClose={handleCloseCard}
                item={selectedItem}
            />
        </Container>
    );
};
