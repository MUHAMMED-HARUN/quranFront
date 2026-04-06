import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useProgramRulesQuery, useDeleteProgramRuleMutation } from '../hooks/useProgramRules';
import { ProgramRuleTable } from '../components/ProgramRuleTable';
import { ProgramRuleForm } from '../components/ProgramRuleForm';
import { ProgramRuleDto } from '../types/programRule.types';

export const ProgramRulesPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<ProgramRuleDto | null>(null);

    const { data: result, isLoading } = useProgramRulesQuery();
    const deleteMutation = useDeleteProgramRuleMutation();

    const handleEdit = (rule: ProgramRuleDto) => {
        setSelectedRule(rule);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف القاعدة؟ سيؤثر هذا على تحديد نجاح الطلاب مستقبلاً.')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setSelectedRule(null);
    };

    const rules = result?.Value || [];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold">قواعد وشروط التقييم</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedRule(null);
                        setIsFormOpen(true);
                    }}
                >
                    إضافة قاعدة جديدة
                </Button>
            </Box>

            <ProgramRuleTable
                rules={rules}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <ProgramRuleForm
                        initialData={selectedRule || undefined}
                        onSuccess={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};
