import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem,
    Autocomplete,
    Typography,
    CircularProgress
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "../../students/services/studentService";
import { scopeExecutionDetailService } from "../../scopeExecutionDetails/services/scopeExecutionDetailService";
import {
    EnrollmentStatus,
    EnrollStudentInScopeExecutionDetailSchema,
    CreateEnrollStudentInScopeExecutionDetailCommand
} from "../types/enrollStudentInScopeExecutionDetail.types";
import { useEnrollStudentInScopeExecutionDetailStore } from "../store/enrollStudentInScopeExecutionDetailStore";

interface EnrollStudentInScopeExecutionDetailFormProps {
    onSubmit: (data: any) => void;
    isSaving: boolean;
}

export const EnrollStudentInScopeExecutionDetailForm: React.FC<EnrollStudentInScopeExecutionDetailFormProps> = ({
    onSubmit,
    isSaving,
}) => {
    const { isFormOpen, setFormOpen, selectedItem, isEditing, setIsEditing, setSelectedItem } = useEnrollStudentInScopeExecutionDetailStore();

    const {
        control,
        handleSubmit,
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(EnrollStudentInScopeExecutionDetailSchema),
        defaultValues: {
            Id: "",
            ScopeExecutionDetailID: "",
            StudentID: "",
            EnrollmentDate: new Date().toISOString().split('T')[0],
            Status: EnrollmentStatus.Enrolled,
            StartDate: null as string | null,
            CompletionDate: null as string | null,
            Notes: "",
        },
    });

    const [studentSearch, setStudentSearch] = useState("");
    const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("");
    const [scopeSearch, setScopeSearch] = useState("");
    const [debouncedScopeSearch, setDebouncedScopeSearch] = useState("");

    // Debounce student search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedStudentSearch(studentSearch), 500);
        return () => clearTimeout(handler);
    }, [studentSearch]);

    const { data: studentsRes, isFetching: isStudentSearching } = useQuery({
        queryKey: ["searchStudents", debouncedStudentSearch],
        queryFn: () => studentService.searchByNationalNumber(debouncedStudentSearch),
        enabled: debouncedStudentSearch.length >= 2,
    });
    const studentOptions = Array.isArray(studentsRes) ? studentsRes : ((studentsRes as any)?.Value || (studentsRes as any)?.value || (studentsRes as any)?.Data || []);

    // Debounce scope detail search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedScopeSearch(scopeSearch), 500);
        return () => clearTimeout(handler);
    }, [scopeSearch]);

    const { data: scopesRes, isFetching: isScopeSearching } = useQuery({
        queryKey: ["searchScopeDetails", debouncedScopeSearch],
        queryFn: () => scopeExecutionDetailService.searchByScopeExecutionName(debouncedScopeSearch),
        enabled: debouncedScopeSearch.length >= 2,
    });
    const scopeOptions = Array.isArray(scopesRes) ? scopesRes : ((scopesRes as any)?.Value || (scopesRes as any)?.value || (scopesRes as any)?.Data || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                Id: selectedItem.Id,
                ScopeExecutionDetailID: selectedItem.ScopeExecutionDetailID,
                StudentID: selectedItem.StudentID,
                EnrollmentDate: selectedItem.EnrollmentDate,
                Status: selectedItem.Status,
                StartDate: selectedItem.StartDate || null,
                CompletionDate: selectedItem.CompletionDate || null,
                Notes: selectedItem.Notes || "",
            });
        } else {
            reset({
                Id: "",
                ScopeExecutionDetailID: "",
                StudentID: "",
                EnrollmentDate: new Date().toISOString().split('T')[0],
                Status: EnrollmentStatus.Enrolled,
                StartDate: null,
                CompletionDate: null,
                Notes: "",
            });
        }
    }, [isEditing, selectedItem, reset, isFormOpen]);

    const handleClose = () => {
        setFormOpen(false);
        setIsEditing(false);
        setSelectedItem(null);
        reset();
    };

    const handleFormSubmit = (data: any) => {
        // Ensure nulls for empty date strings
        onSubmit({
            ...data,
            StartDate: data.StartDate || null,
            CompletionDate: data.CompletionDate || null,
            Notes: data.Notes || null,
        });
    };

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold" }}>
                {isEditing ? "تعديل التسجيل التفصيلي" : "تسجيل طالب في نطاق تفصيلي"}
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        <Controller
                            name="ScopeExecutionDetailID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={isEditing && selectedItem ? [{ Id: selectedItem.ScopeExecutionDetailID, Name: "النطاق المُحدّد (تعديل)" }, ...scopeOptions] : scopeOptions}
                                    getOptionLabel={(option: any) => option.Name || option.name || "تم التحديد"}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.id || option.ID) === (value?.Id || value?.id || value?.ID || value)}
                                    loading={isScopeSearching}
                                    disabled={isEditing}
                                    onInputChange={(e, newInputValue, reason) => {
                                        if (reason === "input" || reason === "clear") setScopeSearch(newInputValue);
                                    }}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.id || newValue.ID) : "")}
                                    value={
                                        (isEditing && selectedItem && field.value === selectedItem.ScopeExecutionDetailID && !scopeOptions.find((o: any) => (o.Id || o.id || o.ID) === field.value))
                                            ? { Id: selectedItem.ScopeExecutionDetailID, Name: "النطاق المُحدّد (تعديل)" }
                                            : scopeOptions.find((opt: any) => (opt.Id || opt.id || opt.ID) === field.value) || null
                                    }
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.id || option.ID}>
                                            <Typography variant="body1">{option.Name || option.name}</Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="بحث عن النطاق التفصيلي (الاسم)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isScopeSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Controller
                            name="StudentID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={isEditing && selectedItem ? [{ Id: selectedItem.StudentID, NationalNumber: "", FullName: selectedItem.StudentName || "الطالب المُحدّد (تعديل)" }, ...studentOptions] : studentOptions}
                                    getOptionLabel={(option: any) => `${option.NationalNumber || option.nationalNumber || ""} - ${option.FullName || option.fullName || option.Name || option.name || option.FirstName || option.firstName || ""}`}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.id || option.ID || option.PersonID || option.personId) === (value?.Id || value?.id || value?.ID || value?.PersonID || value?.personId || value)}
                                    loading={isStudentSearching}
                                    disabled={isEditing}
                                    onInputChange={(e, newInputValue, reason) => {
                                        if (reason === "input" || reason === "clear") setStudentSearch(newInputValue);
                                    }}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.id || newValue.ID || newValue.PersonID || newValue.personId) : "")}
                                    value={
                                        (isEditing && selectedItem && field.value === selectedItem.StudentID && !studentOptions.find((o: any) => (o.Id || o.id || o.ID || o.PersonID || o.personId) === field.value))
                                            ? { Id: selectedItem.StudentID, NationalNumber: "", FullName: selectedItem.StudentName || "الطالب المُحدّد (تعديل)" }
                                            : studentOptions.find((opt: any) => (opt.Id || opt.id || opt.ID || opt.PersonID || opt.personId) === field.value) || null
                                    }
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.id || option.ID || option.PersonID || option.personId}>
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">{option.FullName || option.fullName || option.Name || option.name || option.FirstName || option.firstName}</Typography>
                                                <Typography variant="body2" color="textSecondary">{option.NationalNumber || option.nationalNumber}</Typography>
                                            </Box>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="بحث عن الطالب (الرقم الوطني)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isStudentSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        <Controller
                            name="EnrollmentDate"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    type="date"
                                    label="تاريخ التسجيل"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />

                        <Controller
                            name="Status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="الحالة"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                >
                                    <MenuItem value={EnrollmentStatus.Enrolled}>تسجيل</MenuItem>
                                    <MenuItem value={EnrollmentStatus.Completed}>منجز</MenuItem>
                                    <MenuItem value={EnrollmentStatus.Withdrawn}>منسحب</MenuItem>
                                    <MenuItem value={EnrollmentStatus.Transferred}>منقول</MenuItem>
                                </TextField>
                            )}
                        />

                        <Box display="flex" gap={2}>
                            <Controller
                                name="StartDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        value={field.value || ''}
                                        type="date"
                                        label="تاريخ البدء"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => field.onChange(e.target.value || null)}
                                    />
                                )}
                            />

                            <Controller
                                name="CompletionDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        value={field.value || ''}
                                        type="date"
                                        label="تاريخ الانتهاء"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => field.onChange(e.target.value || null)}
                                    />
                                )}
                            />
                        </Box>

                        <Controller
                            name="Notes"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    value={field.value || ''}
                                    label="ملاحظات"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ التسجيل"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
