import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Divider
} from "@mui/material";
import { useScopeExecutionStore } from "../store/scopeExecutionStore";
import { useScopeExecutionsQuery } from "../hooks/useScopeExecutions";

export const ScopeExecutionCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useScopeExecutionStore();
    const { data: response, isLoading } = useScopeExecutionsQuery();

    const isSingleSelection = selectedIds.length === 1;
    const executions = Array.isArray(response) ? response : ((response as any)?.Value || []);
    const item = isSingleSelection ? executions.find((x: any) => (x.Id || x.ID) === selectedIds[0]) : null;

    return (
        <Dialog open={isCardOpen} onClose={closeCard} maxWidth="sm" fullWidth>
            <DialogTitle>التفاصيل</DialogTitle>
            <DialogContent dividers>
                {isLoading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : item ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="subtitle1"><strong>الاسم:</strong> {item.Name}</Typography>
                        <Divider />
                        <Typography variant="body1"><strong>النطاق المرتبط:</strong> {item.AssessmentScopeID}</Typography>
                        <Typography variant="body1"><strong>وصف:</strong> {item.Description || "-"}</Typography>
                    </Box>
                ) : (
                    <Typography color="error">تعذر الحصول على التفاصيل.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCard} variant="contained" color="primary">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};
