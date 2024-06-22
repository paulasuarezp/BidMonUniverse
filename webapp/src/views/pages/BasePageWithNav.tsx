import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Button from "../components/buttons/Button";
import Container from "../components/container/Container";
import NavigationMenu from "../components/menus/principalNav/Navigation";
import PokeballsBox from "../components/ornament/PokeballsBox";

interface BasePageWithNavProps {
    title: string;
    description?: React.ReactNode;
    backLabel?: string;
    handleBack?: () => void;
    children: React.ReactNode;
    showBackButton?: boolean;
}
//#region COMPONENTE BASE PAGE WITH NAV
export default function BasePageWithNav({ title, description, backLabel = 'Volver', showBackButton = true, handleBack, children }: BasePageWithNavProps) {
    const sessionUser = useSelector((state: RootState) => state.user);

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let username: string = sessionUser.username;


    return (
        <Container>
            <NavigationMenu />

            <PokeballsBox titulo={title} sx={{ marginBottom: '1em', marginTop: '3em' }} />

            <Typography variant="body1" align="center" component="div" style={{ marginBottom: '1em' }}>
                {description ? description : ''}
            </Typography>

            {showBackButton && handleBack &&
                <Button startIcon={<ArrowBackIcon />}
                    variant="contained"
                    sx={{ alignSelf: 'flex-start', margin: '10px' }}
                    buttonType="ghost"
                    onClick={handleBack}
                    label={backLabel}
                />
            }

            <div style={{ marginBottom: '2em' }}>
                {children}
            </div>


        </Container>
    );
};
//#endregion
