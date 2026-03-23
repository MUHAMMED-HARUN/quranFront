import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import { useCityStore } from "../store/cityStore";
import {
  useCreateCityMutation,
  useUpdateCityMutation,
  useCityQuery,
} from "../hooks";
import { CreateCitySchema, UpdateCitySchema } from "../types/city.validators";
import { countryService } from "../../countries/services/countryService";
import { Country } from "../../countries/types";
import { useSearchCountriesQuery } from "../../countries/hooks";
import { Autocomplete, CircularProgress } from "@mui/material";

export const CityForm = () => {
  const { isFormOpen, closeForm, selectedIds, filters } = useCityStore();

  const isEditing = selectedIds.length === 1;
  const editId = isEditing ? selectedIds[0] : null;

  const Schema = isEditing ? UpdateCitySchema : CreateCitySchema;

  const { data: cityResponse, isLoading: isLoadingCity } = useCityQuery(editId);
  const createMutation = useCreateCityMutation();
  const updateMutation = useUpdateCityMutation();

  const [selectedCountryObj, setSelectedCountryObj] = useState<Country | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: searchResults, isFetching: isSearching } = useSearchCountriesQuery(debouncedTerm);
  const options: Country[] = (searchResults as any)?.Value || [];

  const { control, handleSubmit, reset, setValue, formState } = useForm<any>({
    resolver: zodResolver(Schema),
    defaultValues: {
      CityID: "",
      CountryID: "", // This is hidden from user but required for API
      CityName: "",
      CityCode: "",
    },
  });

  useEffect(() => {
    if (isEditing && cityResponse) {
      const c = (cityResponse as any)?.Value || cityResponse;
      if (c && c.CityID) {
        reset({
          CityID: c.CityID,
          CountryID: c.CountryID,
          CityName: c.CityName,
          CityCode: c.CityCode || "",
        });

        // Fetch the Country to show its name in the CardWithFilter
        if (c.CountryID) {
          countryService
            .getById(c.CountryID)
            .then((res) => {
              const cntry = (res as any)?.Value || res;
              setSelectedCountryObj(cntry);
            })
            .catch(() => setSelectedCountryObj(null));
        }
      }
    } else if (!isEditing) {
      // Auto-Fill Form from Filters (Requirement from Pages & Tables Design Pattern)
      const defaultCountryID = filters.CountryID || "";
      reset({
        CityID: "",
        CountryID: defaultCountryID,
        CityName: "",
        CityCode: "",
      });

      if (defaultCountryID) {
        countryService
          .getById(defaultCountryID)
          .then((res) => {
            const cntry = (res as any)?.Value || res;
            setSelectedCountryObj(cntry);
          })
          .catch(() => setSelectedCountryObj(null));
      } else {
        setSelectedCountryObj(null);
      }
    }
  }, [isEditing, cityResponse, reset, filters.CountryID]);

  const handleClose = () => {
    closeForm();
    reset();
    setSelectedCountryObj(null);
  };

  const onSubmit = (data: any) => {
    if (isEditing) {
      updateMutation.mutate(data as any, {
        onSuccess: () => handleClose(),
      });
    } else {
      createMutation.mutate(data as any, {
        onSuccess: () => handleClose(),
      });
    }
  };

  const onError = (err: any) => console.log("Validation Errors: ", err);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "تعديل بيانات المدينة" : "إضافة مدينة جديدة"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogContent dividers>
          {isLoadingCity && isEditing ? (
            <Box display="flex" justifyContent="center">
              جاري التحميل...
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
              {/* FOREIGN KEY SECTION: Autocomplete Search */}
              <Autocomplete
                options={options}
                getOptionLabel={(option) => option.CountryName || ""}
                isOptionEqualToValue={(option, value) => option.CountryID === value?.CountryID}
                value={selectedCountryObj}
                loading={isSearching}
                noOptionsText="لا توجد نتائج تطابق بحثك"
                loadingText="جاري البحث عن الدول..."
                onInputChange={(event, newInputValue) => {
                  setSearchTerm(newInputValue);
                }}
                onChange={(event, newValue) => {
                  setSelectedCountryObj(newValue);
                  setValue("CountryID", newValue ? newValue.CountryID : "", {
                    shouldValidate: true,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ابحث عن الدولة (اكتب أول حروف من اسم الدولة)"
                    variant="outlined"
                    error={!!formState.errors.CountryID}
                    helperText={formState.errors.CountryID?.message as string}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.CountryID}>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body1">{option.CountryName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        الكود: {option.CountryCode}
                      </Typography>
                    </Box>
                  </li>
                )}
              />

              <Controller
                name="CityName"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="اسم المدينة"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="CityCode"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="رمز المدينة"
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
            disabled={isSaving || (isLoadingCity && isEditing)}
          >
            {isSaving ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
