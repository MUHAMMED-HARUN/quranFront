import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useCountryStore } from "../store/countryStore";
import {
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useCountryQuery,
} from "../hooks";
import {
  CreateCountryCommand,
  UpdateCountryCommand,
  CreateCountrySchema,
  UpdateCountrySchema,
} from "../types";

export const CountryForm = () => {
  const { isFormOpen, closeForm, selectedIds } = useCountryStore();

  const isEditing = selectedIds.length === 1;
  const editId = isEditing ? selectedIds[0] : null;

  const Schema = isEditing ? UpdateCountrySchema : CreateCountrySchema;

  const { data: countryResponse, isLoading: isLoadingCountry } =
    useCountryQuery(editId);
  const createMutation = useCreateCountryMutation();
  const updateMutation = useUpdateCountryMutation();

  const { control, handleSubmit, reset } = useForm<any>({
    resolver: zodResolver(Schema),
    defaultValues: {
      CountryID: "",
      CountryName: "",
      CountryCode: "",
    },
  });

  useEffect(() => {
    if (isEditing && countryResponse?.Value) {
      const c = countryResponse.Value;
      reset({
        CountryID: c.CountryID,
        CountryName: c.CountryName,
        CountryCode: c.CountryCode,
      });
    } else {
      reset({ CountryID: "", CountryName: "", CountryCode: "" });
    }
  }, [isEditing, countryResponse, reset]);

  const handleClose = () => {
    closeForm();
    reset();
  };

  const onSubmit = (data: any) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateCountryCommand, {
        onSuccess: () => handleClose(),
      });
    } else {
      createMutation.mutate(data as CreateCountryCommand, {
        onSuccess: () => handleClose(),
      });
    }
  };

  const onError = (err: any) => console.log("Validation Errors: ", err);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "تعديل بيانات الدولة" : "إضافة دولة جديدة"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogContent dividers>
          {isLoadingCountry && isEditing ? (
            <Box display="flex" justifyContent="center">
              جاري التحميل...
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Controller
                name="CountryName"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="اسم الدولة"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="CountryCode"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="رمز الدولة"
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
            disabled={isSaving || (isLoadingCountry && isEditing)}
          >
            {isSaving ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
