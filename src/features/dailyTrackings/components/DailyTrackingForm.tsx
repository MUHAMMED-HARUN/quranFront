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
    MenuItem,
} from "@mui/material";

import { useDailyTrackingStore } from "../store/dailyTrackingStore";
import {
    useCreateDailyTrackingMutation,
    useUpdateDailyTrackingMutation,
} from "../hooks/useDailyTrackings";
import { DailyTrackingSchema } from "../types/dailyTracking.types";

import { useSearchSubjectsByNameQuery } from "../../subjects/hooks";
import { useSearchStudentsByNationalNumQuery } from "../../students/hooks";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks";

export const DailyTrackingForm = ({ isOpen, onClose, selectedItem }: { isOpen: boolean, onClose: () => void, selectedItem?: any }) => {
    const isEditing = !!selectedItem;
    const createMutation = useCreateDailyTrackingMutation();
    const updateMutation = useUpdateDailyTrackingMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(DailyTrackingSchema),
        defaultValues: {
            Id: "",
            MatterID: "",
            StudentID: "",
            CurrentUnit: 0,
            ScopeUnitTypeID: "",
            TotalScopeUnit: 0
        },
    });

    const [subjectSearch, setSubjectSearch] = useState("");
    const [studentSearch, setStudentSearch] = useState("");

    const { data: subjectRes, isFetching: isSubjectSearching } = useSearchSubjectsByNameQuery(subjectSearch || "");
    const { data: studentRes, isFetching: isStudentSearching } = useSearchStudentsByNationalNumQuery(studentSearch || "");
    const { data: scopeUnitTypesRes, isFetching: isScopeUnitsLoading } = useScopeUnitTypesQuery();

    const subjectOptions = Array.isArray(subjectRes) ? subjectRes : ((subjectRes as any)?.Value || []);
    const studentOptions = Array.isArray(studentRes) ? studentRes : ((studentRes as any)?.Value || []);
    const scopeUnitOptions = Array.isArray(scopeUnitTypesRes) ? scopeUnitTypesRes : ((scopeUnitTypesRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                Id: selectedItem.Id || selectedItem.ID,
                MatterID: selectedItem.MatterID || "",
                StudentID: selectedItem.StudentID || "",
                CurrentUnit: selectedItem.CurrentUnit || 0,
                ScopeUnitTypeID: selectedItem.ScopeUnitTypeID || "",
                TotalScopeUnit: selectedItem.TotalScopeUnit || 0
            });
        } else if (!isEditing) {
            reset({
                Id: "",
                MatterID: "",
                StudentID: "",
                CurrentUnit: 0,
                ScopeUnitTypeID: "",
                TotalScopeUnit: 0
            });
            setSubjectSearch("");
            setStudentSearch("");
        }
    }, [isEditing, selectedItem, reset]);

    const handleClose = () => {
        onClose();
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
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل تقييم اليومي" : "إضافة تقييم يومي جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        {/* Subject Autocomplete */}
                        <Controller
                            name="MatterID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={subjectOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isSubjectSearching}
                                    onInputChange={(e, newInputValue) => setSubjectSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.ProgramID || newValue.ClassID || newValue.GroupID || newValue.SubjectID || newValue.StudentID || "") : "")}
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
                                            label="ابحث عن المقرر"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isSubjectSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* Student Autocomplete (search by National ID) */}
                        <Controller
                            name="StudentID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={studentOptions}
                                    getOptionLabel={(option: any) => option.NationalNumber || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isStudentSearching}
                                    onInputChange={(e, newInputValue) => setStudentSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.ProgramID || newValue.ClassID || newValue.GroupID || newValue.SubjectID || newValue.StudentID || "") : "")}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID}>
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="body1" fontWeight="bold">
                                                    {option.NationalNumber}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.FirstName} {option.FatherName} {option.LastName}
                                                </Typography>
                                            </Box>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="ابحث عن الطالب (رقم الهوية)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isStudentSearching ? <CircularProgress color="inherit" size={20} /> : null}
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
                            name="ScopeUnitTypeID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    select
                                    {...field}
                                    label="وحدة النطاق"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                    disabled={isScopeUnitsLoading}
                                >
                                    {scopeUnitOptions.map((opt: any) => (
                                        <MenuItem key={opt.ID || opt.Id} value={opt.ID || opt.Id}>
                                            {opt.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Box display="flex" gap={2}>
                            <Controller
                                name="CurrentUnit"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="الوحدة الحالية"
                                        type="number"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />

                            <Controller
                                name="TotalScopeUnit"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="إجمالي وحدات النطاق"
                                        type="number"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />
                        </Box>

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
