import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import {
    Public as PublicIcon,
    LocationCity as LocationCityIcon,
    Map as MapIcon,
    HomeWork as HomeWorkIcon,
    People as PeopleIcon,
    Domain as DomainIcon,
    AccountTree as AccountTreeIcon,
    MenuBook as MenuBookIcon,
    Class as ClassIcon,
    SyncAlt as SyncAltIcon,
    School as SchoolIcon,
    CastForEducation as CastForEducationIcon,
    Group as GroupIcon,
    AssignmentInd as AssignmentIndIcon,
    HowToReg as HowToRegIcon,
    Category as CategoryIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const services = [
    { title: 'الأشخاص', icon: <PeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />, path: '/persons', description: 'إدارة الأشخاص والمعلومات الشخصية' },
    { title: 'الطلاب', icon: <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />, path: '/students', description: 'إدارة الطلاب المنضمين' },
    { title: 'المعلمون', icon: <CastForEducationIcon sx={{ fontSize: 60, color: 'secondary.main' }} />, path: '/teachers', description: 'إدارة المعلمين والمشرفين' },
    { title: 'الجهات والمعاهد', icon: <DomainIcon sx={{ fontSize: 60, color: 'secondary.main' }} />, path: '/institutes', description: 'إدارة الجهات والمواقع' },
    { title: 'ارتباطات الجهات', icon: <SyncAltIcon sx={{ fontSize: 60, color: 'error.main' }} />, path: '/institute-classes', description: 'إدارة ارتباطات المعاهد بالحلقات' },
    { title: 'البرامج الأكاديمية', icon: <AccountTreeIcon sx={{ fontSize: 60, color: 'success.main' }} />, path: '/programs', description: 'إدارة البرامج الأكاديمية' },
    { title: 'المقررات/المواد', icon: <MenuBookIcon sx={{ fontSize: 60, color: 'warning.main' }} />, path: '/subjects', description: 'إدارة المواد والمقررات' },
    { title: 'المجموعات الفرعية', icon: <GroupIcon sx={{ fontSize: 60, color: 'info.main' }} />, path: '/groups', description: 'إدارة المجموعات وارتباطها' },
    { title: 'تكاليف المعلمين', icon: <AssignmentIndIcon sx={{ fontSize: 60, color: 'primary.main' }} />, path: '/teaching-assignments', description: 'تعيين المعلمين للمجموعات والمواد' },
    { title: 'تسجيل الطلاب', icon: <HowToRegIcon sx={{ fontSize: 60, color: 'secondary.main' }} />, path: '/student-enrollments', description: 'تسجيل الطلاب في المجموعات' },
    { title: 'الحلقات', icon: <ClassIcon sx={{ fontSize: 60, color: 'success.main' }} />, path: '/classes', description: 'إدارة الحلقات الدراسية' },
    { title: 'إدارة الدول', icon: <PublicIcon sx={{ fontSize: 60, color: 'primary.main' }} />, path: '/countries', description: 'إضافة، تعديل وحذف الدول' },
    { title: 'إدارة المدن', icon: <LocationCityIcon sx={{ fontSize: 60, color: 'secondary.main' }} />, path: '/cities', description: 'إضافة، تعديل وحذف المدن' },
    { title: 'إدارة الأقضية/المناطق', icon: <MapIcon sx={{ fontSize: 60, color: 'success.main' }} />, path: '/districts', description: 'إضافة، تعديل وحذف المناطق' },
    { title: 'إدارة الأحياء', icon: <HomeWorkIcon sx={{ fontSize: 60, color: 'warning.main' }} />, path: '/neighborhoods', description: 'إضافة، تعديل وحذف الأحياء' },
    { title: 'أنواع وحدات النطاق', icon: <CategoryIcon sx={{ fontSize: 60, color: 'info.main' }} />, path: '/scope-unit-types', description: 'إدارة أنواع النطاق' },
    { title: 'إدارة المواد (Matters)', icon: <MenuBookIcon sx={{ fontSize: 60, color: 'secondary.main' }} />, path: '/matters', description: 'إدارة المواد والمقررات الدراسية التفصيلية' },
    { title: 'المتابعة اليومية', icon: <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main' }} />, path: '/daily-tracking', description: 'تتبع وتقييم الحفظ والمراجعة للطلاب' },
    { title: 'التقييم اليومي', icon: <AssessmentIcon sx={{ fontSize: 60, color: 'success.main' }} />, path: '/daily-evaluations', description: 'إضافة ومتابعة تقييم الطلاب اليومي بدقة' },
    { title: 'تسجيل طلاب النطاقات', icon: <HowToRegIcon sx={{ fontSize: 60, color: 'info.main' }} />, path: '/enroll-student-in-scope-executions', description: 'إدارة تسجيل الطلاب في النطاقات والفصول الدراسية' },
    { title: 'تسجيل طلاب التفاصيل', icon: <HowToRegIcon sx={{ fontSize: 60, color: 'warning.main' }} />, path: '/enroll-student-in-scope-execution-details', description: 'إدارة تسجيل الطلاب في النطاقات التفصيلية' },
];

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ mt: 2, mb: 4 }} dir="rtl">
            <Typography variant="h4" gutterBottom fontWeight="bold">
                الرئيسية
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                مرحباً بك في لوحة تحكم أكاديمية القرآن. اختر الخدمة التي تريد إدارتها.
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={4} mt={3}>
                {services.map((service, index) => (
                    <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 32px)', md: '1 1 calc(33.333% - 32px)' } }}>
                        <Card elevation={3} sx={{ borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                            <CardActionArea onClick={() => navigate(service.path)} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                {service.icon}
                                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {service.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
