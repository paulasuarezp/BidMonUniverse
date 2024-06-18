import { Container as MuiContainer, ContainerProps } from '@mui/material';
import { styled } from '@mui/material/styles';

//#region STYLES
const ResponsiveContainer = styled(MuiContainer)<ContainerProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: '0.5em', // Espaciado interno para el contenido
    marginTop: '1.5em', // Margen superior para separar el contenido del borde superior
    display: 'flex', // Usa flex para facilitar el diseño responsivo
    flexDirection: 'column', // Alinea los elementos verticalmente
    width: '100vw', // Asegura que el Container ocupe todo el ancho disponible
    maxWidth: '100% !important', // Asegura que el Container no se desborde
    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho definido
    height: '100%', // Asegura que el contenedor ocupe toda la altura disponible
    '@media (max-width: 600px)': {
        padding: '0.5em', // Reduce el padding en dispositivos móviles
        marginTop: '1.5em', // Añade un margen superior en dispositivos móviles
    },
}));
//#endregion

//#region COMPONENTE CONTAINER
export default function Container({ children }: ContainerProps) {
    return (
        <ResponsiveContainer>
            {children}
        </ResponsiveContainer>
    );
}
//#endregion
