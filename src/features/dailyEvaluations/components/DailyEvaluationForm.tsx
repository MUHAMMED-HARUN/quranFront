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

import { useSearchStudentsByNationalNumberQuery } from "../../students/hooks/useSearchStudentsByNationalNumberQuery";
import { useSearchGroupsQuery } from "../../groups/hooks/useSearchGroupsQuery";
import { useScopeUnitTypesQuery } from "../../scopeUnitTypes/hooks/useScopeUnitTypesQuery";
import { useStudentEnrollmentByStudentAndGroupQuery } from "../../studentEnrollments/hooks/useStudentEnrollmentByStudentAndGroupQuery";
import { usePendingRegistersByStudentEnrollmentIdQuery } from "../../studentScopeExecutionsDetailsRegisters/hooks/usePendingRegistersByStudentEnrollmentIdQuery";

interface DailyEvaluationFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    studentId?: string;
    groupId?: string;
    studentName?: string;
    groupName?: string;
    studentEnrollmentId?: string;
    nationalNumber?: string;
}

export const DailyEvaluationForm = ({ 
    isOpen, onClose, 
    studentId: initialStudentId, groupId: initialGroupId, 
    studentName: initialStudentName, groupName: initialGroupName, 
    studentEnrollmentId: initialStudentEnrollmentId,
    nationalNumber: initialNationalNumber
}: DailyEvaluationFormProps = {}) => {
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

    const selectedGroupId = watch("GroupID");
    const selectedStudentId = watch("StudentID");
    const selectedEnrollmentId = watch("StudentEnrollmentID");
    const selectedMatterId = watch("MatterID");

    // Youtube-Style Autocomplete Pattern: Debouncing Search
    const [studentSearch, setStudentSearch] = useState("");
    const [debouncedStudentTerm, setDebouncedStudentTerm] = useState("");

    const [groupSearch, setGroupSearch] = useState("");
    const [debouncedGroupTerm, setDebouncedGroupTerm] = useState("");

    // 1. Debouncing User Inputs
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedStudentTerm(studentSearch), 500);
        return () => clearTimeout(handler);
    }, [studentSearch]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedGroupTerm(groupSearch), 500);
        return () => clearTimeout(handler);
    }, [groupSearch]);

    // 2. Fetching via CQRS Generated Search Hook
    const { data: studentsRes, isFetching: isStudentSearching } = useSearchStudentsByNationalNumberQuery(debouncedStudentTerm);
    const studentOptions = Array.isArray(studentsRes) ? studentsRes : ((studentsRes as any)?.Value || []);

    const { data: groupsRes, isFetching: isGroupSearching } = useSearchGroupsQuery(debouncedGroupTerm);
    const groupOptions = Array.isArray(groupsRes) ? groupsRes : ((groupsRes as any)?.Value || []);

    const { data: scopeUnitsRes } = useScopeUnitTypesQuery();
    const scopeUnitsOptions = Array.isArray(scopeUnitsRes) ? scopeUnitsRes : ((scopeUnitsRes as any)?.Value || []);

    // 3. Resolving Student Enrollment dynamically just like the WiForm pseudo code logic
    // if(groupId!="" && studentId!="") => Get StudentEnrollmentId
    const { data: enrollmentRes, isFetching: isEnrollmentFetching } = useStudentEnrollmentByStudentAndGroupQuery(
        (!isEditing && selectedStudentId && selectedGroupId) ? selectedStudentId : null,
        (!isEditing && selectedStudentId && selectedGroupId) ? selectedGroupId : null
    );

    useEffect(() => {
        if (initialStudentEnrollmentId || isEditing) return;
        
        const enrollmentValue = (enrollmentRes as any)?.Value || enrollmentRes;
        const validEnrollmentId = enrollmentValue && (enrollmentValue.Id || enrollmentValue.ID || enrollmentValue.StudentEnrollmentID || enrollmentValue.studentEnrollmentID);

        if (validEnrollmentId && selectedStudentId && selectedGroupId) {
            setValue("StudentEnrollmentID", validEnrollmentId, { shouldValidate: true });
        } else {
            setValue("StudentEnrollmentID", "", { shouldValidate: true });
        }
    }, [enrollmentRes, isEditing, setValue, selectedStudentId, selectedGroupId, initialStudentEnrollmentId]);

    // 4. Fetch Details Matters using current StudentEnrollmentId
    // DetailMatters.DataSource = GetStudentScopeExecutionDetailMatters(studentEnrollmentId)
    const { data: pendingRegistersRes, isFetching: isMatterFetching } = usePendingRegistersByStudentEnrollmentIdQuery(
        !isEditing ? (initialStudentEnrollmentId || selectedEnrollmentId) : null
    );

    const comboList = Array.isArray(pendingRegistersRes) ? pendingRegistersRes : ((pendingRegistersRes as any)?.Value || []);
    
    const matterOptions = comboList.map((detail: any) => ({
        MatterID: detail.MatterID || detail.matterID || detail.Id || detail.ID,  
        MatterName: detail.MatterName || detail.matterName || "?",
        ScopeExecutionDetailID: detail.ScopeExecutionDetailID || detail.scopeExecutionDetailID
    }));

    // Form Context handling for filling From/To bounds
    const { data: formContextRes, isFetching: isContextFetching } = useDailyEvaluationFormContextQuery(
        !isEditing ? (initialStudentEnrollmentId || selectedEnrollmentId) : null,
        !isEditing ? selectedMatterId : null
    );

    const formContext = Array.isArray(formContextRes) ? formContextRes : ((formContextRes as any)?.value || (formContextRes as any)?.Value || formContextRes);
    
    useEffect(() => {
        if (!isEditing && isFormOpen && formContext && !isContextFetching) {
            const nextFrom = formContext.NextFrom ?? formContext.nextFrom ?? 1;
            if (nextFrom !== null && nextFrom !== undefined) {
                setValue("From", Number(nextFrom), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                setValue("To", Number(nextFrom), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
            const unitTypeId = formContext.scopeUnitTypeID ?? formContext.ScopeUnitTypeID ?? formContext.UnitTypeID;
            if (unitTypeId) {
                setValue("UnitTypeID", unitTypeId, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
        }
    }, [formContext, isContextFetching, isEditing, isFormOpen, setValue]);

    const toValue = watch("To");
    useEffect(() => {
        if (!isEditing && formContext) {
            const scopeTo = formContext.scopeTo ?? formContext.ScopeTo;
            const lastEvalTo = formContext.lastEvaluationTo ?? formContext.LastEvaluationTo;
            const numToValue = Number(toValue);

            let hasError = false;

            if (scopeTo !== null && scopeTo !== undefined && numToValue > Number(scopeTo)) {
                setError("To", { type: "manual", message: `يجب أن يكون أصغر أو يساوي النطاق المسموح (${scopeTo})` });
                hasError = true;
            } else if (lastEvalTo !== null && lastEvalTo !== undefined && numToValue <= Number(lastEvalTo)) {
                setError("To", { type: "manual", message: `يجب أن يكون أكبر تماماً من التقييم السابق (${lastEvalTo})` });
                hasError = true;
            }

            if (!hasError && formState.errors.To?.type === "manual") {
                clearErrors("To");
            }
        }
    }, [toValue, formContext, isEditing, setError, clearErrors, formState.errors.To]);

    // Setup Initial/Editing state
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
        } else if (!isEditing && isFormOpen) {
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
            setDebouncedStudentTerm("");
            setDebouncedGroupTerm("");
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
            StudentEnrollmentID: data.StudentEnrollmentID || initialStudentEnrollmentId, // Fallback if internal isn't set but passed as prop
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
            <DialogTitle>{isEditing ? "تعديل التقييم" : "إضافة تقييم يومي"}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>

                        {!isEditing && formState.errors.StudentEnrollmentID && (
                            <Typography color="error" variant="body2">
                                {String(formState.errors.StudentEnrollmentID?.message || "")} - تأكد من ارتباط الطالب بالمجموعة المحددة
                            </Typography>
                        )}

                        {!isEditing && (
                            <>
                                {/* 1. Student Selection */}
                                {initialStudentId && (initialStudentName || initialNationalNumber) ? (
                                    <TextField label="الطالب" value={`${initialNationalNumber || ''} ${initialStudentName || ''}`} InputProps={{ readOnly: true }} fullWidth />
                                ) : (
                                    <Controller
                                        name="StudentID"
                                        control={control}
                                        render={({ field, fieldState }) => {
                                            const studentVal = studentOptions.find((opt: any) => (opt.Id || opt.ID || opt.StudentID) === field.value);
                                            return (
                                              <Autocomplete
                                                  options={studentOptions}
                                                  getOptionLabel={(option: any) => `${option?.NationalNumber || ''} - ${option?.FullName || option?.Name || ""}`}
                                                  isOptionEqualToValue={(option, value) => (option?.Id || option?.ID || option?.StudentID) === (value?.Id || value?.ID || value?.StudentID || value)}
                                                  loading={isStudentSearching}
                                                  onInputChange={(_, newInputValue, reason) => {
                                                      if (reason === "input" || reason === "clear") {
                                                          setStudentSearch(newInputValue);
                                                      }
                                                  }}
                                                  onChange={(_, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.StudentID) : "")}
                                                  value={studentVal || null}
                                                  renderOption={(props, option: any) => (
                                                      <li {...props} key={option.Id || option.ID || option.StudentID}>
                                                          <Box>
                                                              <Typography variant="body1" fontWeight="bold">{option.NationalNumber}</Typography>
                                                              <Typography variant="body2" color="textSecondary">{option.FullName || option.Name}</Typography>
                                                          </Box>
                                                      </li>
                                                  )}
                                                  renderInput={(params) => (
                                                      <TextField 
                                                          {...params} 
                                                          label="بحث عن الطالب (بالرقم الوطني)" 
                                                          error={!!fieldState.error} 
                                                          helperText={fieldState.error?.message} 
                                                          InputProps={{
                                                              ...params.InputProps,
                                                              endAdornment: (
                                                                  <>
                                                                    {isStudentSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                  </>
                                                              )
                                                          }}
                                                      />
                                                  )}
                                              />
                                            );
                                        }}
                                    />
                                )}

                                {/* 2. Group Selection */}
                                {initialGroupId && initialGroupName ? (
                                    <TextField label="المجموعة" value={initialGroupName} InputProps={{ readOnly: true }} fullWidth />
                                ) : (
                                    <Controller
                                        name="GroupID"
                                        control={control}
                                        render={({ field, fieldState }) => {
                                             const groupVal = groupOptions.find((opt: any) => (opt.Id || opt.ID || opt.GroupID) === field.value);
                                             return (
                                              <Autocomplete
                                                  options={groupOptions}
                                                  getOptionLabel={(option: any) => option?.GroupName ? `${option.GroupName} - ${option?.Code || ""}` : (option?.Name ? `${option.Name} - ${option?.Code || ""}` : "")}
                                                  isOptionEqualToValue={(option, value) => (option?.Id || option?.ID || option?.GroupID) === (value?.Id || value?.ID || value?.GroupID || value)}
                                                  loading={isGroupSearching}
                                                  onInputChange={(_, newInputValue, reason) => {
                                                      if (reason === "input" || reason === "clear") {
                                                          setGroupSearch(newInputValue);
                                                      }
                                                  }}
                                                  onChange={(_, newValue: any) => field.onChange(newValue ? (newValue.Id || newValue.ID || newValue.GroupID) : "")}
                                                  value={groupVal || null}
                                                  renderOption={(props, option: any) => (
                                                      <li {...props} key={option.Id || option.ID || option.GroupID}>
                                                          <Box>
                                                              <Typography variant="body1" fontWeight="bold">{option.GroupName || option.Name}</Typography>
                                                              <Typography variant="body2" color="textSecondary">{option.Code}</Typography>
                                                          </Box>
                                                      </li>
                                                  )}
                                                  renderInput={(params) => (
                                                      <TextField 
                                                          {...params} 
                                                          label="بحث عن المجموعة (الاسم)" 
                                                          error={!!fieldState.error} 
                                                          helperText={fieldState.error?.message} 
                                                          InputProps={{
                                                              ...params.InputProps,
                                                              endAdornment: (
                                                                  <>
                                                                    {isGroupSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                  </>
                                                              )
                                                          }}
                                                      />
                                                  )}
                                              />
                                             )
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {/* 3. Matter Selection (Pending Subscriptions Only) */}
                        <Controller
                            name="MatterID"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    options={matterOptions}
                                    getOptionLabel={(option: any) => option.MatterName || ""}
                                    isOptionEqualToValue={(option, value) => option.MatterID === (value?.MatterID || value)}
                                    loading={isMatterFetching || isEnrollmentFetching}
                                    onChange={(_, newValue: any) => {
                                        field.onChange(newValue ? newValue.MatterID : "");
                                    }}
                                    value={matterOptions.find((opt: any) => opt.MatterID === field.value) || null}
                                    disabled={!selectedEnrollmentId && !initialStudentEnrollmentId} // Disable if no proper enrollment is resolved
                                    renderOption={(props, option: any) => (
                                        <li {...props} key={option.MatterID}>
                                            <Typography variant="body1" fontWeight="bold">{option.MatterName}</Typography>
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="المادة / نطاق التسميع" 
                                            error={!!fieldState.error} 
                                            helperText={fieldState.error?.message || (!(selectedEnrollmentId || initialStudentEnrollmentId) ? "يرجى تعيين الطالب والمجموعة أولاً" : "")} 
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                      {(isMatterFetching || isEnrollmentFetching) ? <CircularProgress color="inherit" size={20} /> : null}
                                                      {params.InputProps.endAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />

                        {/* 4. Other Fields */}
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
                    <Button type="submit" variant="contained" disabled={isSaving || (!isEditing && !watch("StudentEnrollmentID") && !initialStudentEnrollmentId)}>
                        {isSaving ? "جاري الحفظ..." : "حفظ"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

