import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { StudentScopeExecutionsDetailsRegisterTable } from "../components/StudentScopeExecutionsDetailsRegisterTable";

export const StudentScopeExecutionsDetailsRegistersPage = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    إدارة تسجيل طلاب التفاصيل
                </Typography>
            </Box>

            <StudentScopeExecutionsDetailsRegisterTable />

        </Container>
    );
};
