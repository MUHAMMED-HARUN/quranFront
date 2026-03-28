import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { useScopeExecutionDetailStore } from "../store/scopeExecutionDetailStore";
import { useScopeExecutionDetailQuery } from "../hooks/useScopeExecutionDetails";

export const ScopeExecutionDetailCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useScopeExecutionDetailStore();

    const isSingleSelection = selectedIds.length === 1;
    const detailId = isSingleSelection ? selectedIds[0] : null;

    const { data: response, isLoading, isError } = useScopeExecutionDetailQuery(detailId);

    if (!isCardOpen) return null;

    const handleClose = () => {
        closeCard();
    };

    if (!isSingleSelection) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>تنبيه</DialogTitle>
                <DialogContent>
                    <Typography>الرجاء تحديد تفصيل تنفيذ واحد فقط لعرض بياناته.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (isLoading) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    if (isError || !response) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <Typography color="error">حدث خطأ أثناء تحميل بيانات تفصيل التنفيذ.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const detail = (response as any)?.Value || response;

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                بيانات تفصيل التنفيذ
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List disablePadding>
                    <ListItem>
                        <ListItemText primary="معرف التنفيذ (Scope Execution)" secondary={detail.ScopeExecution?.Name || detail.ScopeExecutionID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المجموعة (Group)" secondary={detail.Group?.GroupName || detail.GroupID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المادة (Matter)" secondary={detail.Matter?.MatterName || detail.MatterID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="النطاق من (Scope From)" secondary={detail.ScopeFrom || "-"} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="النطاق إلى (Scope To)" secondary={detail.ScopeTo || "-"} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="نوع الوحدة (Unit Type)" secondary={detail.ScopeUnitType?.Name || detail.ScopeUnitTypeID || "-"} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="ملاحظات" secondary={detail.Notes || "لا توجد ملاحظات"} />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} variant="contained" color="primary">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
};
