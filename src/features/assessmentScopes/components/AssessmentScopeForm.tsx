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
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useAssessmentScopeStore } from "../store/assessmentScopeStore";
import {
    useCreateAssessmentScopeMutation,
    useUpdateAssessmentScopeMutation,
    useSearchAssessmentScopesQuery,
} from "../hooks";
import { AssessmentScopeSchema, ScopeType } from "../types/assessmentScope.types";

import { useSearchProgramsQuery } from "../../programs/hooks";
import { useSearchAutocompleteClassesQuery } from "../../classes/hooks";
import { useInstitutesQuery } from "../../institutes/hooks";
import { useInstituteClassesByInstituteIdQuery } from "../../instituteClasses/hooks";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks";

export const AssessmentScopeForm = ({ isOpen, onClose, selectedItem }: { isOpen: boolean, onClose: () => void, selectedItem?: any }) => {
    const isEditing = !!selectedItem;
    const createMutation = useCreateAssessmentScopeMutation();
    const updateMutation = useUpdateAssessmentScopeMutation();

    const { control, handleSubmit, reset, watch, setValue } = useForm<any>({
        resolver: zodResolver(AssessmentScopeSchema),
        defaultValues: {
            ID: "",
            Name: "",
            ScopeType: 0,
            ProgramID: "",
            ParentScopeID: "",
            ClassID: "",
            InstituteClassID: "",
            ScopeUnitTypeID: "",
            LogicalOperatorBetweenGroups: 0,
            IsFinalDecisionScope: false,
            StartDate: "",
            EndDate: "",
            Notes: ""
        },
    });

    const [programSearch, setProgramSearch] = useState("");
    const [parentScopeSearch, setParentScopeSearch] = useState("");
    const [classSearch, setClassSearch] = useState("");
    const [selectedInstituteId, setSelectedInstituteId] = useState<string>("");

    const { data: programRes, isFetching: isProgramSearching } = useSearchProgramsQuery(programSearch);
    const { data: parentScopeRes, isFetching: isParentScopeSearching } = useSearchAssessmentScopesQuery(parentScopeSearch);
    const { data: classRes, isFetching: isClassSearching } = useSearchAutocompleteClassesQuery(classSearch);

    const { data: institutesRes, isFetching: isInstitutesLoading } = useInstitutesQuery();
    const { data: instituteClassesRes, isFetching: isInstituteClassesLoading } = useInstituteClassesByInstituteIdQuery(selectedInstituteId);
    const { data: scopeUnitTypesRes, isFetching: isScopeUnitsLoading } = useScopeUnitTypesQuery();

    const programOptions = Array.isArray(programRes) ? programRes : ((programRes as any)?.Value || []);
    const parentScopeOptions = Array.isArray(parentScopeRes) ? parentScopeRes : ((parentScopeRes as any)?.Value || []);
    const classOptions = Array.isArray(classRes) ? classRes : ((classRes as any)?.Value || []);

    const instituteOptions = Array.isArray(institutesRes) ? institutesRes : ((institutesRes as any)?.Value || []);
    const instituteClassOptions = Array.isArray(instituteClassesRes) ? instituteClassesRes : ((instituteClassesRes as any)?.Value || []);
    const scopeUnitOptions = Array.isArray(scopeUnitTypesRes) ? scopeUnitTypesRes : ((scopeUnitTypesRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                ID: selectedItem.ID || selectedItem.Id,
                Name: selectedItem.Name || "",
                ScopeType: selectedItem.ScopeType || 0,
                ProgramID: selectedItem.ProgramID || "",
                ParentScopeID: selectedItem.ParentScopeID || "",
                ClassID: selectedItem.ClassID || "",
                InstituteClassID: selectedItem.InstituteClassID || "",
                ScopeUnitTypeID: selectedItem.ScopeUnitTypeID || "",
                LogicalOperatorBetweenGroups: selectedItem.LogicalOperatorBetweenGroups || 0,
                IsFinalDecisionScope: selectedItem.IsFinalDecisionScope || false,
                StartDate: selectedItem.StartDate ? new Date(selectedItem.StartDate).toISOString().split("T")[0] : "",
                EndDate: selectedItem.EndDate ? new Date(selectedItem.EndDate).toISOString().split("T")[0] : "",
                Notes: selectedItem.Notes || ""
            });
            // If we have an existing InstituteClass, we ideally want to fetch the Institute to set the first combo
            // But for simplicity in this form, if the backend doesn't provide InstituteID directly, we might need a workaround.
        } else if (!isEditing) {
            reset({
                ID: "",
                Name: "",
                ScopeType: ScopeType.SubjectExam,
                ProgramID: "",
                ParentScopeID: "",
                ClassID: "",
                InstituteClassID: "",
                ScopeUnitTypeID: "",
                LogicalOperatorBetweenGroups: 0,
                IsFinalDecisionScope: false,
                StartDate: "",
                EndDate: "",
                Notes: ""
            });
            setProgramSearch("");
            setParentScopeSearch("");
            setClassSearch("");
            setSelectedInstituteId("");
        }
    }, [isEditing, selectedItem, reset]);

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = (data: any) => {
        // Sanitize empty strings to null for optional GUIDs
        const payload = { ...data };
        if (!payload.ParentScopeID) delete payload.ParentScopeID;
        if (!payload.ClassID) delete payload.ClassID;
        if (!payload.InstituteClassID) delete payload.InstituteClassID;
        if (!payload.StartDate) delete payload.StartDate;
        if (!payload.EndDate) delete payload.EndDate;

        if (isEditing) {
            updateMutation.mutate({ id: data.ID, data: payload }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(payload, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditing ? "تعديل النطاق" : "إضافة نطاق جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        <Controller
                            name="Name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="اسم النطاق"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />

                        <Controller
                            name="ScopeType"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    select
                                    {...field}
                                    label="نوع النطاق"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                >
                                    <MenuItem value={ScopeType.SubjectExam}>اختبار مقرر</MenuItem>
                                    <MenuItem value={ScopeType.LevelExam}>اختبار مرحلة</MenuItem>
                                    <MenuItem value={ScopeType.Competition}>مسابقة</MenuItem>
                                    <MenuItem value={ScopeType.Qualification}>تأهيل</MenuItem>
                                    <MenuItem value={ScopeType.Individual}>فردي</MenuItem>
                                </TextField>
                            )}
                        />

                        {/* Program Autocomplete */}
                        <Controller
                            name="ProgramID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={programOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isProgramSearching}
                                    onInputChange={(e, newInputValue) => setProgramSearch(newInputValue)}
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
                                            label="ابحث عن المشروع (الاسم)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isProgramSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* Parent Scope Autocomplete */}
                        <Controller
                            name="ParentScopeID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={parentScopeOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isParentScopeSearching}
                                    onInputChange={(e, newInputValue) => setParentScopeSearch(newInputValue)}
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
                                            label="النطاق الأب (اختياري)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isParentScopeSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* Class Autocomplete */}
                        <Controller
                            name="ClassID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={classOptions}
                                    getOptionLabel={(option: any) => option.Name || ""}
                                    isOptionEqualToValue={(option, value) => (option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID) === (value?.Id || value?.ID || value?.ProgramID || value?.ClassID || value?.GroupID || value?.SubjectID || value?.StudentID || value)}
                                    loading={isClassSearching}
                                    onInputChange={(e, newInputValue) => setClassSearch(newInputValue)}
                                    onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.ProgramID || newValue.ClassID || newValue.GroupID || newValue.SubjectID || newValue.StudentID || "") : "")}
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.Id || option.ID || option.ProgramID || option.ClassID || option.GroupID || option.SubjectID || option.StudentID}>
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="body1" fontWeight="bold">
                                                    {option.Name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    المستوى: {option.Level}
                                                </Typography>
                                            </Box>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="الصف (اختياري)"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {isClassSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* Institute and InstituteClass Cascade */}
                        <Box display="flex" gap={2}>
                            <Autocomplete
                                options={instituteOptions}
                                getOptionLabel={(option: any) => option.Name || ""}
                                loading={isInstitutesLoading}
                                onChange={(e, newValue: any) => setSelectedInstituteId(newValue ? newValue.InstituteID || newValue.Id : "")}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="اختر المجمع أولاً"
                                    />
                                )}
                            />

                            <Controller
                                name="InstituteClassID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        select
                                        {...field}
                                        label="حلقة المجمع"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                        disabled={!selectedInstituteId || isInstituteClassesLoading}
                                    >
                                        {instituteClassOptions.map((opt: any) => (
                                            <MenuItem key={opt.InstituteClassID || opt.Id} value={opt.InstituteClassID || opt.Id}>
                                                {opt.ClassName || opt.Name || "حلقة"}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>

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
                                name="StartDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="تاريخ البداية"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                )}
                            />

                            <Controller
                                name="EndDate"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="تاريخ النهاية"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>

                        <Controller
                            name="IsFinalDecisionScope"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                                    label="نطاق قرار نهائي"
                                />
                            )}
                        />

                        <Controller
                            name="Notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ملاحظات"
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
