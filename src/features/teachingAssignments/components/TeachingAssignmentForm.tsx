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
import { useTeachingAssignmentStore } from "../store/teachingAssignmentStore";
import {
    useCreateTeachingAssignmentMutation,
    useUpdateTeachingAssignmentMutation,
    useTeachingAssignmentQuery,
} from "../hooks";
import {
    AddTeachingAssignmentSchema,
    UpdateTeachingAssignmentSchema,
} from "../types/teachingAssignment.validators";

// External search hooks
import { useSearchPersonsByNationalNumQuery } from "../../people/hooks";
import { useSearchGroupsByNameQuery } from "../../groups/hooks";
import { useSearchSubjectsByNameQuery } from "../../subjects/hooks";

export const TeachingAssignmentForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useTeachingAssignmentStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateTeachingAssignmentSchema : AddTeachingAssignmentSchema;

    const { data: assignmentResponse, isLoading: isLoadingEntity } = useTeachingAssignmentQuery(editId);
    const createMutation = useCreateTeachingAssignmentMutation();
    const updateMutation = useUpdateTeachingAssignmentMutation();

    const { control, handleSubmit, reset, setValue } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            TeachingAssignmentID: "",
            TeacherID: "",
            GroupID: "",
            SubjectID: "",
        },
    });

    // Local state for Autocomplete inputs (Search Terms)
    const [teacherSearch, setTeacherSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [subjectSearch, setSubjectSearch] = useState("");

    // Search Queries
    const { data: teacherRes, isFetching: isTeacherSearching } = useSearchPersonsByNationalNumQuery(teacherSearch);
    const { data: groupRes, isFetching: isGroupSearching } = useSearchGroupsByNameQuery(groupSearch);
    const { data: subjectRes, isFetching: isSubjectSearching } = useSearchSubjectsByNameQuery(subjectSearch);

    const teacherOptions = Array.isArray(teacherRes) ? teacherRes : ((teacherRes as any)?.Value || []);
    const groupOptions = Array.isArray(groupRes) ? groupRes : ((groupRes as any)?.Value || []);
    const subjectOptions = Array.isArray(subjectRes) ? subjectRes : ((subjectRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && assignmentResponse) {
            const g = (assignmentResponse as any)?.Value || assignmentResponse;
            if (g && g.TeachingAssignmentID) {
                reset({
                    TeachingAssignmentID: g.TeachingAssignmentID,
                    TeacherID: g.TeacherID,
                    GroupID: g.GroupID,
                    SubjectID: g.SubjectID,
                });
            }
        } else if (!isEditing) {
            reset({
                TeachingAssignmentID: "",
                TeacherID: "",
                GroupID: "",
                SubjectID: "",
            });
            setTeacherSearch("");
            setGroupSearch("");
            setSubjectSearch("");
        }
    }, [isEditing, assignmentResponse, reset]);

    const handleClose = () => {
        closeForm();
        reset();
        setTeacherSearch("");
        setGroupSearch("");
        setSubjectSearch("");
    };

    const onSubmit = (data: any) => {
        if (isEditing) {
            updateMutation.mutate(data, { onSuccess: handleClose });
        } else {
            createMutation.mutate(data, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل التكليف" : "إضافة تكليف جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingEntity && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>

                            {/* Teacher Autocomplete */}
                            <Controller
                                name="TeacherID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        options={teacherOptions}
                                        getOptionLabel={(option: any) => option.NationalNumber || ""}
                                        isOptionEqualToValue={(option, value) => option.PersonID === value?.PersonID || option.PersonID === value}
                                        loading={isTeacherSearching}
                                        onInputChange={(e, newInputValue) => {
                                            setTeacherSearch(newInputValue);
                                        }}
                                        onChange={(e, newValue: any) => {
                                            field.onChange(newValue ? newValue.PersonID : "");
                                        }}
                                        renderOption={(props, option: any) => (
                                            <li {...props} key={option.PersonID}>
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
                                                label="ابحث عن المعلم (رقم الهوية)"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {isTeacherSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />

                            {/* Group Autocomplete */}
                            <Controller
                                name="GroupID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        options={groupOptions}
                                        getOptionLabel={(option: any) => option.GroupName || ""}
                                        isOptionEqualToValue={(option, value) => option.GroupID === value?.GroupID || option.GroupID === value}
                                        loading={isGroupSearching}
                                        onInputChange={(e, newInputValue) => {
                                            setGroupSearch(newInputValue);
                                        }}
                                        onChange={(e, newValue: any) => {
                                            field.onChange(newValue ? newValue.GroupID : "");
                                        }}
                                        renderOption={(props, option: any) => (
                                            <li {...props} key={option.GroupID}>
                                                <Box display="flex" flexDirection="column">
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {option.GroupName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        رمز: {option.Code}
                                                    </Typography>
                                                </Box>
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="ابحث عن المجموعة (الاسم)"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {isGroupSearching ? <CircularProgress color="inherit" size={20} /> : null}
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
                                        getOptionLabel={(option: any) => option.SubjectName || ""}
                                        isOptionEqualToValue={(option, value) => option.SubjectID === value?.SubjectID || option.SubjectID === value}
                                        loading={isSubjectSearching}
                                        onInputChange={(e, newInputValue) => {
                                            setSubjectSearch(newInputValue);
                                        }}
                                        onChange={(e, newValue: any) => {
                                            field.onChange(newValue ? newValue.SubjectID : "");
                                        }}
                                        renderOption={(props, option: any) => (
                                            <li {...props} key={option.SubjectID}>
                                                <Box display="flex" flexDirection="column">
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {option.SubjectName}
                                                    </Typography>
                                                </Box>
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="ابحث عن المادة (الاسم)"
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

                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSaving || (isLoadingEntity && isEditing)}
                    >
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
