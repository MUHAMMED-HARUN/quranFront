import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTestNominationSchema, CreateTestNominationFormValues } from "../types/testNomination.validators";
import { useScopeEnrollmentsQuery, useCreateTestNominationMutation } from "../hooks";

export interface TestNominationsFormProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  initialData: {
    StudentEnrollmentID: string;
    ScopeExecutionID?: string;
    ScopeExecutionDetailID?: string;
    NominationStatus: number;
    NominatedByPersonID?: string;
    SuggestedDate?: string;
  };
  onSuccess: () => void;
}

export const TestNominationsForm: React.FC<TestNominationsFormProps> = ({
  open,
  onClose,
  initialData,
  onSuccess,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTestNominationFormValues>({
    resolver: zodResolver(CreateTestNominationSchema),
    defaultValues: {
      StudentEnrollmentID: initialData.StudentEnrollmentID,
      ScopeExecutionID: initialData.ScopeExecutionID || null,
      ScopeExecutionDetailID: initialData.ScopeExecutionDetailID || null,
      NominationStatus: initialData.NominationStatus || 1, // default to Pending
      NominatedByPersonID: initialData.NominatedByPersonID || null,
      SuggestedDate: initialData.SuggestedDate || null,
    },
  });

  const studentEnrollmentId = watch("StudentEnrollmentID");

  const { data: scopeDataRes, isFetching } = useScopeEnrollmentsQuery(
    studentEnrollmentId,
    !!studentEnrollmentId
  );

  const scopeData = (scopeDataRes as any)?.Value || (scopeDataRes as any)?.value || [];
  const scopeExecutions = scopeData.filter((x: any) => x.Type === "ScopeExecution" || x.type === "ScopeExecution");
  const scopeExecutionDetails = scopeData.filter(
    (x: any) => x.Type === "ScopeExecutionDetail" || x.type === "ScopeExecutionDetail"
  );

  const { mutate: createNomination, isPending } = useCreateTestNominationMutation();

  useEffect(() => {
    if (open) {
      reset({
        StudentEnrollmentID: initialData.StudentEnrollmentID,
        ScopeExecutionID: initialData.ScopeExecutionID || null,
        ScopeExecutionDetailID: initialData.ScopeExecutionDetailID || null,
        NominationStatus: initialData.NominationStatus || 1,
        NominatedByPersonID: initialData.NominatedByPersonID || null,
        SuggestedDate: initialData.SuggestedDate || null,
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: CreateTestNominationFormValues) => {
    // API requires null instead of empty string
    const submitData = {
      ...data,
      ScopeExecutionID: data.ScopeExecutionID ? data.ScopeExecutionID : null,
      ScopeExecutionDetailID: data.ScopeExecutionDetailID ? data.ScopeExecutionDetailID : null,
    };

    createNomination(submitData, {
      onSuccess: (result) => {
        if ((result as any)?.IsSuccess || (result as any)?.isSuccess) {
          onSuccess();
        }
      },
      onError: (err) => console.error("Create Test Nomination Error", err),
    });
  };

  const selectedScope = watch("ScopeExecutionID");
  const selectedDetail = watch("ScopeExecutionDetailID");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ترشيح للاختبار</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, (e) => console.log("Form error", e))}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            {isFetching ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Controller
                  name="ScopeExecutionID"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.ScopeExecutionID}>
                      <InputLabel>نطاق الاختبار</InputLabel>
                      <Select
                        {...field}
                        label="نطاق الاختبار"
                        disabled={!!selectedDetail}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value) {
                            setValue("ScopeExecutionDetailID", "");
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>-- لا يوجد --</em>
                        </MenuItem>
                        {scopeExecutions.map((item: any) => (
                          <MenuItem key={item.Id || item.id} value={item.ScopeID || item.scopeID || item.ScopeId || item.scopeId}>
                            {item.TargetName || item.targetName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.ScopeExecutionID && (
                        <Typography color="error" variant="caption">
                          {errors.ScopeExecutionID.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Typography textAlign="center" fontWeight="bold">أو</Typography>

                <Controller
                  name="ScopeExecutionDetailID"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.ScopeExecutionDetailID}>
                      <InputLabel>تفصيل نطاق الاختبار</InputLabel>
                      <Select
                        {...field}
                        label="تفصيل نطاق الاختبار"
                        disabled={!!selectedScope}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value) {
                            setValue("ScopeExecutionID", "");
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>-- لا يوجد --</em>
                        </MenuItem>
                        {scopeExecutionDetails.map((item: any) => (
                          <MenuItem key={item.Id || item.id} value={item.ScopeID || item.scopeID || item.ScopeId || item.scopeId}>
                            {item.TargetName || item.targetName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.ScopeExecutionDetailID && (
                        <Typography color="error" variant="caption">
                          {errors.ScopeExecutionDetailID.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isPending}>
            إلغاء
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isPending || isFetching}>
            {isPending ? <CircularProgress size={24} /> : "ترشيح"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
