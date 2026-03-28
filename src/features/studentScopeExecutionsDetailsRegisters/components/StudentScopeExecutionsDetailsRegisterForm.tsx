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
    Alert,
} from "@mui/material";

import { useCreateStudentScopeExecutionsDetailsRegisterMutation } from "../hooks/useStudentScopeExecutionsDetailsRegisters";
import { StudentScopeExecutionsDetailsRegisterSchema } from "../types/studentScopeExecutionsDetailsRegister.types";

import { useSearchStudentsByNationalNumberQuery } from "../../students/hooks/useSearchStudentsByNationalNumberQuery";
import { useSearchGroupsByNameQuery } from "../../groups/hooks/useSearchGroupsByNameQuery";
import { useStudentEnrollmentByStudentAndGroupQuery } from "../../studentEnrollments/hooks/useStudentEnrollmentByStudentAndGroupQuery";

export const StudentScopeExecutionsDetailsRegisterForm = ({ 
    isOpen, 
    onClose, 
    scopeExecutionDetail 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    scopeExecutionDetail?: any 
}) => {
    const createMutation = useCreateStudentScopeExecutionsDetailsRegisterMutation();

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<any>({
        resolver: zodResolver(StudentScopeExecutionsDetailsRegisterSchema),
        defaultValues: {
            ScopeExecutionDetailID: "",
            StudentEnrollmentID: "",
            Status: 2, // InProgress
            StartDate: new Date().toISOString().split('T')[0],
        },
    });

    // Local Search states
    const [studentSearch, setStudentSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const { data: studentsRes, isFetching: isStudentsLoading } = useSearchStudentsByNationalNumberQuery(studentSearch);
    const { data: groupsRes, isFetching: isGroupsLoading } = useSearchGroupsByNameQuery(groupSearch);

    // Dynamic resolution of Student Enrollment
    const { data: enrollmentRes, isFetching: isEnrollmentLoading } = useStudentEnrollmentByStudentAndGroupQuery(
        selectedStudentId, 
        selectedGroupId
    );

    const studentOptions = Array.isArray(studentsRes) ? studentsRes : ((studentsRes as any)?.Value || []);
    const groupOptions = Array.isArray(groupsRes) ? groupsRes : ((groupsRes as any)?.Value || []);
    
    // Evaluate resolved enrollment
    const resolvedEnrollment = (enrollmentRes as any)?.Value || (Array.isArray(enrollmentRes) ? enrollmentRes[0] : null);
    const resolvedEnrollmentId = resolvedEnrollment?.StudentEnrollmentID || resolvedEnrollment?.Id || null;

    useEffect(() => {
        if (isOpen && scopeExecutionDetail) {
            reset({
                ScopeExecutionDetailID: scopeExecutionDetail.Id || scopeExecutionDetail.ID,
                StudentEnrollmentID: "",
                Status: 2, // InProgress
                StartDate: new Date().toISOString().split('T')[0],
            });
            // Optional: Automatically fill the group based on the detail
            if (scopeExecutionDetail.GroupID) {
                setSelectedGroupId(scopeExecutionDetail.GroupID);
                // Note: to fully show the group name in autocomplete, we'd need it in groupOptions
                // If it's not pre-loaded, the user might see empty label. We will just use search.
            } else {
                setSelectedGroupId(null);
            }
            setSelectedStudentId(null);
            setStudentSearch("");
            setGroupSearch("");
        }
    }, [isOpen, scopeExecutionDetail, reset]);

    useEffect(() => {
        if (resolvedEnrollmentId) {
            setValue("StudentEnrollmentID", resolvedEnrollmentId, { shouldValidate: true });
        } else {
            setValue("StudentEnrollmentID", "", { shouldValidate: true });
        }
    }, [resolvedEnrollmentId, setValue]);

    const handleClose = () => {
        onClose();
        reset();
    };

    const onSubmit = (data: any) => {
        const payload = { ...data };
        createMutation.mutate(payload, { onSuccess: handleClose });
    };

    const isSaving = createMutation.isPending;

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>تسجيل طالب في النطاق التفصيلي</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>
                        
                        <Typography variant="body2" color="primary">
                            النطاق المستهدف: {scopeExecutionDetail?.ScopeExecutionName || "محدد"} - المادة: {scopeExecutionDetail?.MatterName || "-"}
                        </Typography>

                        {/* Student Search by National Number */}
                        <Autocomplete
                            options={studentOptions}
                            getOptionLabel={(option: any) => `${option.NationalNumber} - ${option.FullName || option.Name || ""}`}
                            isOptionEqualToValue={(option, value) => (option.ID || option.Id) === (value?.ID || value?.Id || value)}
                            loading={isStudentsLoading}
                            onInputChange={(e, newInputValue) => setStudentSearch(newInputValue)}
                            onChange={(e, newValue: any) => setSelectedStudentId(newValue ? (newValue.ID || newValue.Id) : null)}
                            renderOption={(props, option: any) => (
                                <li {...props} key={option.ID || option.Id}>
                                    <Box display="flex" flexDirection="column">
                                        <Typography variant="body1" fontWeight="bold">
                                            {option.FullName || option.Name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            رقم الهوية: {option.NationalNumber}
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="بحث عن الطالب برقم الهوية"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {isStudentsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {/* Group Search by Name */}
                        <Autocomplete
                            options={groupOptions}
                            getOptionLabel={(option: any) => option.GroupName || option.Name || ""}
                            isOptionEqualToValue={(option, value) => (option.GroupID || option.Id) === (value?.GroupID || value?.Id || value)}
                            loading={isGroupsLoading}
                            onInputChange={(e, newInputValue) => setGroupSearch(newInputValue)}
                            onChange={(e, newValue: any) => setSelectedGroupId(newValue ? (newValue.GroupID || newValue.Id) : null)}
                            renderOption={(props, option: any) => (
                                <li {...props} key={option.GroupID || option.Id}>
                                    <Typography variant="body1">
                                        {option.GroupName || option.Name}
                                    </Typography>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="بحث عن المجموعة باسم المجموعة"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {isGroupsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {/* Status Feedback */}
                        {selectedStudentId && selectedGroupId && (
                            <Box mt={1}>
                                {isEnrollmentLoading ? (
                                    <CircularProgress size={24} />
                                ) : resolvedEnrollmentId ? (
                                    <Alert severity="success">
                                        تم العثور على تعيين الطالب في المجموعة. يمكن المتابعة.
                                    </Alert>
                                ) : (
                                    <Alert severity="error">
                                        هذا الطالب غير مسجل في هذه المجموعة. يرجى التحقق.
                                    </Alert>
                                )}
                            </Box>
                        )}
                        {!resolvedEnrollmentId && errors.StudentEnrollmentID && (
                            <Typography color="error" variant="caption">
                                {errors.StudentEnrollmentID.message?.toString() || "يجب تحديد طالب ينتمي للمجموعة للتمكن من التسجيل."}
                            </Typography>
                        )}

                        {/* Start Date */}
                        <Controller
                            name="StartDate"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="تاريخ البدء"
                                    type="date"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || !resolvedEnrollmentId}>
                        {isSaving ? "جاري التسجيل..." : "تسجيل"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
