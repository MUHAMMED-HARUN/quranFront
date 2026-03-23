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
import { useTeachingAssignmentStore } from "../store/teachingAssignmentStore";
import { useTeachingAssignmentQuery } from "../hooks";

export const TeachingAssignmentCard = () => {
    const { isCardOpen, closeCard, selectedIds } = useTeachingAssignmentStore();

    const isSingleSelection = selectedIds.length === 1;
    const assignmentId = isSingleSelection ? selectedIds[0] : null;

    const { data: response, isLoading, isError } = useTeachingAssignmentQuery(assignmentId);

    if (!isCardOpen) return null;

    const handleClose = () => {
        closeCard();
    };

    if (!isSingleSelection) {
        return (
            <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>تنبيه</DialogTitle>
                <DialogContent>
                    <Typography>الرجاء تحديد تكليف واحد فقط لعرض تفاصيله.</Typography>
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
                    <Typography color="error">حدث خطأ أثناء تحميل بيانات التكليف.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const assignment = (response as any)?.Value || response;

    return (
        <Dialog open={isCardOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                بيانات التكليف
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <List disablePadding>
                    <ListItem>
                        <ListItemText primary="المعلم (رقم الهوية)" secondary={assignment.Teacher?.NationalNumber || assignment.TeacherID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المجموعة" secondary={assignment.Group?.GroupName || assignment.GroupID} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="المادة" secondary={assignment.Subject?.SubjectName || assignment.SubjectID} />
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
