import CollectionsIcon from '@mui/icons-material/Collections';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavigationMenu() {
    const [value, setValue] = React.useState('logued');
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        switch (newValue) {
            case 'logued':
                navigate('/logued');
                break;
            case 'album':
                navigate('/album');
                break;
            case 'shop':
                navigate('/shop');
                break;
            case 'auctions':
                navigate('/auctions');
                break;
            case 'transactions':
                navigate('/transactions');
                break;
        }
    };


    React.useEffect(() => {
        const path = location.pathname.replace('/', '');

        if (path === '') setValue('logued');
        else {
            if (path.includes('bid')) setValue('auctions');
            else if (path.includes('auction')) setValue('auctions');
            else if (path.includes('card')) setValue('album');
            else if (path.includes('transaction')) setValue('transactions');
            else
                setValue(path);
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
                <Tab icon={<HomeIcon />} value="logued" iconPosition="start" />
                <Tab icon={<CollectionsIcon />} value="album" iconPosition="start" label={isMobile ? '' : 'Mi colección'} />
                <Tab icon={<StoreIcon />} value="shop" iconPosition="start" label={isMobile ? '' : 'Tienda'} />
                {!isMobile && <Tab icon={<GavelIcon />} iconPosition="start" value="auctions" label='Subastas' />}
                {!isMobile && <Tab icon={<HistoryIcon />} iconPosition="start" value="transactions" label='Histórico de transacciones' />}
            </Tabs>
        </Box>
    );
}
