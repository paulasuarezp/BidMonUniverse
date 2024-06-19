import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavigationMenu() {
    const [value, setValue] = React.useState('logued');
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (newValue === 'logued') {
            navigate('/logued');
        }
        if (newValue === 'album') {
            navigate('/album');
        }
        if (newValue === 'shop') {
            navigate('/shop');
        }
        if (newValue === 'auctions') {
            navigate('/auctions');
        }
        if (newValue === 'transactions') {
            navigate('/transactions');
        }
    };

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    React.useEffect(() => {
        const path = location.pathname.replace('/', '');
        setValue(path === '' ? 'logued' : path);
    }, [location.pathname]);

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="logued" label="Inicio" />
                <Tab value="album" label="Mi colección" />
                <Tab value="shop" label="Tienda" />
                {!isMobile && <Tab value="auctions" label="Subastas" />}
                {!isMobile && <Tab value="transactions" label="Histórico de transacciones" />}
            </Tabs>
        </Box>
    );
}
