import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function NavigationMenu() {
    const [value, setValue] = React.useState('inicio');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="inicio" label="Inicio" />
                <Tab value="album" label="Mi colección" />
                <Tab value="tienda" label="Tienda" />
                {!isMobile && <Tab value="subastas" label="Subastas" />}
                {!isMobile && <Tab value="transacciones" label="Histórico de transacciones" />}
            </Tabs>
        </Box>
    );
}
