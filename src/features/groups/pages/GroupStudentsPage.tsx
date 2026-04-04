import React from "react";
import { Container } from "@mui/material";
import { GroupStudentsList } from "../components/GroupStudentsList";

export const GroupStudentsPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <GroupStudentsList />
        </Container>
    );
};
