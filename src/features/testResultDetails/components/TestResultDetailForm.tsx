import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, TextField, Button, Grid, Box, Typography, MenuItem } from '@mui/material';
import { CreateTestResultDetailSchema, CreateTestResultDetailCommand, EvaluationLevel } from '../types/testResultDetail.types';
import { useCreateTestResultDetailMutation, useUpdateTestResultDetailMutation } from '../hooks/useTestResultDetails';

interface TestResultDetailFormProps {
    initialData?: CreateTestResultDetailCommand & { Id?: string };
    onSuccess?: () => void;
}

export const TestResultDetailForm: React.FC<TestResultDetailFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.Id;
    const { mutateAsync: createResult, isPending: isCreating } = useCreateTestResultDetailMutation();
    const { mutateAsync: updateResult, isPending: isUpdating } = useUpdateTestResultDetailMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateTestResultDetailCommand>({
        resolver: zodResolver(CreateTestResultDetailSchema),
        defaultValues: {
            TestSessionID: '',
            ScopeExecutionDetailID: '',
            Score: undefined,
            EvaluationLevel: undefined,
            Notes: '',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: CreateTestResultDetailCommand) => {
        try {
            if (isEdit && initialData?.Id) await updateResult({ ...data, Id: initialData.Id });
            else await createResult(data);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to submit result:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit, (err: any) => console.log(err))}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{isEdit ? 'تعديل النتيجة' : 'تسجيل نتيجة اختبار'}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="TestSessionID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} fullWidth label="معرّف الجلسة" error={!!errors.TestSessionID} helperText={errors.TestSessionID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionDetailID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} fullWidth label="معرّف عنصر المنهج (المُمتحن به)" error={!!errors.ScopeExecutionDetailID} helperText={errors.ScopeExecutionDetailID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="Score"
                        control={control}
                        render={({ field }) => (
                           <TextField 
                             {...field} 
                             type="number" 
                             fullWidth 
                             label="الدرجة الرقمية" 
                             error={!!errors.Score} 
                             helperText={errors.Score?.message} 
                             onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                           />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="EvaluationLevel"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="مستوى التقييم" error={!!errors.EvaluationLevel} helperText={errors.EvaluationLevel?.message}>
                               <MenuItem value="">بدون مستوى</MenuItem>
                               <MenuItem value={EvaluationLevel.Excellent}>ممتاز</MenuItem>
                               <MenuItem value={EvaluationLevel.VeryGood}>جيد جداً</MenuItem>
                               <MenuItem value={EvaluationLevel.Good}>جيد</MenuItem>
                               <MenuItem value={EvaluationLevel.Weak}>ضعيف</MenuItem>
                               <MenuItem value={EvaluationLevel.VeryWeak}>ضعيف جداً</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="Notes"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} multiline rows={3} fullWidth label="ملاحظات المُقيّم" error={!!errors.Notes} helperText={errors.Notes?.message} />
                        )}
                    />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) ? <CircularProgress size={24} /> : 'حفظ النتيجة'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
