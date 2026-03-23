import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Autocomplete,
    TextField,
    Typography,
} from "@mui/material";
import { useScopeExecutionStore } from "../store/scopeExecutionStore";
import {
    useCreateScopeExecutionMutation,
    useUpdateScopeExecutionMutation,
    useScopeExecutionsQuery
} from "../hooks/useScopeExecutions";
import { ScopeExecutionSchema } from "../types/scopeExecution.types";
import { useSearchAssessmentScopesQuery } from "../../assessmentScopes/hooks";

export const ScopeExecutionForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useScopeExecutionStore();
    const { data: listResponse } = useScopeExecutionsQuery();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;
    const executions = Array.isArray(listResponse) ? listResponse : ((listResponse as any)?.Value || []);
    const selectedItem = isEditing ? executions.find((x: any) => (x.Id || x.ID) === editId) : null;

    const createMutation = useCreateScopeExecutionMutation();
    const updateMutation = useUpdateScopeExecutionMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(ScopeExecutionSchema),
        defaultValues: {
            Id: "",
            Name: "",
            AssessmentScopeID: "",
            Description: ""
        },
    });

    const [scopeSearch, setScopeSearch] = useState("");
    const { data: scopeRes, isFetching: isScopeSearching } = useSearchAssessmentScopesQuery(scopeSearch);
    const scopeOptions = Array.isArray(scopeRes) ? scopeRes : ((scopeRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                Id: selectedItem.Id || selectedItem.ID,
                Name: selectedItem.Name || "",
                AssessmentScopeID: selectedItem.AssessmentScopeID || "",
                Description: selectedItem.Description || ""
            });
        } else if (!isEditing) {
            reset({
                Id: "",
                Name: "",
                AssessmentScopeID: "",
                Description: ""
            });
            setScopeSearch("");
        }
    }, [isEditing, selectedItem, reset, isFormOpen]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        if (isEditing) {
            updateMutation.mutate({ id: data.Id, data }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(data, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل تنفيذ النطاق" : "تنفيذ نطاق جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        <Controller
                            name="Name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="اسم التنفيذ"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />

                        {/* Assessment Scope Autocomplete */}
                        <Controller
                            name="AssessmentScopeID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={scopeOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isScopeSearching}
                                    onInputChange={(e, newInputValue) => setScopeSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.ProgramID || newValue.ClassID || newValue.GroupID || newValue.SubjectID || newValue.StudentID || "") : "")}
                                    value={scopeOptions.find((opt: any) => (opt.Id || opt.ID || opt.ProgramID || opt.ClassID || opt.GroupID || opt.SubjectID || opt.StudentID) === field.value) || null}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {option.Name}
                                            </Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ابحث عن النطاق (الاسم)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isScopeSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Controller
                            name="Description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="وصف"
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                            )}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
