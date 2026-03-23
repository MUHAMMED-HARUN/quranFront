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

import { useStudentAssessmentStore } from "../store/studentAssessmentStore";
import {
    useCreateStudentAssessmentMutation,
    useUpdateStudentAssessmentMutation,
} from "../hooks/useStudentAssessments";
import { StudentAssessmentSchema, StudentAssessmentStatus } from "../types/studentAssessment.types";

import { useSearchAssessmentScopesQuery } from "../../assessmentScopes/hooks";
import { useSearchStudentsByNationalNumQuery } from "../../students/hooks";
import { useSearchSubjectsByNameQuery } from "../../subjects/hooks";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks";

const StatusOptions = [
    { value: StudentAssessmentStatus.Attended, label: "حاضر" },
    { value: StudentAssessmentStatus.Absent, label: "غائب" },
    { value: StudentAssessmentStatus.Excused, label: "عذر" }
];

export const StudentAssessmentForm = ({ isOpen, onClose, selectedItem }: { isOpen: boolean, onClose: () => void, selectedItem?: any }) => {
    const isEditing = !!selectedItem;
    const createMutation = useCreateStudentAssessmentMutation();
    const updateMutation = useUpdateStudentAssessmentMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(StudentAssessmentSchema),
        defaultValues: {
            Id: "",
            AssessmentScopeID: "",
            StudentID: "",
            ScopeUnitTypeID: "",
            SubjectID: "",
            From: "",
            To: "",
            Score: 0,
            Status: StudentAssessmentStatus.Attended,
            Notes: ""
        },
    });

    const [scopeSearch, setScopeSearch] = useState("");
    const [studentSearch, setStudentSearch] = useState("");
    const [subjectSearch, setSubjectSearch] = useState("");

    const { data: scopeRes, isFetching: isScopeSearching } = useSearchAssessmentScopesQuery(scopeSearch);
    const { data: studentRes, isFetching: isStudentSearching } = useSearchStudentsByNationalNumQuery(studentSearch || "");
    const { data: subjectRes, isFetching: isSubjectSearching } = useSearchSubjectsByNameQuery(subjectSearch || "");
    const { data: scopeUnitTypesRes, isFetching: isScopeUnitsLoading } = useScopeUnitTypesQuery();

    const scopeOptions = Array.isArray(scopeRes) ? scopeRes : ((scopeRes as any)?.Value || []);
    const studentOptions = Array.isArray(studentRes) ? studentRes : ((studentRes as any)?.Value || []);
    const subjectOptions = Array.isArray(subjectRes) ? subjectRes : ((subjectRes as any)?.Value || []);
    const scopeUnitOptions = Array.isArray(scopeUnitTypesRes) ? scopeUnitTypesRes : ((scopeUnitTypesRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                Id: selectedItem.Id || selectedItem.ID,
                AssessmentScopeID: selectedItem.AssessmentScopeID || "",
                StudentID: selectedItem.StudentID || "",
                ScopeUnitTypeID: selectedItem.ScopeUnitTypeID || "",
                SubjectID: selectedItem.SubjectID || "",
                From: selectedItem.From || "",
                To: selectedItem.To || "",
                Score: selectedItem.Score || 0,
                Status: selectedItem.Status || StudentAssessmentStatus.Attended,
                Notes: selectedItem.Notes || ""
            });
        } else if (!isEditing) {
            reset({
                Id: "",
                AssessmentScopeID: "",
                StudentID: "",
                ScopeUnitTypeID: "",
                SubjectID: "",
                From: "",
                To: "",
                Score: 0,
                Status: StudentAssessmentStatus.Attended,
                Notes: ""
            });
            setScopeSearch("");
            setStudentSearch("");
            setSubjectSearch("");
        }
    }, [isEditing, selectedItem, reset]);

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = (data: any) => {
        const payload = { ...data };
        if (!payload.From) delete payload.From;
        if (!payload.To) delete payload.To;
        if (!payload.Notes) delete payload.Notes;

        if (isEditing) {
            updateMutation.mutate({ id: data.Id, data: payload }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(payload, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل تقييم الطالب" : "إضافة تقييم جديد للطالب"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

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
                                            label="ابحث عن نطاق التقييم"
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

                        {/* Student Autocomplete */}
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

                        {/* Subject Autocomplete */}
                        <Controller
                            name="SubjectID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={subjectOptions}
                                    getOptionLabel={(option: any) => option.SubjectName || option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isSubjectSearching}
                                    onInputChange={(e, newInputValue) => setSubjectSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.ProgramID || newValue.ClassID || newValue.GroupID || newValue.SubjectID || newValue.StudentID || "") : "")}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {option.SubjectName || option.Name}
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
                                name="From"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="من تاريخ"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="To"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="إلى تاريخ"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>

                        <Box display="flex" gap={2}>
                            <Controller
                                name="Score"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="الدرجة"
                                        type="number"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
                            />

                            <Controller
                                name="Status"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        select
                                        {...field}
                                        label="الحالة"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    >
                                        {StatusOptions.map(opt => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>

                        <Controller
                            name="Notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ملاحظات"
                                    multiline
                                    rows={2}
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
