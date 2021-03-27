import React, { useState } from "react";
import { useRouter } from 'next/router';
import Layout from "../components/Layout";
import { useFormik } from "formik"; // Validación de formularios
import * as Yup from "yup"; // Colocar mayor restircciones a las validaciones
import { useMutation, gql } from "@apollo/client";

const NUEVACUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

const NuevaCuenta = () => {

    // State para el mensaje

  const [ mensaje, guardarMensaje ] = useState(null);

  // Mutations para crear nuevos usuarios  
  const [nuevoUsuario] = useMutation(NUEVACUENTA);

  // Routing
  const router = useRouter();

  // Validación del formulario

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es Obligatorio"),
      apellido: Yup.string().required("El apellido es Obigatorio"),
      email: Yup.string()
        .email("El correo no es válido")
        .required("El email es Obligatorio"),
      password: Yup.string()
        .required("El correo es Obligatorio")
        .min(6, "El password debe ser almenos de 6 caracteres"),
    }),

    onSubmit: async (valores) => {
      console.log("enviando..");
      console.log(valores);

      const { nombre, apellido, email, password} = valores;

      try {
          const { data } = await nuevoUsuario({
              variables:{
                  input:{
                      nombre: nombre,
                      apellido: apellido,
                      email: email,
                      password: password

                  }
              }
          });
          // Usuario creado correctamente
          guardarMensaje(`Se creo correctamente el usuario: ${data.nuevoUsuario.nombre}`);
          setTimeout(()=>{
            guardarMensaje(null);

        }, 3000)
          // Redirigir usuario para iniciar sesión

          router.push('/login');
      } catch (error) {
          guardarMensaje(error.message);

          setTimeout(()=>{
              guardarMensaje(null);

          }, 3000)
          
      }
    },
  });

  const mostrarMensaje = () =>{
      return (
          <div className= "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
              <p>{mensaje}</p>

          </div>
      )
  }

  return (
    <Layout>
        {mensaje && mostrarMensaje()}
      <h1 className="text-center text-2xl text-white font-light">
        Crear Nueva Cuenta
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Ingresar nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"
                id="apellido"
                type="text"
                value={formik.values.apellido}
                onChange={formik.handleChange}
                placeholder="Ingresar apellido"
              />
            </div>

            {formik.touched.apellido && formik.errors.apellido ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Correo
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"
                id="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Ingresar correo"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"
                id="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Ingresar contraseña"
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}

            <input
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
              type="submit"
              value="Crear cuenta"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevaCuenta;
