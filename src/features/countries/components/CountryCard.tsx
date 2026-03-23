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
} from "@mui/material";
import { useCountryStore } from "../store/countryStore";
import { useCountryQuery } from "../hooks";

export const CountryCard = () => {
    const { isCardOpen, closeCard, cardEntityId } = useCountryStore();

    const { data: countryResponse, isLoading } = useCountryQuery(cardEntityId);

    const country = countryResponse?.Value;

    return (
        <Dialog open={isCardOpen} onClose={closeCard} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل الدولة</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : country ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="body1">
                            <strong>المعرف (ID):</strong> {country.CountryID}
                        </Typography>
                        <Typography variant="body1">
                            <strong>اسم الدولة:</strong> {country.CountryName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>رمز الدولة:</strong> {country.CountryCode}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body1" color="error">
                        لم يتم العثور على البيانات
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCard} color="primary">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};
