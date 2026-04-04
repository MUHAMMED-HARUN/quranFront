import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, Autocomplete, TextField, Button, Grid, Box, MenuItem, Typography } from '@mui/material';
import { CreateTestNominationSchema, CreateTestNominationCommand, NominationStatus } from '../types/testNomination.types';
import { useCreateTestNominationMutation, useUpdateTestNominationMutation } from '../hooks/useTestNominations';

interface TestNominationFormProps {
    initialData?: CreateTestNominationCommand & { Id?: string };
    onSuccess?: () => void;
}

export const TestNominationForm: React.FC<TestNominationFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.Id;
    const { mutateAsync: createNomination, isPending: isCreating } = useCreateTestNominationMutation();
    const { mutateAsync: updateNomination, isPending: isUpdating } = useUpdateTestNominationMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateTestNominationCommand>({
        resolver: zodResolver(CreateTestNominationSchema),
        defaultValues: {
            StudentEnrollmentID: '',
            ScopeExecutionID: '',
            ScopeExecutionDetailID: '',
            NominationStatus: NominationStatus.Pending,
            NominatedByPersonID: '',
            SuggestedDate: '',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = async (data: CreateTestNominationCommand) => {
        try {
            if (isEdit && initialData?.Id) {
                await updateNomination({ ...data, Id: initialData.Id });
            } else {
                await createNomination(data);
            }
            onSuccess?.();
        } catch (error) {
            console.error('Failed to submit nomination:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit, (err: any) => console.log("Validation Errors:", err))}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{isEdit ? 'تعديل الترشيح' : 'ترشيح طالب لاختبار'}</Typography>
                </Grid>

                {/* Youtube-Style Autocomplete for StudentEnrollment... */}
                {/* Note: In a real implementation this would hook to a `useSearchStudentEnrollmentQuery` */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="StudentEnrollmentID"
                        control={control}
                        render={({ field }) => (
                           <TextField
                               {...field}
                               fullWidth
                               label="معرّف الطالب (مؤقت حتى يتوفر البحث الذكي)"
                               error={!!errors.StudentEnrollmentID}
                               helperText={errors.StudentEnrollmentID?.message}
                           />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionID"
                        control={control}
                        render={({ field }) => (
                           <TextField
                               {...field}
                               fullWidth
                               label="معرّف المنهج ScopeExecution"
                               error={!!errors.ScopeExecutionID}
                               helperText={errors.ScopeExecutionID?.message}
                           />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionDetailID"
                        control={control}
                        render={({ field }) => (
                           <TextField
                               {...field}
                               fullWidth
                               label="معرّف التفصيل ScopeExecutionDetail"
                               error={!!errors.ScopeExecutionDetailID}
                               helperText={errors.ScopeExecutionDetailID?.message}
                           />
                        )}
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="NominationStatus"
                        control={control}
                        render={({ field }) => (
                           <TextField
                               {...field}
                               select
                               fullWidth
                               label="حالة الترشيح"
                               error={!!errors.NominationStatus}
                               helperText={errors.NominationStatus?.message}
                           >
                               <MenuItem value={NominationStatus.Pending}>قيد الانتظار</MenuItem>
                               <MenuItem value={NominationStatus.Approved}>مُعتمد</MenuItem>
                               <MenuItem value={NominationStatus.Rejected}>مرفوض</MenuItem>
                               <MenuItem value={NominationStatus.Completed}>مكتمل</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={isCreating || isUpdating}
                    >
                        {(isCreating || isUpdating) ? <CircularProgress size={24} /> : 'حفظ الترشيح'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
