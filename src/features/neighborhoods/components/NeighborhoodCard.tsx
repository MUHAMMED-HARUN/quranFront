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
import { useNeighborhoodStore } from "../store/neighborhoodStore";
import { useNeighborhoodQuery } from "../hooks";

export const NeighborhoodCard: React.FC = () => {
    const { isCardOpen, closeCard, cardEntityId } = useNeighborhoodStore();
    const { data: neighborhoodData, isLoading } = useNeighborhoodQuery(cardEntityId);

    const handleClose = () => {
        closeCard();
    };

    const neighborhood: any = neighborhoodData?.Value || neighborhoodData;

    return (
        <Dialog open={isCardOpen} onClose={handleClose} fullWidth maxWidth="sm" dir="rtl">
            <DialogTitle sx={{ fontWeight: "bold" }}>تفاصيل الحي</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : neighborhood ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                الرقم التعريفي
                            </Typography>
                            <Typography variant="body1">{neighborhood.NeighborhoodID}</Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                اسم الحي
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">{neighborhood.NeighborhoodName}</Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                المنطقة/القضاء التابع لها
                            </Typography>
                            <Typography variant="body1">{neighborhood.DistrictName}</Typography>
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
