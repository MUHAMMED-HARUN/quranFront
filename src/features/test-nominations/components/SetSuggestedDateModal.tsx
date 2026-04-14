import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useUpdateTestNominationMutation } from "../hooks/useUpdateTestNominationMutation";
import { useTestNominationsFilteredQuery } from "../hooks/useTestNominationsFilteredQuery";
import { UpdateTestNominationDTO } from "../types/testNomination.types";
import { TestNominationCard } from "./TestNominationCard";

interface Props {
  open: boolean;
  onClose: () => void;
  testNominationID: string | null;
}

export const SetSuggestedDateModal: React.FC<Props> = ({
  open,
  onClose,
  testNominationID,
}) => {
  const { data } = useTestNominationsFilteredQuery(
    { TestNominationID: testNominationID || undefined },
    { enabled: open && !!testNominationID }
  );
  const { register, handleSubmit, reset } = useForm<UpdateTestNominationDTO>();
  const mutation = useUpdateTestNominationMutation();

  useEffect(() => {
    if (data?.Value && data.Value.length > 0) {
      const nom = data.Value[0];
      reset({
        Id: nom.TestNominationID,
        StudentEnrollmentID: nom.StudentEnrollmentID || "",
        ScoreExecutionID: nom.ScopeType === "ScopeExecution" ? nom.ScopeID : null,
        ScopeExecutionDetailID:
          nom.ScopeType === "ScopeExecutionDetail" ? nom.ScopeID : null,
        NominationStatus: nom.NominationStatus,
        NominatedByPersonID: nom.NominatedByPersonID || null,
        SuggestedDate: nom.SuggestedDate
          ? new Date(nom.SuggestedDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      } as any);
    }
  }, [data, reset]);

  const onSubmit = (formData: UpdateTestNominationDTO) => {
    mutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>تعيين زمن الترشيح</DialogTitle>
      <DialogContent>
        {testNominationID && (
          <Box sx={{ mb: 3, mt: 1 }}>
            <TestNominationCard testNominationID={testNominationID} />
          </Box>
        )}
        <form id="suggestedDateForm" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="تاريخ مقترح"
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
            {...register("SuggestedDate", { required: true })}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>
          إلغاء
        </Button>
        <Button
          type="submit"
          form="suggestedDateForm"
          variant="contained"
          color="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
