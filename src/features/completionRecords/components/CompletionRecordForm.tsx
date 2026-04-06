import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, TextField, Button, Box, MenuItem, Typography, Grid } from '@mui/material';
import { CreateCompletionRecordSchema } from '../types/completionRecord.validators';
import { CreateCompletionRecordCommand, CompletionRecordDto, EvaluationLevel } from '../types/completionRecord.types';
import { useCreateCompletionRecordMutation, useUpdateCompletionRecordMutation } from '../hooks/useCompletionRecords';

interface CompletionRecordFormProps {
    initialData?: CompletionRecordDto;
    onSuccess?: () => void;
}

export const CompletionRecordForm: React.FC<CompletionRecordFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.Id;
    const { mutateAsync: createRecord, isPending: isCreating } = useCreateCompletionRecordMutation();
    const { mutateAsync: updateRecord, isPending: isUpdating } = useUpdateCompletionRecordMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateCompletionRecordCommand>({
        resolver: zodResolver(CreateCompletionRecordSchema),
        defaultValues: {
            StudentEnrollmentID: '',
            ScopeExecutionID: '',
            ScopeExecutionDetailID: '',
            CompletionDate: new Date().toISOString().split('T')[0],
            EvaluationLevel: EvaluationLevel.Good,
            FinalScore: 0,
            Notes: '',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: CreateCompletionRecordCommand) => {
        try {
            if (isEdit && initialData?.Id) await updateRecord({ id: initialData.Id, data: data as any });
            else await createRecord(data);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to submit Completion Record:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit, (err: any) => console.log(err))}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{isEdit ? 'تعديل سجل الإتمام' : 'إصدار شهادة/سجل إتمام يدوي'}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 12 }}>
                    <Controller
                        name="StudentEnrollmentID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} value={field.value || ''} fullWidth label="معرّف تسجيل الطالب" error={!!errors.StudentEnrollmentID} helperText={errors.StudentEnrollmentID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} value={field.value || ''} fullWidth label="معرّف التنفيذ الأساسي" error={!!errors.ScopeExecutionID} helperText={errors.ScopeExecutionID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionDetailID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} value={field.value || ''} fullWidth label="معرّف الجزء التفصيلي (اختياري)" error={!!errors.ScopeExecutionDetailID} helperText={errors.ScopeExecutionDetailID?.message} />
                        )}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name="CompletionDate"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} type="date" InputLabelProps={{ shrink: true }} fullWidth label="تاريخ الإتمام" error={!!errors.CompletionDate} helperText={errors.CompletionDate?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name="EvaluationLevel"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="التقدير اللفظي" error={!!errors.EvaluationLevel} helperText={errors.EvaluationLevel?.message}>
                               <MenuItem value={EvaluationLevel.Excellent}>ممتاز</MenuItem>
                               <MenuItem value={EvaluationLevel.VeryGood}>جيد جداً</MenuItem>
                               <MenuItem value={EvaluationLevel.Good}>جيد</MenuItem>
                               <MenuItem value={EvaluationLevel.Acceptable}>مقبول</MenuItem>
                               <MenuItem value={EvaluationLevel.Weak}>ضعيف</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Controller
                        name="FinalScore"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} type="number" fullWidth label="الدرجة النهائية" error={!!errors.FinalScore} helperText={errors.FinalScore?.message} 
                           onChange={(e) => field.onChange(Number(e.target.value))} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="Notes"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} value={field.value || ''} multiline rows={3} fullWidth label="ملاحظات" error={!!errors.Notes} helperText={errors.Notes?.message} />
                        )}
                    />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) ? <CircularProgress size={24} /> : 'حفظ السجل'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
