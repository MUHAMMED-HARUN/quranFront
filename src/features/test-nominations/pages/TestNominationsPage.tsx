import React, { useState } from 'react';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import { TestNominationsFilterForm } from '../components/TestNominationsFilterForm';
import { TestNominationsTable } from '../components/TestNominationsTable';
import { TestNominationsDtoFilter } from '../types/testNomination.types';
import { useTestNominationsFilteredQuery } from '../hooks';
import { SetSuggestedDateModal } from '../components/SetSuggestedDateModal';

export const TestNominationsPage = () => {
    const [filter, setFilter] = useState<TestNominationsDtoFilter>({});
    const [suggestedDateModalOpen, setSuggestedDateModalOpen] = useState(false);
    const [selectedNominationId, setSelectedNominationId] = useState<string | null>(null);

    // Pass the filter state to the query hook
    const { data: nominationsRes, isLoading, error } = useTestNominationsFilteredQuery(filter);

    // Extract actual list from TResult
    const nominations = (nominationsRes as any)?.Value || (nominationsRes as any)?.value || [];

    const handleSearch = (newFilter: TestNominationsDtoFilter) => {
        setFilter(newFilter);
    };

    const handleUpdate = (id: string) => {
        window.alert(`سيتم فتح نموذج التعديل للترشيح: ${id}`);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`هل أنت متأكد من حذف الترشيح ${id}؟`)) {
            // Delete mutation goes here
            console.log("Delete logic goes here", id);
        }
    };

    const handleMakeTest = (id: string) => {
        window.alert(`سيتم الانتقال إلى صفحة الاختبار للمرشح: ${id}`);
    };

    const handleSetSuggestedDate = (id: string) => {
        setSelectedNominationId(id);
        setSuggestedDateModalOpen(true);
    };

    const handleCloseSuggestedDateModal = () => {
        setSuggestedDateModalOpen(false);
        setSelectedNominationId(null);
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">صفحة ترشيحات الاختبار</Typography>
                <Button variant="contained" color="primary" onClick={() => window.alert('سيتم فتح نموذج إضافة ترشيح جديد')}>
                    إضافة ترشيح جديد
                </Button>
            </Box>

            <TestNominationsFilterForm onSearch={handleSearch} />

            {isLoading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">حدث خطأ أثناء جلب البيانات</Typography>
            ) : (
                <TestNominationsTable
                    data={nominations}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onMakeTest={handleMakeTest}
                    onSetSuggestedDate={handleSetSuggestedDate}
                />
            )}

            <SetSuggestedDateModal 
                open={suggestedDateModalOpen} 
                onClose={handleCloseSuggestedDateModal} 
                testNominationID={selectedNominationId} 
            />
        </Box>
    );
};

