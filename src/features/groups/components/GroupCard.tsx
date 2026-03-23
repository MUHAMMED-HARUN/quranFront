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
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGroupStore } from "../store/groupStore";
import { useGroupQuery } from "../hooks";

// Using useInstitutesQuery and useInstituteClassesQuery to resolve names instead of IDs
import { useInstituteClassesQuery } from "../../instituteClasses/hooks";
import { useInstitutesQuery } from "../../institutes/hooks";

export const GroupCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useGroupStore();
    const navigate = useNavigate();

    const isSingleSelection = selectedIds.length === 1;
    const groupId = isSingleSelection ? selectedIds[0] : null;

    const { data: response, isLoading, isError } = useGroupQuery(groupId);
    const { data: icResponse } = useInstituteClassesQuery();
    const { data: instResponse } = useInstitutesQuery();

    if (!isCardOpen) return null;

    const handleClose = () => {
        closeCard();
    };

    if (!isSingleSelection) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>تنبيه</DialogTitle>
                <DialogContent>
                    <Typography>الرجاء تحديد مجموعة واحدة فقط لعرض تفاصيلها.</Typography>
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
                    <Typography color="error">حدث خطأ أثناء تحميل بيانات المجموعة.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const group = (response as any)?.Value || response;

    const instituteClasses = Array.isArray(icResponse) ? icResponse : ((icResponse as any)?.Value || []);
    const institutes = Array.isArray(instResponse) ? instResponse : ((instResponse as any)?.Value || []);

    const currentIC = instituteClasses.find((ic: any) => ic.InstituteClassID === group.InstituteClassID);
    const instName = currentIC ? institutes.find((i: any) => i.InstituteID === currentIC.InstituteID)?.Name : '';

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                بيانات المجموعة
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List disablePadding>
                    <ListItem>
                        <ListItemText primary="رمز المجموعة" secondary={group.Code} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="اسم المجموعة" secondary={group.GroupName} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="الحلقة الدراسية المرتبطة" secondary={currentIC?.Class?.Name || "غير معروف"} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المعهد التابع" secondary={instName || "غير معروف"} />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button
                    variant="outlined"
                    color="info"
                    onClick={() => {
                        handleClose();
                        navigate(`/student-enrollments?groupId=${group.GroupID}`);
                    }}
                >
                    عرض الطلاب المنضمين
                </Button>
                <Box>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        إغلاق
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
