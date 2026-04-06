import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useProgressDecisionsQuery, useDeleteProgressDecisionMutation } from '../hooks/useProgressDecisions';
import { ProgressDecisionTable } from '../components/ProgressDecisionTable';
import { ProgressDecisionForm } from '../components/ProgressDecisionForm';
import { ProgressDecisionDto } from '../types/progressDecision.types';

export const ProgressDecisionsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDecision, setSelectedDecision] = useState<ProgressDecisionDto | null>(null);

    const { data: result, isLoading } = useProgressDecisionsQuery();
    const deleteMutation = useDeleteProgressDecisionMutation();

    const handleEdit = (decision: ProgressDecisionDto) => {
        setSelectedDecision(decision);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا القرار؟ (قد يؤثر على سجلات الطالب التراكمية)')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedDecision(null);
    };

    const decisions = result?.Value || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">قرارات التقييم (Progress Decisions)</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedDecision(null);
                        setIsFormOpen(true);
                    }}
                >
                    تجاوز وإصدار قرار يدوي
                </Button>
            </Box>

            <ProgressDecisionTable
                decisions={decisions}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <ProgressDecisionForm
                        initialData={selectedDecision || undefined}
                        onSuccess={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
