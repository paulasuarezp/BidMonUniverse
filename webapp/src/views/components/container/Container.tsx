import { ContainerProps, Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

//#region STYLES
const ResponsiveContainer = styled(MuiContainer)<ContainerProps>(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: '0.5em', // Espaciado interno para el contenido
    marginTop: '3.5em', // Márgenes ajustados para que coincidan con el diseño de Login y Signup
    marginBottom: '1.5em', // Márgenes ajustados para que coincidan con el diseño de Login y Signup
    display: 'flex', // Usa flex para facilitar el diseño responsivo
    flexDirection: 'column', // Alinea los elementos verticalmente
    width: '100%', // Asegura que el Container ocupe todo el ancho disponible
    maxWidth: '100% !important', // Limita el ancho máximo para que coincida con el Paper
    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho definido
    height: 'auto', // Ajusta la altura automática
    marginLeft: 'auto', // Centra el container horizontalmente
    marginRight: 'auto', // Centra el container horizontalmente
    '@media (max-width: 600px)': {
        padding: '0.5em', // Reduce el padding en dispositivos móviles
        marginTop: '4.5em', // Ajusta el margen superior en dispositivos móviles
        marginBottom: '1.5em', // Ajusta el margen inferior en dispositivos móviles
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
