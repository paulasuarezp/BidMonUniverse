import dayjs from "dayjs";
import Swal from "sweetalert2";
import * as yup from "yup";

export function showError(
    errorTitle: string,
    errorMessage: string,
    f: () => any
) {
    Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: "#81c784",
    }).then((result) => {
        if (result.isConfirmed) f();
    });
}

// User validations

export function checkPasswords(pass: String, confirmPass: String) {
    if (pass === null || pass === undefined || pass.trim().length === 0)
        return false;
    return confirmPass === pass;
}

const usernameConstraints = yup
    .string()
    .matches(
        /^[a-z].*$/,
        "El nombre de usuario debe de comenzar por una letra minúscula."
    ).matches(
        /^[a-z0-9]+$/,
        "El nombre de usuario no puede contener caracteres especiales y debe de estar en minúsculas."
    )
    .min(6, "El nombre de usuario debe de tener entre 6 y 12 caracteres")
    .max(12, "El nombre de usuario debe de tener entre 6 y 12 caracteres");

export const passwordConstraints = yup
    .string()
    .matches(/^.*[0-9].*$/, "La contraseña debe contener al menos un número")
    .matches(
        /^.*[A-Z].*$/,
        "La contraseña debe contener al menos una letra mayúscula"
    )
    .matches(
        /^.*\W.*$/,
        "La contraseña debe contener al menos un caracter especial"
    )
    .min(8, "La contraseña debe de tener una longitud mínima de 8 caracteres")
    .max(24, "La contraseña debe de tener una longitud máxima de 24 caracteres");


const minDate = dayjs().subtract(120, 'year').toDate(); // Mínimo hace 120 años
const maxDate = dayjs().subtract(18, 'year').toDate(); // Máximo hace 18 años

export const birthdayConstraints =
    yup.date()
        .typeError('Debe de introducir una fecha de nacimiento válida.')
        .max(maxDate, 'Debes tener al menos 18 años de edad.')
        .min(minDate, 'La edad debe de estar comprendida entre los 18 y 120 años.')
        .required('Debe de introducir una fecha de nacimiento válida.')
    ;

export const signupValidationSchema = yup.object({
    username: usernameConstraints.required("Debe de introducir un nombre de usuario"),
    password: passwordConstraints.required("Debe de introducir una contraseña"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), ''], 'Las contraseñas deben de coincidir').required('Debe de confirmar la contraseña')
}).required();


export const passwordValidation = yup
    .object({
        password: passwordConstraints,
    })
    .required();
