import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, CircularProgress, Autocomplete, TextField, Typography, MenuItem
} from "@mui/material";

import { useDailyEvaluationStore } from "../store/dailyEvaluationStore";
import {
    useCreateDailyEvaluationMutation,
    useUpdateDailyEvaluationMutation,
    useDailyEvaluationsQuery
} from "../hooks/useDailyEvaluations";
import { DailyEvaluationSchema } from "../types/dailyEvaluation.types";

import { useSearchMattersQuery } from "../../matters/hooks/useSearchMattersQuery";
import { useSearchStudentsByNationalNumberQuery } from "../../students/hooks/useSearchStudentsByNationalNumberQuery";
import { useSearchGroupsQuery } from "../../groups/hooks/useSearchGroupsQuery";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks/useScopeUnitTypesQuery";
import { useStudentEnrollmentByStudentAndGroupQuery } from "../../studentEnrollments/hooks/useStudentEnrollmentByStudentAndGroupQuery";

export const DailyEvaluationForm = () => {
    const { isFormOpen, closeForm, selectedIds } = useDailyEvaluationStore();
    const { data: listResponse } = useDailyEvaluationsQuery();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;
    const evaluations = Array.isArray(listResponse) ? listResponse : ((listResponse as any)?.Value || []);
    const selectedItem = isEditing ? evaluations.find((x: any) => (x.Id || x.ID) === editId) : null;

    const createMutation = useCreateDailyEvaluationMutation();
    const updateMutation = useUpdateDailyEvaluationMutation();

    const { control, handleSubmit, reset, watch, setValue, formState } = useForm<any>({
        resolver: zodResolver(DailyEvaluationSchema),
        defaultValues: {
            GroupID: "",
            StudentID: "",
            StudentEnrollmentID: "",
            Date: new Date().toISOString().split("T")[0],
            From: 0,
            To: 0,
            UnitTypeID: "",
            MatterID: "",
            LevelID: 1
        },
    });

    // Watch dependencies
    const selectedGroupId = watch("GroupID");
    const selectedStudentId = watch("StudentID");

    // Preload dependencies
    const { data: specificEnrollmentRes } = useStudentEnrollmentByStudentAndGroupQuery(
        !isEditing ? selectedStudentId : null,
        !isEditing ? selectedGroupId : null
    );
    const specificEnrollment = (specificEnrollmentRes as any)?.Value || specificEnrollmentRes;

    // Derived StudentEnrollment resolver
    useEffect(() => {
        if (!isEditing && selectedGroupId && selectedStudentId && specificEnrollment) {
            setValue(
                "StudentEnrollmentID",
                specificEnrollment.StudentEnrollmentID || specificEnrollment.studentEnrollmentID || "",
                { shouldValidate: true }
            );
        } else if (!isEditing) {
            setValue("StudentEnrollmentID", "", { shouldValidate: true });
        }
    }, [selectedGroupId, selectedStudentId, specificEnrollment, isEditing, setValue]);

    // Autocomplete States
    const [matterSearch, setMatterSearch] = useState("");
    const { data: mattersRes, isFetching: isMatterSearching } = useSearchMattersQuery(matterSearch);
    const matterOptions = Array.isArray(mattersRes) ? mattersRes : ((mattersRes as any)?.Value || []);

    const [groupSearch, setGroupSearch] = useState("");
    const { data: groupsRes, isFetching: isGroupSearching } = useSearchGroupsQuery(groupSearch);
    const groupOptions = Array.isArray(groupsRes) ? groupsRes : ((groupsRes as any)?.Value || []);

    const [studentSearch, setStudentSearch] = useState("");
    const { data: studentsRes, isFetching: isStudentSearching } = useSearchStudentsByNationalNumberQuery(studentSearch);
    const studentOptions = Array.isArray(studentsRes) ? studentsRes : ((studentsRes as any)?.Value || []);

    const { data: scopeUnitsRes } = useScopeUnitTypesQuery();
    const scopeUnitsOptions = Array.isArray(scopeUnitsRes) ? scopeUnitsRes : ((scopeUnitsRes as any)?.Value || []);

    useEffect(() => {
        if (isEditing && selectedItem) {
            reset({
                StudentEnrollmentID: selectedItem.StudentEnrollmentID || "",
                Date: selectedItem.Date ? selectedItem.Date.split("T")[0] : new Date().toISOString().split("T")[0],
                From: selectedItem.From || 0,
                To: selectedItem.To || 0,
                UnitTypeID: selectedItem.UnitTypeID || "",
                MatterID: selectedItem.MatterID || "",
                LevelID: selectedItem.LevelID !== undefined ? selectedItem.LevelID : 1
            });
        } else if (!isEditing) {
            reset({
                GroupID: "",
                StudentID: "",
                StudentEnrollmentID: "",
                Date: new Date().toISOString().split("T")[0],
                From: 0,
                To: 0,
                UnitTypeID: "",
                MatterID: "",
                LevelID: 1
            });
            setMatterSearch("");
            setStudentSearch("");
            setGroupSearch("");
        }
    }, [isEditing, selectedItem, reset, isFormOpen]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        const payload = {
            StudentEnrollmentID: data.StudentEnrollmentID,
            Date: data.Date,
            From: Number(data.From),
            To: Number(data.To),
            UnitTypeID: data.UnitTypeID,
            MatterID: data.MatterID,
            LevelID: Number(data.LevelID)
        };

        if (isEditing) {
            updateMutation.mutate({ id: editId!, data: payload }, { onSuccess: handleClose });
        } else {
            createMutation.mutate(payload, { onSuccess: handleClose });
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? "تعديل التقييم" : "إضافة تقييم يودي"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        {/* Hidden error block for StudentEnrollment logic */}
                        {!isEditing && formState.errors.StudentEnrollmentID && (
                            <Typography color="error" variant="body2">
                                {String(formState.errors.StudentEnrollmentID?.message || "")} - تأكد من ارتباط الطالب بالمجموعة المحددة
                            </Typography>
                        )}

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
                                            <Typography variant="body1" fontWeight="bold">{option.Name}</Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => <TextField {...params} label="بحث عن المادة (الاسم)" error={!!fieldState.error} helperText={fieldState.error?.message} />}
                                />
                            )}
                        />

                        {!isEditing && (
                            <>
                                <Controller
                                    name="GroupID"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Autocomplete
                                            options={groupOptions}
                                            getOptionLabel={(option: any) => option.GroupName ? `${option.GroupName} - ${option.Code || ""}` : (option.Name ? `${option.Name} - ${option.Code || ""}` : "")}
                                            isOptionEqualToValue={(option, value) => (option.GroupID || option.Id || option.ID) === (value?.GroupID || value?.Id || value?.ID || value)}
                                            loading={isGroupSearching}
                                            onInputChange={(e, newInputValue, reason) => {
                                                if (reason === "input" || reason === "clear") {
                                                    setGroupSearch(newInputValue);
                                                }
                                            }}
                                            onChange={(e, newValue: any) => field.onChange(newValue ? (newValue.GroupID || newValue.Id || newValue.ID) : "")}
                                            value={groupOptions.find((opt: any) => (opt.GroupID || opt.Id || opt.ID) === field.value) || null}
                                            renderOption={(props, option: any) => (
                                                <li {...props} key={option.GroupID || option.Id || option.ID}>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="bold">{option.GroupName || option.Name}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{option.Code}</Typography>
                                                    </Box>
                                                </li>
                                            )}
                                            renderInput={(params) => <TextField {...params} label="بحث عن المجموعة (الاسم)" error={!!fieldState.error} helperText={fieldState.error?.message} />}
                                        />
                                    )}
                                />

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
                                                        <Typography variant="body1" fontWeight="bold">{option.NationalNumber}</Typography>
                                                        <Typography variant="body2" color="textSecondary">{option.FullName || option.Name}</Typography>
                                                    </Box>
                                                </li>
                                            )}
                                            renderInput={(params) => <TextField {...params} label="بحث عن الطالب (رقم الهوية)" error={!!fieldState.error} helperText={fieldState.error?.message} />}
                                        />
                                    )}
                                />
                            </>
                        )}

                        <Controller
                            name="UnitTypeID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field} select label="نوع الوحدة" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth>
                                    <MenuItem value="">اختر نوع الوحدة</MenuItem>
                                    {scopeUnitsOptions.map((su: any) => (
                                        <MenuItem key={su.Id || su.ID} value={su.Id || su.ID}>{su.Name}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="LevelID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field} select label="مستوى التقييم" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth>
                                    <MenuItem value={0}>ممتاز</MenuItem>
                                    <MenuItem value={1}>جيد جدا</MenuItem>
                                    <MenuItem value={2}>جيد</MenuItem>
                                    <MenuItem value={3}>مقبول</MenuItem>
                                    <MenuItem value={4}>ضعيف</MenuItem>
                                </TextField>
                            )}
                        />

                        <Box display="flex" gap={2}>
                            <Controller
                                name="From"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField {...field} type="number" label="من (رقم الصفحة/الوحدة)" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                                )}
                            />
                            <Controller
                                name="To"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField {...field} type="number" label="إلى" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                                )}
                            />
                        </Box>

                        <Controller
                            name="Date"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} type="date" label="التاريخ" InputLabelProps={{ shrink: true }} error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                            )}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSaving}>إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || (!isEditing && !watch("StudentEnrollmentID"))}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
