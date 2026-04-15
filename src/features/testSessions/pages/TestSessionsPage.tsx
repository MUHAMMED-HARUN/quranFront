import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTestSessionsQuery, useDeleteTestSessionMutation } from '../hooks/useTestSessions';
import { TestSessionTable } from '../components/TestSessionTable';
import { TestSessionForm } from '../components/TestSessionForm';
import { TestSessionDto, CreateTestSessionCommand } from '../types/testSession.types';

export const TestSessionsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<TestSessionDto | null>(null);

    const { data: result, isLoading } = useTestSessionsQuery();
    const deleteMutation = useDeleteTestSessionMutation();

    const handleEdit = (session: TestSessionDto) => {
        const formData: CreateTestSessionCommand & { Id: string } = {
            Id: session.Id,
            TestNominationID: session.TestNominationID,
            TesterType: session.TesterType,
            TesterID: session.TesterID,
            ActualExamDate: session.ActualExamDate,
            SessionStatus: session.SessionStatus,
            Notes: session.Notes
        };
        setSelectedSession(formData as any);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedSession(null);
    };

    const sessions = result?.Value || [];

    return (
        <Box>
            <h1>dfsghgjbbz\xdxfadfdcv</h1>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">جلسات ومواعيد الاختبار</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedSession(null);
                        setIsFormOpen(true);
                    }}
                >
                    إضافة جلسة
                </Button>
            </Box>

            <TestSessionTable
                sessions={sessions}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <TestSessionForm
                        initialData={selectedSession as any}
                        onSuccess={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
