import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCompletionRecordsQuery, useDeleteCompletionRecordMutation } from '../hooks/useCompletionRecords';
import { CompletionRecordTable } from '../components/CompletionRecordTable';
import { CompletionRecordForm } from '../components/CompletionRecordForm';
import { CompletionRecordDto } from '../types/completionRecord.types';

export const CompletionRecordsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<CompletionRecordDto | null>(null);

    const { data: result, isLoading } = useCompletionRecordsQuery();
    const deleteMutation = useDeleteCompletionRecordMutation();

    const handleEdit = (record: CompletionRecordDto) => {
        setSelectedRecord(record);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('الإلغاء سيسحب أهلية الطالب من الانتقال للمستوى اللاحق، هل أنت متأكد؟')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedRecord(null);
    };

    const records = result?.Value || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">سجلات الإتمام والشهادات (Completion Records)</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedRecord(null);
                        setIsFormOpen(true);
                    }}
                >
                    إصدار إتمام مرجعي
                </Button>
            </Box>

            <CompletionRecordTable
                records={records}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <CompletionRecordForm
                        initialData={selectedRecord || undefined}
                        onSuccess={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
