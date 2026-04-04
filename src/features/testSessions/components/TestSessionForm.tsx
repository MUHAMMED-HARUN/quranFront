import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, TextField, Button, Grid, Box, MenuItem, Typography } from '@mui/material';
import { CreateTestSessionSchema, CreateTestSessionCommand, SessionStatus, TesterType } from '../types/testSession.types';
import { useCreateTestSessionMutation, useUpdateTestSessionMutation } from '../hooks/useTestSessions';

interface TestSessionFormProps {
    initialData?: CreateTestSessionCommand & { Id?: string };
    onSuccess?: () => void;
}

export const TestSessionForm: React.FC<TestSessionFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.Id;
    const { mutateAsync: createSession, isPending: isCreating } = useCreateTestSessionMutation();
    const { mutateAsync: updateSession, isPending: isUpdating } = useUpdateTestSessionMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateTestSessionCommand>({
        resolver: zodResolver(CreateTestSessionSchema),
        defaultValues: {
            TestNominationID: '',
            TesterType: TesterType.Committee,
            TesterID: '',
            ActualExamDate: '',
            SessionStatus: SessionStatus.Scheduled,
            Notes: '',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: CreateTestSessionCommand) => {
        try {
            if (isEdit && initialData?.Id) await updateSession({ ...data, Id: initialData.Id });
            else await createSession(data);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to submit session:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit, (err: any) => console.log(err))}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{isEdit ? 'تعديل الجلسة' : 'إنشاء جلسة اختبار'}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="TestNominationID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} fullWidth label="معرّف الترشيح" error={!!errors.TestNominationID} helperText={errors.TestNominationID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="TesterType"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="نوع المُختبر" error={!!errors.TesterType} helperText={errors.TesterType?.message}>
                               <MenuItem value={TesterType.Teacher}>معلم</MenuItem>
                               <MenuItem value={TesterType.Committee}>لجنة</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="TesterID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} fullWidth label="معرّف المُختبر" error={!!errors.TesterID} helperText={errors.TesterID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ActualExamDate"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth label="تاريخ الاختبار" error={!!errors.ActualExamDate} helperText={errors.ActualExamDate?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="SessionStatus"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="حالة الجلسة" error={!!errors.SessionStatus} helperText={errors.SessionStatus?.message}>
                               <MenuItem value={SessionStatus.Scheduled}>مُجدولة</MenuItem>
                               <MenuItem value={SessionStatus.InProgress}>قائمة الآن</MenuItem>
                               <MenuItem value={SessionStatus.Completed}>مكتملة</MenuItem>
                               <MenuItem value={SessionStatus.Cancelled}>ملغاة</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="Notes"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} multiline rows={3} fullWidth label="ملاحظات" error={!!errors.Notes} helperText={errors.Notes?.message} />
                        )}
                    />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" color="primary" disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) ? <CircularProgress size={24} /> : 'حفظ الجلسة'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
