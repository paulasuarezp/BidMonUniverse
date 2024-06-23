import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminNavigationMenu() {
    const [value, setValue] = React.useState('admin');
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        switch (newValue) {
            case 'admin':
                navigate('/admin');
                break;
            case 'auctions':
                navigate('/a/auctions');
                break;
            case 'transactions':
                navigate('/a/transactions');
                break;
        }
    };


    React.useEffect(() => {
        const path = location.pathname.replace('/', '');

        if (path === '') setValue('admin');
        else {
            if (path.includes('auction')) setValue('auctions');
            else if (path.includes('transaction')) setValue('transactions');
            else
                setValue('admin');
        }
    }, [location.pathname]);

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="navigation tabs"
                TabIndicatorProps={{ style: { height: '3px', bottom: '10px' } }}
            >
                <Tab icon={<HomeIcon />} value="admin" iconPosition="start" />
                <Tab icon={<GavelIcon />} iconPosition="start" value="auctions" label='Subastas' />
                <Tab icon={<HistoryIcon />} iconPosition="start" value="transactions" label='Histórico de transacciones' />
            </Tabs>
        </Box>
    );
}
