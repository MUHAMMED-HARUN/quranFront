import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTestNominationsQuery, useDeleteTestNominationMutation } from '../hooks/useTestNominations';
import { TestNominationTable } from '../components/TestNominationTable';
import { TestNominationForm } from '../components/TestNominationForm';
import { TestNominationDto, CreateTestNominationCommand } from '../types/testNomination.types';

export const TestNominationsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedNomination, setSelectedNomination] = useState<TestNominationDto | null>(null);

    const { data: result, isLoading } = useTestNominationsQuery();
    const deleteMutation = useDeleteTestNominationMutation();

    // Map `TestNominationDto` back to `CreateTestNominationCommand` when editing
    const handleEdit = (nomination: TestNominationDto) => {
        const formData: CreateTestNominationCommand & { Id: string } = {
            Id: nomination.Id,
            StudentEnrollmentID: nomination.StudentEnrollmentID,
            ScopeExecutionID: nomination.ScopeExecutionID,
            ScopeExecutionDetailID: nomination.ScopeExecutionDetailID,
            NominationStatus: nomination.NominationStatus,
            NominatedByPersonID: nomination.NominatedByPersonID,
            SuggestedDate: nomination.SuggestedDate
        };
        setSelectedNomination(formData as any);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الترشيح؟')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedNomination(null);
    };

    const nominations = result?.Value || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">ترشيحات الاختبارات</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedNomination(null);
                        setIsFormOpen(true);
                    }}
                >
                    ترشيح جديد
                </Button>
            </Box>

            <TestNominationTable
                nominations={nominations}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <TestNominationForm
                        initialData={selectedNomination as any}
                        onSuccess={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
