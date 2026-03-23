import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Box,
    Divider,
} from "@mui/material";
import { useDistrictStore } from "../store/districtStore";
import { useDistrictQuery } from "../hooks";

export const DistrictCard: React.FC = () => {
    const { isCardOpen, closeCard, cardEntityId } = useDistrictStore();
    const { data: districtData, isLoading } = useDistrictQuery(cardEntityId);

    const handleClose = () => {
        closeCard();
    };

    const district: any = districtData?.Value || districtData;

    return (
        <Dialog open={isCardOpen} onClose={handleClose} fullWidth maxWidth="sm" dir="rtl">
            <DialogTitle sx={{ fontWeight: "bold" }}>تفاصيل المنطقة/القضاء</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : district ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                الرقم التعريفي
                            </Typography>
                            <Typography variant="body1">{district.DistrictID}</Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                اسم المنطقة
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">{district.DistrictName}</Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                المدينة التابعة لها
                            </Typography>
                            <Typography variant="body1">{district.CityName}</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography color="error">البيانات غير متوفرة</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};
