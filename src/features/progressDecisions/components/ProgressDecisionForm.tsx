import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, TextField, Button, Box, MenuItem, Typography, Grid } from '@mui/material';
import { CreateProgressDecisionSchema } from '../types/progressDecision.validators';
import { CreateProgressDecisionCommand, ProgressDecisionDto, DecisionType, DecisionAuthority } from '../types/progressDecision.types';
import { useCreateProgressDecisionMutation, useUpdateProgressDecisionMutation } from '../hooks/useProgressDecisions';

interface ProgressDecisionFormProps {
    initialData?: ProgressDecisionDto;
    onSuccess?: () => void;
}

export const ProgressDecisionForm: React.FC<ProgressDecisionFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.Id;
    const { mutateAsync: createDecision, isPending: isCreating } = useCreateProgressDecisionMutation();
    const { mutateAsync: updateDecision, isPending: isUpdating } = useUpdateProgressDecisionMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateProgressDecisionCommand>({
        resolver: zodResolver(CreateProgressDecisionSchema),
        defaultValues: {
            StudentEnrollmentID: '',
            ScopeExecutionID: '',
            ScopeExecutionDetailID: '',
            DecisionType: DecisionType.Pass,
            DecisionAuthority: DecisionAuthority.System,
            DecisionAuthorityId: '',
            DecisionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format suitable for backend DateOnly
            Notes: '',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: CreateProgressDecisionCommand) => {
        try {
            if (isEdit && initialData?.Id) await updateDecision({ id: initialData.Id, data: data as any });
            else await createDecision(data);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to submit Decision:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit, (err: any) => console.log(err))}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{isEdit ? 'تعديل القرار' : 'إصدار قرار يدوي'}</Typography>
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

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="DecisionType"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="نوع القرار" error={!!errors.DecisionType} helperText={errors.DecisionType?.message}>
                               <MenuItem value={DecisionType.Pass}>اجتياز (نجاح)</MenuItem>
                               <MenuItem value={DecisionType.ConditionalPass}>اجتياز مشروط</MenuItem>
                               <MenuItem value={DecisionType.Fail}>عدم اجتياز (رسوب)</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="DecisionAuthority"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="الجهة المصدرة للقرار" error={!!errors.DecisionAuthority} helperText={errors.DecisionAuthority?.message}>
                               <MenuItem value={DecisionAuthority.System}>النظام الآلي</MenuItem>
                               <MenuItem value={DecisionAuthority.Principal}>المدير المباشر (تجاوز)</MenuItem>
                               <MenuItem value={DecisionAuthority.Teacher}>المعلم</MenuItem>
                               <MenuItem value={DecisionAuthority.Committee}>اللجنة المقيمة</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="DecisionDate"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} type="date" InputLabelProps={{ shrink: true }} fullWidth label="تاريخ القرار" error={!!errors.DecisionDate} helperText={errors.DecisionDate?.message} />
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
                        {(isCreating || isUpdating) ? <CircularProgress size={24} /> : 'حفظ القرار'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
