import React, { useEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    EnrollmentStatus,
    EnrollStudentInScopeExecutionSchema,
} from "../types/enrollStudentInScopeExecution.types";
import {
    useCreateEnrollStudentInScopeExecutionMutation,
    useUpdateEnrollStudentInScopeExecutionMutation,
} from "../hooks/useEnrollStudentInScopeExecutions";

// Assuming we have these services available in the project for searching:
import { studentService } from "../../students/services/studentService";
import { scopeExecutionService } from "../../scopeExecutions/services/scopeExecutionService";
import { useQuery } from "@tanstack/react-query";

interface EnrollStudentInScopeExecutionFormProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItem?: any;
    defaultScopeExecutionId?: string | null;
}

export const EnrollStudentInScopeExecutionForm = ({ isOpen, onClose, selectedItem, defaultScopeExecutionId }: EnrollStudentInScopeExecutionFormProps) => {
    const isEditing = !!selectedItem;

    const { control, handleSubmit, reset, watch } = useForm({
        resolver: zodResolver(EnrollStudentInScopeExecutionSchema),
        defaultValues: {
            id: "",
            scopeExecutionID: defaultScopeExecutionId || "",
            studentID: "",
            enrollmentDate: new Date().toISOString().split("T")[0],
            status: EnrollmentStatus.Enrolled,
            startDate: "",
            completionDate: "",
            notes: "",
        },
    });

    const createMutation = useCreateEnrollStudentInScopeExecutionMutation();
    const updateMutation = useUpdateEnrollStudentInScopeExecutionMutation();

    const [studentSearch, setStudentSearch] = useState("");
    const [debouncedStudentSearch, setDebouncedStudentSearch] = useState("");

    const [scopeSearch, setScopeSearch] = useState("");
    const [debouncedScopeSearch, setDebouncedScopeSearch] = useState("");

    // Debounce student search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedStudentSearch(studentSearch), 500);
        return () => clearTimeout(handler);
    }, [studentSearch]);

    // Fetch students
    const { data: studentsRes, isFetching: isStudentSearching } = useQuery({
        queryKey: ["searchStudents", debouncedStudentSearch],
        queryFn: () => studentService.searchByNationalNumber(debouncedStudentSearch),
        enabled: debouncedStudentSearch.length >= 2,
    });
    const studentOptions = Array.isArray(studentsRes) ? studentsRes : ((studentsRes as any)?.Value || (studentsRes as any)?.value || (studentsRes as any)?.Data || (studentsRes as any)?.data || []);

    // Debounce scope search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedScopeSearch(scopeSearch), 500);
        return () => clearTimeout(handler);
    }, [scopeSearch]);

    // Fetch scopes
    const { data: scopesRes, isFetching: isScopeSearching } = useQuery({
        queryKey: ["searchScopes", debouncedScopeSearch],
        queryFn: () => scopeExecutionService.searchByName(debouncedScopeSearch),
        enabled: debouncedScopeSearch.length >= 2,
    });
    const scopeOptions = Array.isArray(scopesRes) ? scopesRes : ((scopesRes as any)?.Value || (scopesRes as any)?.value || (scopesRes as any)?.Data || (scopesRes as any)?.data || []);

    // Pre-fill form if editing
    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                id: selectedItem.Id,
                scopeExecutionID: selectedItem.ScopeExecutionID,
                studentID: selectedItem.StudentID,
                enrollmentDate: selectedItem.EnrollmentDate,
                status: selectedItem.Status,
                startDate: selectedItem.StartDate || "",
                completionDate: selectedItem.CompletionDate || "",
                notes: selectedItem.Notes || "",
            });
        }
    }, [isEditing, selectedItem, reset]);

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            startDate: data.startDate || null,
            completionDate: data.completionDate || null,
            notes: data.notes || null,
        };

        if (isEditing) {
            updateMutation.mutate(
                { id: data.id, data: payload },
                { onSuccess: () => onClose() }
            );
        } else {
            createMutation.mutate(payload, { onSuccess: () => onClose() });
        }
    };

    const statusOptions = [
        { value: EnrollmentStatus.Enrolled, label: "مسجل" },
        { value: EnrollmentStatus.InProgress, label: "قيد التنفيذ" },
        { value: EnrollmentStatus.Completed, label: "مكتمل" },
        { value: EnrollmentStatus.Dropped, label: "منسحب" },
        { value: EnrollmentStatus.Suspended, label: "معلق" },
    ];

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {isEditing ? "تعديل التسجيل" : "إضافة تسجيل جديد للفصل الدراسي/النطاق"}
                </DialogTitle>

                <DialogContent dividers>
                    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>

                        {/* ScopeExecution Autocomplete */}
                        <Box>
                            <Controller
                                name="scopeExecutionID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        options={isEditing && selectedItem ? [{ Id: selectedItem.ScopeExecutionID, Name: "النطاق المُحدّد (تعديل)" }, ...scopeOptions] : scopeOptions}
                                        getOptionLabel={(option: any) => option.Name || option.name || ""}
                                        isOptionEqualToValue={(option, value) => (option.Id || option.id || option.ID) === (value?.Id || value?.id || value?.ID || value)}
                                        loading={isScopeSearching}
                                        onInputChange={(e, newInputValue, reason) => {
                                            if (reason === "input" || reason === "clear") setScopeSearch(newInputValue);
                                        }}
                                        onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.id || newValue.ID) : "")}
                                        value={
                                            (isEditing && selectedItem && field.value === selectedItem.ScopeExecutionID && !scopeOptions.find((o: any) => (o.Id || o.id || o.ID) === field.value))
                                                ? { Id: selectedItem.ScopeExecutionID, Name: "النطاق المُحدّد (تعديل)" }
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
                                                label="بحث عن نطاق/فصل دراسي (الاسم)"
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
                        </Box>

                        {/* Student Autocomplete */}
                        <Box>
                            <Controller
                                name="studentID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        options={isEditing && selectedItem ? [{ Id: selectedItem.StudentID, NationalNumber: selectedItem.NationalNumber, FullName: selectedItem.StudentName }, ...studentOptions] : studentOptions}
                                        getOptionLabel={(option: any) => `${option.NationalNumber || option.nationalNumber || ""} - ${option.FullName || option.fullName || option.Name || option.name || option.FirstName || option.firstName || ""}`}
                                        isOptionEqualToValue={(option, value) => (option.Id || option.id || option.ID || option.PersonID || option.personId) === (value?.Id || value?.id || value?.ID || value?.PersonID || value?.personId || value)}
                                        loading={isStudentSearching}
                                        onInputChange={(e, newInputValue, reason) => {
                                            if (reason === "input" || reason === "clear") setStudentSearch(newInputValue);
                                        }}
                                        onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.id || newValue.ID || newValue.PersonID || newValue.personId) : "")}
                                        value={
                                            (isEditing && selectedItem && field.value === selectedItem.StudentID && !studentOptions.find((o: any) => (o.Id || o.id || o.ID || o.PersonID || o.personId) === field.value))
                                                ? { Id: selectedItem.StudentID, NationalNumber: selectedItem.NationalNumber, FullName: selectedItem.StudentName }
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
                        </Box>

                        <Box>
                            <Controller
                                name="enrollmentDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="تاريخ التسجيل"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="حالة التسجيل"
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    >
                                        {statusOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>

                        <Box>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="تاريخ البدء (اختياري)"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Controller
                                name="completionDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="تاريخ الانتهاء"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Box>

                        <Box sx={{ gridColumn: { xs: "span 1", md: "span 2" } }}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="ملاحظات"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Box>

                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} color="inherit">
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {isEditing ? "حفظ التعديلات" : "إضافة تسجيل"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
