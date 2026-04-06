import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircularProgress, TextField, Button, Box, MenuItem, Typography, Checkbox, FormControlLabel, Grid, Autocomplete } from '@mui/material';
import { CreateProgramRuleSchema } from '../types/programRule.validators';
import { CreateProgramRuleCommand, ProgramRuleDto, ProgramRuleType, ComparisonType } from '../types/programRule.types';
import { useCreateProgramRuleMutation, useUpdateProgramRuleMutation } from '../hooks/useProgramRules';
import { useSearchScopeExecutionsQuery } from '../../scopeExecutions/hooks/useScopeExecutions';
import { SearchScopeExecutionDto } from '../../scopeExecutions/services/scopeExecutionService';

interface ProgramRuleFormProps {
    initialData?: ProgramRuleDto;
    onSuccess?: () => void;
}

export const ProgramRuleForm: React.FC<ProgramRuleFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.Id;
    const { mutateAsync: createRule, isPending: isCreating } = useCreateProgramRuleMutation();
    const { mutateAsync: updateRule, isPending: isUpdating } = useUpdateProgramRuleMutation();

    const [searchTerm, setSearchTerm] = React.useState("");
    const [debouncedTerm, setDebouncedTerm] = React.useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: searchResults, isFetching } = useSearchScopeExecutionsQuery(debouncedTerm);
    const options: SearchScopeExecutionDto[] = searchResults?.Value || [];

    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateProgramRuleCommand>({
        resolver: zodResolver(CreateProgramRuleSchema),
        defaultValues: {
            ScopeExecutionID: '',
            ScopeExecutionDetailID: '',
            RuleType: ProgramRuleType.SingleSubject,
            ComparisonType: ComparisonType.GreaterThanOrEqual,
            RequiredValue: 0,
            IsMandatory: true,
            Notes: '',
            ...initialData
        }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: CreateProgramRuleCommand) => {
        try {
            if (isEdit && initialData?.Id) await updateRule({ id: initialData.Id, data: data as any });
            else await createRule(data);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to submit ProgramRule:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit, (err: any) => console.log(err))}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">{isEdit ? 'تعديل القاعدة' : 'إنشاء قاعدة جديدة'}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionID"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={options}
                                getOptionLabel={(option) => option.Name || ''}
                                loading={isFetching}
                                onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
                                onChange={(_, newValue) => field.onChange(newValue ? newValue.Id : '')}
                                value={options.find(opt => opt.Id === field.value) || (field.value ? { Id: field.value, Name: field.value } : null)}
                                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="بحث عن التنفيذ الأساسي (Autocomplete)" 
                                        error={!!errors.ScopeExecutionID} 
                                        helperText={errors.ScopeExecutionID?.message} 
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.Id}>
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">{option.Name}</Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', opacity: 0.6 }}>{option.Id}</Typography>
                                        </Box>
                                    </li>
                                )}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ScopeExecutionDetailID"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} value={field.value || ''} fullWidth label="معرّف تفصيل التنفيذ (اختياري)" error={!!errors.ScopeExecutionDetailID} helperText={errors.ScopeExecutionDetailID?.message} />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="RuleType"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="نوع القاعدة" error={!!errors.RuleType} helperText={errors.RuleType?.message}>
                               <MenuItem value={ProgramRuleType.SingleSubject}>مادة واحدة</MenuItem>
                               <MenuItem value={ProgramRuleType.TotalScore}>المجموع الكلي</MenuItem>
                               <MenuItem value={ProgramRuleType.AverageScore}>المعدل</MenuItem>
                               <MenuItem value={ProgramRuleType.AttendancePercentage}>نسبة حضور</MenuItem>
                               <MenuItem value={ProgramRuleType.MaxAbsenceDays}>أقصى حد للغياب</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="ComparisonType"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} select fullWidth label="نوع المقارنة" error={!!errors.ComparisonType} helperText={errors.ComparisonType?.message}>
                               <MenuItem value={ComparisonType.GreaterThanOrEqual}>أكبر من أو يساوي {">="}</MenuItem>
                               <MenuItem value={ComparisonType.Equal}>يساوي {"="}</MenuItem>
                               <MenuItem value={ComparisonType.LessThanOrEqual}>أصغر من أو يساوي {"<="}</MenuItem>
                               <MenuItem value={ComparisonType.GreaterThan}>أكبر من {">"}</MenuItem>
                               <MenuItem value={ComparisonType.LessThan}>أصغر من {"<"}</MenuItem>
                           </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name="RequiredValue"
                        control={control}
                        render={({ field }) => (
                           <TextField {...field} type="number" fullWidth label="القيمة المطلوبة للنجاح" error={!!errors.RequiredValue} helperText={errors.RequiredValue?.message} 
                             onChange={(e) => field.onChange(Number(e.target.value))}
                           />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} display="flex" alignItems="center">
                    <Controller
                        name="IsMandatory"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                                label="قاعدة إلزامية للنجاح؟"
                            />
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
                        {(isCreating || isUpdating) ? <CircularProgress size={24} /> : 'حفظ القاعدة'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
