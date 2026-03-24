import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, CircularProgress, Autocomplete, TextField, Typography, MenuItem
} from "@mui/material";

import { useDailyTrackingStore } from "../store/dailyTrackingStore";
import {
    useCreateDailyTrackingMutation,
    useUpdateDailyTrackingMutation,
    useDailyTrackingsQuery
} from "../hooks/useDailyTrackings";
import { DailyTrackingSchema, CreateDailyTrackingCommand } from "../types/dailyTracking.types";

import { useSearchMattersQuery } from "../../matters/hooks/useSearchMattersQuery";
import { useSearchStudentsByNationalNumberQuery } from "../../students/hooks/useSearchStudentsByNationalNumberQuery";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks/useScopeUnitTypesQuery";

export const DailyTrackingForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useDailyTrackingStore();
    const { data: listResponse } = useDailyTrackingsQuery();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;
    const trackings = Array.isArray(listResponse) ? listResponse : ((listResponse as any)?.Value || []);
    const selectedItem = isEditing ? trackings.find((x: any) => (x.Id || x.ID) === editId) : null;

    const createMutation = useCreateDailyTrackingMutation();
    const updateMutation = useUpdateDailyTrackingMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(DailyTrackingSchema),
        defaultValues: {
            MatterID: "",
            StudentID: "",
            CurrentUnit: 0,
            ScopeUnitTypeID: "",
            TotalScopeUnit: 0
        },
    });

    // Autocomplete States
    const [matterSearch, setMatterSearch] = useState("");
    const { data: mattersRes, isFetching: isMatterSearching } = useSearchMattersQuery(matterSearch);
    const matterOptions = Array.isArray(mattersRes) ? mattersRes : ((mattersRes as any)?.Value || []);

    const [studentSearch, setStudentSearch] = useState("");
    const { data: studentsRes, isFetching: isStudentSearching } = useSearchStudentsByNationalNumberQuery(studentSearch);
    const studentOptions = Array.isArray(studentsRes) ? studentsRes : ((studentsRes as any)?.Value || []);

    const { data: scopeUnitsRes } = useScopeUnitTypesQuery();
    const scopeUnitsOptions = Array.isArray(scopeUnitsRes) ? scopeUnitsRes : ((scopeUnitsRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                MatterID: selectedItem.MatterID || "",
                StudentID: selectedItem.StudentID || "",
                CurrentUnit: selectedItem.CurrentUnit || 0,
                ScopeUnitTypeID: selectedItem.ScopeUnitTypeID || "",
                TotalScopeUnit: selectedItem.TotalScopeUnit || 0
            });
        } else if (!isEditing) {
            reset({
                MatterID: "",
                StudentID: "",
                CurrentUnit: 0,
                ScopeUnitTypeID: "",
                TotalScopeUnit: 0
            });
            setMatterSearch("");
            setStudentSearch("");
        }
    }, [isEditing, selectedItem, reset, isFormOpen]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        if (isEditing) {
            updateMutation.mutate({ id: editId!, data }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(data, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل المتابعة" : "إضافة متابعة جديدة"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        {/* Matter Autocomplete */}
                        <Controller
                            name="MatterID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={matterOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID) === (value?.Id || value?.ID || value)}
                                    loading={isMatterSearching}
                                    onInputChange={(e, newInputValue, reason) => {
                                        if (reason === "input" || reason === "clear") {
                                            setMatterSearch(newInputValue);
                                        }
                                    }}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID) : "")}
                                    value={matterOptions.find((opt: any) => (opt.Id || opt.ID) === field.value) || null}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {option.Name}
                                            </Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="بحث عن المادة (الاسم)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isMatterSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* Student Autocomplete */}
                        <Controller
                            name="StudentID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={studentOptions}
                                    getOptionLabel={(option: any) => `${option.NationalNumber} - ${option.FullName || option.Name || ""}`}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.PersonID) === (value?.Id || value?.ID || value?.PersonID || value)}
                                    loading={isStudentSearching}
                                    onInputChange={(e, newInputValue, reason) => {
                                        if (reason === "input" || reason === "clear") {
                                            setStudentSearch(newInputValue);
                                        }
                                    }}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.PersonID) : "")}
                                    value={studentOptions.find((opt: any) => (opt.Id || opt.ID || opt.PersonID) === field.value) || null}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.PersonID}>
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {option.NationalNumber}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {option.FullName || option.Name}
                                                </Typography>
                                            </Box>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="بحث عن الطالب (رقم الهوية)"
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

                        {/* Scope Unit Type Dropdown */}
                        <Controller
                            name="ScopeUnitTypeID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="نوع الوحدة"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                >
                                    <MenuItem value="">اختر نوع الوحدة</MenuItem>
                                    {scopeUnitsOptions.map((su: any) => (
                                        <MenuItem key={su.Id || su.ID} value={su.Id || su.ID}>
                                            {su.Name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="CurrentUnit"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    label="الوحدة الحالية"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="TotalScopeUnit"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    label="إجمالي الوحدات المستهدفة"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
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
