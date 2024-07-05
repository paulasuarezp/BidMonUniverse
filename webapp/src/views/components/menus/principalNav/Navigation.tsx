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
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// #region COMPONENT NavigationMenu
// Menú de navegación principal, en el móvil se muestran menos opciones
export default function NavigationMenu() {
    const [value, setValue] = React.useState('logued');
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    /**
     * 
     * @param event 
     * @param newValue 
     */
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


    useEffect(() => {
        const path = location.pathname.replace('/', '');

        if (path === '') setValue('logued');
        else {
            if (path.includes('bid') && !isMobile) setValue('auctions');
            else if (path.includes('auction') && !isMobile) setValue('auctions');
            else if (path.includes('card')) setValue('album');
            else if (path.includes('transaction') && !isMobile) setValue('transactions');
            else if (path.includes('shop')) setValue('shop');
            else if (path.includes('album')) setValue('album');
            else
                setValue('logued');
        }
    }, [location.pathname]);

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="Navegación principal"
                TabIndicatorProps={{ style: { height: '3px', bottom: '10px' } }}
                sx={{
                    '& .MuiTab-root:focus': {
                        outline: '2px solid #000',
                    }
                }}
            >
                <Tab icon={<HomeIcon />} value="logued" iconPosition="start" aria-label="Ir a Inicio" onClick={() => navigate('/logued')} />
                <Tab icon={<CollectionsIcon />} value="album" iconPosition="start" label={isMobile ? '' : 'Mi colección'} aria-label="Ir a Mi colección" onClick={() => navigate('/album')} />
                <Tab icon={<StoreIcon />} value="shop" iconPosition="start" label={isMobile ? '' : 'Tienda'} aria-label="Ir a Tienda" onClick={() => navigate('/shop')} />
                {!isMobile && <Tab icon={<GavelIcon />} iconPosition="start" value="auctions" label='Subastas' aria-label="Ir a Subastas" onClick={() => navigate('/auctions')} />}
                {!isMobile && <Tab icon={<HistoryIcon />} iconPosition="start" value="transactions" label='Histórico de transacciones' aria-label="Ir a Histórico de transacciones" onClick={() => navigate('/transactions')} />}
            </Tabs>
        </Box>
    );
}
// #endregion