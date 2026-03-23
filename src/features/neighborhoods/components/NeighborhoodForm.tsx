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
import { useNeighborhoodStore } from "../store/neighborhoodStore";
import { useCreateNeighborhoodMutation, useUpdateNeighborhoodMutation, useNeighborhoodQuery } from "../hooks";
import { useDistrictsQuery } from "../../districts/hooks";

export const NeighborhoodForm: React.FC = () => {
    const { isFormOpen, closeForm, selectedIds, clearSelection } = useNeighborhoodStore();
    const isEditing = selectedIds.length === 1;
    const editId = isEditing ? selectedIds[0] : null;

    const { data: neighborhoodData, isLoading: isLoadingNeighborhood } = useNeighborhoodQuery(editId);
    const { data: districtsData, isLoading: isLoadingDistricts } = useDistrictsQuery();

    const createMutation = useCreateNeighborhoodMutation();
    const updateMutation = useUpdateNeighborhoodMutation();

    const [formData, setFormData] = useState({
        NeighborhoodName: "",
        DistrictID: "",
    });

    const [errorMsg, setErrorMsg] = useState("");

    const districts = districtsData?.Value || districtsData || [];
    const districtArray = Array.isArray(districts) ? districts : [];

    useEffect(() => {
        if (isEditing && neighborhoodData) {
            const data = neighborhoodData.Value || neighborhoodData;
            setFormData({
                NeighborhoodName: data.NeighborhoodName || "",
                DistrictID: data.DistrictID || "",
            });
        } else {
            setFormData({ NeighborhoodName: "", DistrictID: "" });
        }
        setErrorMsg("");
    }, [isEditing, neighborhoodData, isFormOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.NeighborhoodName.trim() || !formData.DistrictID) {
            setErrorMsg("الرجاء إدخال اسم الحي واختيار المنطقة.");
            return;
        }

        setErrorMsg("");
        try {
            if (isEditing) {
                await updateMutation.mutateAsync({
                    NeighborhoodID: editId!,
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
        setFormData({ NeighborhoodName: "", DistrictID: "" });
        setErrorMsg("");
    };

    if (isEditing && isLoadingNeighborhood) {
        return null;
    }

    return (
        <Dialog open={isFormOpen} onClose={handleClose} fullWidth maxWidth="sm" dir="rtl">
            <DialogTitle>{isEditing ? "تعديل الحي" : "إضافة حي"}</DialogTitle>
            <DialogContent dividers>
                {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

                <TextField
                    select
                    margin="dense"
                    label="المنطقة/القضاء"
                    name="DistrictID"
                    fullWidth
                    variant="outlined"
                    value={formData.DistrictID}
                    onChange={handleChange}
                    disabled={isLoadingDistricts}
                    sx={{ mb: 2 }}
                >
                    {districtArray.map((district: any) => (
                        <MenuItem key={district.DistrictID} value={district.DistrictID}>
                            {district.DistrictName}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    margin="dense"
                    label="اسم الحي"
                    name="NeighborhoodName"
                    fullWidth
                    variant="outlined"
                    value={formData.NeighborhoodName}
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
