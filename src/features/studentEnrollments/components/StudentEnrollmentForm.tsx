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
import { useStudentEnrollmentStore } from "../store/studentEnrollmentStore";
import {
    useCreateStudentEnrollmentMutation,
    useUpdateStudentEnrollmentMutation,
    useStudentEnrollmentQuery,
} from "../hooks";
import {
    AddStudentEnrollmentSchema,
    UpdateStudentEnrollmentSchema,
} from "../types/studentEnrollment.validators";

// External search hooks
import { useSearchPersonsByNationalNumQuery } from "../../people/hooks";
import { useSearchGroupsByNameQuery } from "../../groups/hooks";

export const StudentEnrollmentForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useStudentEnrollmentStore();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const Schema = isEditing ? UpdateStudentEnrollmentSchema : AddStudentEnrollmentSchema;

    const { data: enrollmentResponse, isLoading: isLoadingEntity } = useStudentEnrollmentQuery(editId);
    const createMutation = useCreateStudentEnrollmentMutation();
    const updateMutation = useUpdateStudentEnrollmentMutation();

    const { control, handleSubmit, reset } = useForm<any>({
        resolver: zodResolver(Schema),
        defaultValues: {
            StudentEnrollmentID: "",
            StudentID: "",
            GroupID: "",
            Date: new Date().toISOString().split("T")[0],
        },
    });

    // Local state for Autocomplete inputs (Search Terms)
    const [studentSearch, setStudentSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");

    // Search Queries
    const { data: studentRes, isFetching: isStudentSearching } = useSearchPersonsByNationalNumQuery(studentSearch);
    const { data: groupRes, isFetching: isGroupSearching } = useSearchGroupsByNameQuery(groupSearch);

    const studentOptions = Array.isArray(studentRes) ? studentRes : ((studentRes as any)?.Value || []);
    const groupOptions = Array.isArray(groupRes) ? groupRes : ((groupRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && enrollmentResponse) {
            const g = (enrollmentResponse as any)?.Value || enrollmentResponse;
            if (g && g.StudentEnrollmentID) {
                // Date mapping if backend sends ISO timeline
                let formattedDate = "";
                try {
                    formattedDate = new Date(g.Date).toISOString().split("T")[0];
                } catch {
                    formattedDate = g.Date;
                }

                reset({
                    StudentEnrollmentID: g.StudentEnrollmentID,
                    StudentID: g.StudentID,
                    GroupID: g.GroupID,
                    Date: formattedDate,
                });
            }
        } else if (!isEditing) {
            reset({
                StudentEnrollmentID: "",
                StudentID: "",
                GroupID: "",
                Date: new Date().toISOString().split("T")[0],
            });
            setStudentSearch("");
            setGroupSearch("");
        }
    }, [isEditing, enrollmentResponse, reset]);

    const handleClose = () => {
        closeForm();
        reset();
        setStudentSearch("");
        setGroupSearch("");
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
            <DialogTitle>{isEditing ? "تعديل التسجيل" : "تسجيل طالب جديد"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {isLoadingEntity && isEditing ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={3}>

                            {/* Student Autocomplete */}
                            <Controller
                                name="StudentID"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        options={studentOptions}
                                        getOptionLabel={(option: any) => option.NationalNumber || ""}
                                        isOptionEqualToValue={(option, value) => option.PersonID === value?.PersonID || option.PersonID === value}
                                        loading={isStudentSearching}
                                        onInputChange={(e, newInputValue) => {
                                            setStudentSearch(newInputValue);
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

                            <Controller
                                name="Date"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="تاريخ الانضمام"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
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
