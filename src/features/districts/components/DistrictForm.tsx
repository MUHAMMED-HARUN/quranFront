import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useDistrictStore } from "../store/districtStore";
import { useCreateDistrictMutation, useUpdateDistrictMutation, useDistrictQuery } from "../hooks";
import { useCitiesQuery } from "../../cities/hooks"; // Assuming generic cities fetch exists

export const DistrictForm: React.FC = () => {
    const { isFormOpen, closeForm, selectedIds, clearSelection } = useDistrictStore();
    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const { data: districtData, isLoading: isLoadingDistrict } = useDistrictQuery(editId);
    const { data: citiesData, isLoading: isLoadingCities } = useCitiesQuery();

    const createMutation = useCreateDistrictMutation();
    const updateMutation = useUpdateDistrictMutation();

    const [formData, setFormData] = useState({
        DistrictName: "",
        CityID: "",
    });

    const [errorMsg, setErrorMsg] = useState("");

    const cities = citiesData?.Value || citiesData || [];
    const cityArray = Array.isArray(cities) ? cities : [];

    useEffect(() => {
        if (isEditing && districtData) {
            const data = districtData.Value || districtData;
            setFormData({
                DistrictName: data.DistrictName || "",
                CityID: data.CityID || "",
            });
        } else {
            setFormData({ DistrictName: "", CityID: "" });
        }
        setErrorMsg("");
    }, [isEditing, districtData, isFormOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.DistrictName.trim() || !formData.CityID) {
            setErrorMsg("الرجاء إدخال اسم المنطقة واختيار المدينة.");
            return;
        }

        setErrorMsg("");
        try {
            if (isEditing) {
                await updateMutation.mutateAsync({
                    DistrictID: editId!,
                    ...formData,
                });
            } else {
                await createMutation.mutateAsync(formData);
            }
            handleClose();
        } catch (err: any) {
            setErrorMsg(err.ErrorMessage || "حدث خطأ أثناء الحفظ");
        }
    };

    const handleClose = () => {
        closeForm();
        clearSelection();
        setFormData({ DistrictName: "", CityID: "" });
        setErrorMsg("");
    };

    if (isEditing && isLoadingDistrict) {
        return null;
    }

    return (
        <Dialog open={isFormOpen} onClose={handleClose} fullWidth maxWidth="sm" dir="rtl">
            <DialogTitle>{isEditing ? "تعديل المنطقة" : "إضافة منطقة"}</DialogTitle>
            <DialogContent dividers>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                <TextField
                    select
                    margin="dense"
                    label="المدينة"
                    name="CityID"
                    fullWidth
                    variant="outlined"
                    value={formData.CityID}
                    onChange={handleChange}
                    disabled={isLoadingCities}
                    sx={{ mb: 2 }}
                >
                    {cityArray.map((city: any) => (
                        <MenuItem key={city.CityID} value={city.CityID}>
                            {city.CityName}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    margin="dense"
                    label="اسم المنطقة/القضاء"
                    name="DistrictName"
                    fullWidth
                    variant="outlined"
                    value={formData.DistrictName}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={createMutation.isPending || updateMutation.isPending}
                >
                    {createMutation.isPending || updateMutation.isPending ? "جاري الحفظ..." : "حفظ"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
