import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTestResultDetailsQuery, useDeleteTestResultDetailMutation } from '../hooks/useTestResultDetails';
import { TestResultDetailTable } from '../components/TestResultDetailTable';
import { TestResultDetailForm } from '../components/TestResultDetailForm';
import { TestResultDetailDto, CreateTestResultDetailCommand } from '../types/testResultDetail.types';

export const TestResultDetailsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<TestResultDetailDto | null>(null);

    const { data: result, isLoading } = useTestResultDetailsQuery();
    const deleteMutation = useDeleteTestResultDetailMutation();

    const handleEdit = (resultRow: TestResultDetailDto) => {
        const formData: CreateTestResultDetailCommand & { Id: string } = {
            Id: resultRow.Id,
            TestSessionID: resultRow.TestSessionID,
            ScopeExecutionDetailID: resultRow.ScopeExecutionDetailID,
            Score: resultRow.Score,
            EvaluationLevel: resultRow.EvaluationLevel,
            Notes: resultRow.Notes
        };
        setSelectedResult(formData as any);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف نتيجة الاختبار هذه؟')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedResult(null);
    };

    const results = result?.Value || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">نتائج الاختبارات</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedResult(null);
                        setIsFormOpen(true);
                    }}
                >
                    تسجيل نتيجة
                </Button>
            </Box>

            <TestResultDetailTable
                results={results}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <TestResultDetailForm
                        initialData={selectedResult as any}
                        onSuccess={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
