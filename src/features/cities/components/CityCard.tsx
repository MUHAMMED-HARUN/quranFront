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
import { useCityStore } from "../store/cityStore";
import { useCityQuery } from "../hooks";

export const CityCard = () => {
    const { isCardOpen, closeCard, cardEntityId } = useCityStore();

    const { data: cityResponse, isLoading } = useCityQuery(cardEntityId);

    // Determine actual city data from TResult wrapper
    // Using generic `any` for safety during transitional steps, structure is expected to be { Value: City } or City
    const city = (cityResponse as any)?.Value || cityResponse;

    return (
        <Dialog open={isCardOpen} onClose={closeCard} maxWidth="sm" fullWidth>
            <DialogTitle>تفاصيل المدينة</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : city ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="body1">
                            <strong>المعرف (ID):</strong> {city.CityID}
                        </Typography>
                        <Typography variant="body1">
                            <strong>اسم المدينة:</strong> {city.CityName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>رمز المدينة:</strong> {city.CityCode}
                        </Typography>
                        <Typography variant="body1">
                            <strong>المعرف الخاص بالدولة:</strong> {city.CountryID}
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
