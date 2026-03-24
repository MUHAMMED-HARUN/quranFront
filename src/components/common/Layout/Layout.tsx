import React, { useState } from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
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
    Category as CategoryIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface Props {
    children?: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'الرئيسية', icon: <HomeIcon />, path: '/' },
        { text: 'الأشخاص', icon: <PeopleIcon />, path: '/persons' },
        { text: 'الطلاب', icon: <SchoolIcon />, path: '/students' },
        { text: 'المعلمون', icon: <CastForEducationIcon />, path: '/teachers' },
        { text: 'الجهات والمعاهد', icon: <DomainIcon />, path: '/institutes' },
        { text: 'ارتباطات الجهات', icon: <SyncAltIcon />, path: '/institute-classes' },
        { text: 'البرامج الأكاديمية', icon: <AccountTreeIcon />, path: '/programs' },
        { text: 'المقررات/المواد', icon: <MenuBookIcon />, path: '/subjects' },
        { text: 'المجموعات الفرعية', icon: <GroupIcon />, path: '/groups' },
        { text: 'تكاليف المعلمين', icon: <AssignmentIndIcon />, path: '/teaching-assignments' },
        { text: 'تسجيل الطلاب', icon: <HowToRegIcon />, path: '/student-enrollments' },
        { text: 'الحلقات', icon: <ClassIcon />, path: '/classes' },
        { text: 'إدارة الدول', icon: <PublicIcon />, path: '/countries' },
        { text: 'إدارة المدن', icon: <LocationCityIcon />, path: '/cities' },
        { text: 'إدارة الأقضية', icon: <MapIcon />, path: '/districts' },
        { text: 'إدارة الأحياء', icon: <HomeWorkIcon />, path: '/neighborhoods' },
        { text: 'أنواع النطاق', icon: <CategoryIcon />, path: '/scope-unit-types' },
        { text: 'نطاقات التقييم', icon: <CategoryIcon />, path: '/assessment-scopes' },
        { text: 'تنفيذ النطاقات', icon: <CategoryIcon />, path: '/scope-executions' },
        { text: 'تفاصيل التنفيذ', icon: <CategoryIcon />, path: '/scope-execution-details' },
        { text: 'تسجيل طلاب النطاقات', icon: <HowToRegIcon />, path: '/enroll-student-in-scope-executions' },
        { text: 'التقييم اليومي', icon: <CategoryIcon />, path: '/daily-tracking' },
        { text: 'تقييمات الطلاب', icon: <CategoryIcon />, path: '/student-assessments' },
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    القائمة الرئيسية
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                            onClick={() => {
                                navigate(item.path);
                                setOpen(false);
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }} dir="rtl">
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        أكاديمية القرآن
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};
