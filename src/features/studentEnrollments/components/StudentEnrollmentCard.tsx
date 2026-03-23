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
import { useStudentEnrollmentStore } from "../store/studentEnrollmentStore";
import { useStudentEnrollmentQuery } from "../hooks";

export const StudentEnrollmentCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useStudentEnrollmentStore();

    const isSingleSelection = selectedIds.length === 1;
    const enrollmentId = isSingleSelection ? selectedIds[0] : null;

    const { data: response, isLoading, isError } = useStudentEnrollmentQuery(enrollmentId);

    if (!isCardOpen) return null;

    const handleClose = () => {
        closeCard();
    };

    if (!isSingleSelection) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>تنبيه</DialogTitle>
                <DialogContent>
                    <Typography>الرجاء تحديد سجل واحد فقط لعرض تفاصيله.</Typography>
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
                    <Typography color="error">حدث خطأ أثناء تحميل البيانات.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const enrollment = (response as any)?.Value || response;

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                بيانات التسجيل
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List disablePadding>
                    <ListItem>
                        <ListItemText primary="رقم سسجل الطالب (هوية)" secondary={enrollment.Student?.NationalNumber || enrollment.StudentID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المجموعة" secondary={enrollment.Group?.GroupName || enrollment.GroupID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="تاريخ الانضمام" secondary={new Date(enrollment.Date).toLocaleDateString()} />
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
