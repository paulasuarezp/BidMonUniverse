import { Container as MuiContainer, ContainerProps} from '@mui/material';
import { styled } from '@mui/material/styles';

//#region STYLES
const ResponsiveContainer = styled(MuiContainer)<ContainerProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: '20px', // Espaciado interno para el contenido
    display: 'flex', // Usa flex para facilitar el diseño responsivo
    flexDirection: 'column', // Alinea los elementos verticalmente
    minHeight: '100vh', // Asegura que el Container ocupe al menos toda la altura de la pantalla
    width: '100vw', // Asegura que el Container ocupe todo el ancho disponible
    maxWidth: '100% !important', // Asegura que el Container no se desborde
    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho definido
    '@media (max-width: 600px)': {
      padding: '10px', // Reduce el padding en dispositivos móviles
    },
}));
//#endregion

//#region COMPONENTE CONTAINER
export default function Container({ children }:ContainerProps) {
    return (
        <ResponsiveContainer>
            {children}
        </ResponsiveContainer>
    );
}
//#endregion