import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { useScopeUnitTypeStore } from "../store/scopeUnitTypeStore";
import { useScopeUnitTypesQuery } from "../hooks";

export const ScopeUnitTypeCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useScopeUnitTypeStore();
    const { data: allResponse } = useScopeUnitTypesQuery();

    const isSingleSelection = selectedIds.length === 1;
    const entityId = isSingleSelection ? selectedIds[0] : null;

    if (!isCardOpen) return null;

    const handleClose = () => {
        closeCard();
    };

    if (!isSingleSelection) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>تنبيه</DialogTitle>
                <DialogContent>
                    <Typography>الرجاء تحديد نوع واحد فقط لعرض تفاصيله.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const arr = (allResponse as any)?.Value || allResponse || [];
    const entity = arr.find((x: any) => x.ID === entityId);

    if (!entity) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <Typography color="error">حدث خطأ أثناء تحميل البيانات.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                بيانات النوع
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List disablePadding>
                    <ListItem>
                        <ListItemText primary="اسم الوحدة" secondary={entity.Name} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المستوى" secondary={entity.LevelNumber} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="ملاحظات" secondary={entity.Notes || "لا توجد"} />
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
