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
import { useDailyEvaluationFormContextQuery } from "../hooks/useDailyEvaluationFormContextQuery";

import { useSearchMattersQuery } from "../../matters/hooks/useSearchMattersQuery";
import { useSearchStudentsByNationalNumberQuery } from "../../students/hooks/useSearchStudentsByNationalNumberQuery";
import { useActiveEnrollStudentInScopeExecutionByStudentIdQuery } from "../../studentScopeExecutionsDetailsRegisters/hooks/useActiveEnrollStudentInScopeExecutionByStudentIdQuery";
import { useSearchGroupsQuery } from "../../groups/hooks/useSearchGroupsQuery";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks/useScopeUnitTypesQuery";
import { useStudentEnrollmentByStudentAndGroupQuery } from "../../studentEnrollments/hooks/useStudentEnrollmentByStudentAndGroupQuery";

interface DailyEvaluationFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    initialStudentId?: string;
    initialGroupId?: string;
    initialStudentName?: string;
    initialGroupName?: string;
    initialStudentEnrollmentId?: string;
}

export const DailyEvaluationForm = ({ isOpen, onClose, initialStudentId, initialGroupId, initialStudentName, initialGroupName, initialStudentEnrollmentId }: DailyEvaluationFormProps = {}) => {
    const store = useDailyEvaluationStore();
    const isFormOpen = isOpen !== undefined ? isOpen : store.isFormOpen;
    const closeForm = onClose !== undefined ? onClose : store.closeForm;
    const selectedIds = store.selectedIds;
    const { data: listResponse } = useDailyEvaluationsQuery();

    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;
    const evaluations = Array.isArray(listResponse) ? listResponse : ((listResponse as any)?.Value || []);
    const selectedItem = isEditing ? evaluations.find((x: any) => (x.Id || x.ID) === editId) : null;

    const createMutation = useCreateDailyEvaluationMutation();
    const updateMutation = useUpdateDailyEvaluationMutation();

    const { control, handleSubmit, reset, watch, setValue, formState, setError, clearErrors } = useForm<any>({
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
            LevelID: 6
        },
    });

    // Watch dependencies
    const selectedGroupId = watch("GroupID");
    const selectedStudentId = watch("StudentID");
    const selectedEnrollmentId = watch("StudentEnrollmentID");
    const selectedMatterId = watch("MatterID");

    // Preload dependencies
    const { data: specificEnrollmentRes } = useStudentEnrollmentByStudentAndGroupQuery(
        !isEditing ? selectedStudentId : null,
        !isEditing ? selectedGroupId : null
    );
    const specificEnrollment = (specificEnrollmentRes as any)?.Value || specificEnrollmentRes;

    // Derived StudentEnrollment resolver (only if we don't have an initial one)
    useEffect(() => {
        if (initialStudentEnrollmentId) return; // Don't override if we already have it
        
        if (!isEditing && selectedGroupId && selectedStudentId && specificEnrollment) {
            setValue(
                "StudentEnrollmentID",
                specificEnrollment.StudentEnrollmentID || specificEnrollment.studentEnrollmentID || "",
                { shouldValidate: true }
            );
        } else if (!isEditing && (!selectedGroupId || !selectedStudentId)) {
            setValue("StudentEnrollmentID", "", { shouldValidate: true });
        }
    }, [selectedGroupId, selectedStudentId, specificEnrollment, isEditing, setValue, initialStudentEnrollmentId]);

    const { data: formContextRes, isFetching: isContextFetching } = useDailyEvaluationFormContextQuery(
        !isEditing ? selectedEnrollmentId : null,
        !isEditing ? selectedMatterId : null
    );

    const formContext = Array.isArray(formContextRes) ? formContextRes : ((formContextRes as any)?.value || (formContextRes as any)?.Value || formContextRes);
    useEffect(() => {
        if (!isEditing && isFormOpen && formContext && !isContextFetching) {
            const NextFrom = formContext.NextFrom ?? formContext.NextFrom ?? 1;
            if (NextFrom !== null && NextFrom !== undefined) {
                setValue("From", Number(NextFrom), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                setValue("To", Number(NextFrom), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
            const unitTypeId = formContext.scopeUnitTypeID ?? formContext.ScopeUnitTypeID;
            if (unitTypeId) {
                setValue("UnitTypeID", unitTypeId, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
        }
        console.log(formContext);
    }, [formContext, isContextFetching, isEditing, isFormOpen, setValue]);

    const toValue = watch("To");
    useEffect(() => {
        if (!isEditing && formContext) {
            const scopeTo = formContext.scopeTo ?? formContext.ScopeTo;
            const lastEvalTo = formContext.lastEvaluationTo ?? formContext.LastEvaluationTo;
            const numToValue = Number(toValue);

            let hasError = false;

            if (scopeTo !== null && scopeTo !== undefined && numToValue > Number(scopeTo)) {
                setError("To", { type: "manual", message: `يجب أن يكون أصغر أو يساوي ${scopeTo}` });
                hasError = true;
            } else if (lastEvalTo !== null && lastEvalTo !== undefined && numToValue <= Number(lastEvalTo)) {
                setError("To", { type: "manual", message: `يجب أن يكون أكبر تماماً من تقييمه السابق (${lastEvalTo})` });
                hasError = true;
            }

            if (!hasError && formState.errors.To?.type === "manual") {
                clearErrors("To");
            }
        }
    }, [toValue, formContext, isEditing, setError, clearErrors, formState.errors.To]);

    // Use the active ScopeExecution based on studentId to get all mapped matters
    const { data: activeEnrollmentRes, isFetching: isMatterSearching } = useActiveEnrollStudentInScopeExecutionByStudentIdQuery(
        !isEditing && selectedStudentId ? selectedStudentId : null
    );

    const comboList = Array.isArray(activeEnrollmentRes) ? activeEnrollmentRes : ((activeEnrollmentRes as any)?.Value || []);
    
    // Extract matter options and map them properly from the EnrollmentStudentDetailComboDto
    const matterOptions = comboList.map((detail: any) => ({
        Id: detail.MatterID || detail.matterID || detail.MatterId || detail.matterId || detail.ScopeExecutionDetailID || detail.scopeExecutionDetailID || detail.scopeExecutionDetailId, 
        Name: `${detail.MatterName || detail.matterName || "?"}`,
        ScopeExecutionDetailID: detail.ScopeExecutionDetailID || detail.scopeExecutionDetailID || detail.scopeExecutionDetailId,
        MatterID: detail.MatterID || detail.matterID || detail.MatterId || detail.matterId,  
        ScopeFrom: detail.ScopeFrom !== undefined ? detail.ScopeFrom : detail.scopeFrom,
        ScopeTo: detail.ScopeTo !== undefined ? detail.ScopeTo : detail.scopeTo
    }));

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
                LevelID: selectedItem.LevelID !== undefined ? selectedItem.LevelID : 6
            });
        } else if (!isEditing) {
            reset({
                GroupID: initialGroupId || "",
                StudentID: initialStudentId || "",
                StudentEnrollmentID: initialStudentEnrollmentId || "",
                Date: new Date().toISOString().split("T")[0],
                From: 0,
                To: 0,
                UnitTypeID: "",
                MatterID: "",
                LevelID: 6
            });
            setStudentSearch("");
            setGroupSearch("");
        }
    }, [isEditing, selectedItem, reset, isFormOpen, initialGroupId, initialStudentId, initialStudentEnrollmentId]);

    const handleClose = () => {
        closeForm();
        reset();
    };

    const onSubmit = (data: any) => {
        const scopeTo = formContext?.scopeTo ?? formContext?.ScopeTo;
        const lastEvalTo = formContext?.lastEvaluationTo ?? formContext?.LastEvaluationTo;
        const numTo = Number(data.To);

        if (!isEditing && formContext) {
            if (scopeTo !== null && scopeTo !== undefined && numTo > scopeTo) {
                setError("To", { type: "manual", message: `يجب أن يكون أصغر أو يساوي ${scopeTo}` });
                return;
            }
            if (lastEvalTo !== null && lastEvalTo !== undefined && numTo <= lastEvalTo) {
                setError("To", { type: "manual", message: `يجب أن يكون أكبر تماماً من تقييمه السابق (${lastEvalTo})` });
                return;
            }
        }

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
                                        isOptionEqualToValue={(option, value) => (option.MatterID || option.Id) === (value?.MatterID || value?.Id || value)}
                                        loading={isMatterSearching}
                                        onChange={(e, newValue: any) => {
                                             field.onChange(newValue ? (newValue.MatterID || newValue.Id) : "");
                                             // Optionally set ScopeExecutionDetailID if we wanted it, but it uses MatterID in backend
                                        }}
                                        value={matterOptions.find((opt: any) => (opt.MatterID || opt.Id) === field.value) || null}
                                        disabled={!selectedEnrollmentId} // Disable if no student is selected
                                        renderOption={(props, option: any) => (
                                            <li {...props} key={option.ScopeExecutionDetailID || option.Id}>
                                                <Typography variant="body1" fontWeight="bold">{option.Name}</Typography>
                                            </li>
                                        )}
                                        renderInput={(params) => <TextField {...params} label="المادة / نطاق التسميع" error={!!fieldState.error} helperText={fieldState.error?.message || (!selectedEnrollmentId ? "يرجى تعيين الطالب أولاً" : "")} />}
                                    />
                                )}
                            />

                        {!isEditing && (
                            <>
                                {/* Group Selection */}
                                {initialGroupId && initialGroupName ? (
                                    <TextField label="المجموعة" value={initialGroupName} InputProps={{ readOnly: true }} fullWidth />
                                ) : (
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
                                )}

                                {/* Student Selection */}
                                {initialStudentId && initialStudentName ? (
                                    <TextField label="الطالب" value={initialStudentName} InputProps={{ readOnly: true }} fullWidth />
                                ) : (
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
                                )}
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
                                    <MenuItem value={1}>ضعيف جدا</MenuItem>
                                    <MenuItem value={2}>ضعيف</MenuItem>
                                    <MenuItem value={3}>متوسط</MenuItem>
                                    <MenuItem value={4}>جيد</MenuItem>
                                    <MenuItem value={5}>جيد جدا</MenuItem>
                                    <MenuItem value={6}>ممتاز</MenuItem>
                                </TextField>
                            )}
                        />

                        <Box display="flex" gap={2}>
                            <Controller
                                name="From"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField {...field} type="number" label="من (رقم الصفحة/الوحدة)" InputProps={{ readOnly: true }} error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                                )}
                            />
                            <Controller
                                name="To"
                                control={control}
                                render={({ field, fieldState }) => {
                                    let helperMsg = fieldState.error?.message;
                                    if (!helperMsg && !isEditing && formContext) {
                                        const scopeTo = formContext?.scopeTo ?? formContext?.ScopeTo;
                                        const lastEvalTo = formContext?.lastEvaluationTo ?? formContext?.LastEvaluationTo;
                                        if (scopeTo !== null && scopeTo !== undefined) {
                                            if (lastEvalTo !== null && lastEvalTo !== undefined) {
                                                helperMsg = `النطاق المسموح: أكبر من ${lastEvalTo} وأصغر أو يساوي ${scopeTo}`;
                                            } else {
                                                helperMsg = `أقصى حد مسموح: ${scopeTo}`;
                                            }
                                        }
                                    }

                                    return (
                                        <TextField
                                            {...field}
                                            type="number"
                                            label="إلى"
                                            error={!!fieldState.error}
                                            helperText={helperMsg || ""}
                                            fullWidth
                                        />
                                    );
                                }}
                            />
                        </Box>

                        <Controller
                            name="Date"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} type="date" label="التاريخ" InputLabelProps={{ shrink: true }} inputProps={{ max: new Date().toISOString().split("T")[0] }} error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
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
