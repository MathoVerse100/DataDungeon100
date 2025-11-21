import { Link, Navigate, useNavigate } from "react-router-dom";
import { hidePasswordLogo, showPasswordLogo } from "../assets/assets";
import Layout from "../layouts/layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type RegisterValues = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterValues>();

  async function onSubmit(data: RegisterValues) {
    try {
      await axios.post("http://localhost:8000/api/auth/register", data, {
        withCredentials: true,
      });

      navigate("/login", { replace: true });
    } catch (error: any) {
      if (error.response.status === 400) {
        setError("first_name", {
          type: "400",
          message: error.response.data.detail.first_name_error ?? "",
        });

        setError("last_name", {
          type: "400",
          message: error.response.data.detail.last_name_error ?? "",
        });

        setError("username", {
          type: "400",
          message: error.response.data.detail.username_error ?? "",
        });

        setError("email", {
          type: "400",
          message: error.response.data.detail.email_error ?? "",
        });

        setError("password", {
          type: "400",
          message: error.response.data.detail.password_error ?? "",
        });
      } else if (error.response.status === 409) {
        setError("username", {
          type: "409",
          message: error.response.data.detail.username_error
            ? error.response.data.detail.username_error.message
            : "",
        });

        setError("first_name", {
          type: "409",
          message: error.response.data.detail.first_last_error
            ? error.response.data.detail.first_last_error.message
            : "",
        });
      }
    }
  }

  const { isLoading, isError, error } = useQuery({
    queryKey: ["getLogin"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/api/auth/login", {
        withCredentials: true,
      });
      return response.data;
    },
    retry: false,
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    type: "password",
    logo: hidePasswordLogo,
  });

  function togglePasswordVisibility() {
    if (passwordVisibility.type === "password") {
      setPasswordVisibility({ type: "text", logo: showPasswordLogo });
    } else {
      setPasswordVisibility({ type: "password", logo: hidePasswordLogo });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    console.error("Error:", error.message);
    return <Navigate to="/explore" replace />;
  }

  return (
    <Layout hideInnerSidebar={true}>
      <Layout.Main>
        <div
          className="
                relative flex-1 min-w-[15rem] border-r border-r-gray-800
                h-[calc(100vh-4.6875rem)]
                overflow-y-auto overflow-x-hidden
                [scrollbar-gutter:stable]
                [scrollbar-width:thin] [scrollbar-color:#555_#111]
                [&::-webkit-scrollbar]:w-[8px]
                [&::-webkit-scrollbar-track]:bg-[#111]
                [&::-webkit-scrollbar-thumb]:bg-[#555]
                [&::-webkit-scrollbar-thumb:hover]:bg-[#666]
                [&::-webkit-scrollbar-button]:hidden
            "
        >
          <div className="p-[1.5em] w-full min-h-full flex flex-row justify-center items-center bg-black/50 border-black">
            <div className="p-[1em] max-w-[40rem] flex-1 bg-gray-800/50 rounded-[2.5rem]">
              <section className="p-[1em] [@media(min-width:480px)]:p-[2em] w-full flex flex-col justify-stretch items-center">
                <header className="font-sans font-bold text-4xl [@media(min-width:480px)]:text-5xl text-white">
                  Register
                </header>

                <span className="mt-[2em] self-start text-white text-sm">
                  Already have an account?{" "}
                  <Link to="/login/" className="underline text-blue-600">
                    Login
                  </Link>
                  .
                </span>
                <ul className="mt-[2em] ml-[1em] self-start list-disc text-gray-400 text-sm">
                  <li>Names, username, and email must be unique.</li>
                  <li>Password: 5-255 characters.</li>
                  <li>
                    Names: 3-100 chars, letters & underscore only (case
                    sensitive).
                  </li>
                  <li>
                    Username: 5-100 chars, letters & underscore only (case
                    insensitive).
                  </li>
                </ul>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-[2em] w-full flex flex-col justify-stretch items-start gap-[0.5em]"
                >
                  {errors.first_name?.message &&
                  errors.first_name?.type === "409" ? (
                    <span className="text-xs text-red-500 font-sans font-bold">
                      *Error: {errors.first_name?.message}
                    </span>
                  ) : (
                    <></>
                  )}

                  {errors.username?.message &&
                  errors.username?.type === "409" ? (
                    <span className="text-xs text-red-500 font-sans font-bold">
                      *Error: {errors.username?.message}
                    </span>
                  ) : (
                    <></>
                  )}

                  <div className="flex flex-col justify-start items-start [@media(min-width:480px)]:flex-row [@media(min-width:480px)]:justify-between [@media(min-width:480px)]:items-stretch gap-[2em]">
                    <div className="flex-1">
                      <label className="w-full text-white">First Name</label>
                      <input
                        {...register("first_name")}
                        type="text"
                        placeholder="First Name..."
                        className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                      ></input>

                      {errors.first_name?.message &&
                      errors.first_name?.type === "400" ? (
                        <span
                          id="first_name_error"
                          className="text-xs text-red-500 font-sans font-bold"
                        >
                          {errors.first_name.message}: must be 3-100 chars, A-Z,
                          a-z, or _
                        </span>
                      ) : (
                        <span
                          id="first_name_error"
                          className="text-xs text-gray-400 font-sans font-bold"
                        >
                          *3-100 chars, A-Z, a-z, or _
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="w-full text-white">Last Name</label>
                      <input
                        {...register("last_name")}
                        type="text"
                        placeholder="Last Name..."
                        className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                      ></input>

                      {errors.last_name?.message &&
                      errors.last_name?.type === "400" ? (
                        <span
                          id="last_name_error"
                          className="text-xs text-red-500 font-sans font-bold"
                        >
                          {errors.last_name.message}: must be 3-100 chars, A-Z,
                          a-z, or _
                        </span>
                      ) : (
                        <span
                          id="last_name_error"
                          className="text-xs text-gray-400 font-sans font-bold"
                        >
                          *3-100 chars, A-Z, a-z, or _
                        </span>
                      )}
                    </div>
                  </div>

                  <label className="mt-[1em] w-full text-white">Username</label>
                  <input
                    {...register("username")}
                    type="text"
                    placeholder="Username..."
                    className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                  ></input>
                  {errors.username?.message &&
                  errors.username?.type === "400" ? (
                    <span
                      id="username_error"
                      className="text-xs text-red-500 font-sans font-bold"
                    >
                      {errors.username.message}: must be 5-100 chars, A-Z, a-z,
                      or _
                    </span>
                  ) : (
                    <span
                      id="username_error"
                      className="text-xs text-gray-400 font-sans font-bold"
                    >
                      *5-100 chars, A-Z, a-z, or _
                    </span>
                  )}

                  <label className="mt-[1em] w-full text-white">Email</label>
                  <input
                    {...register("email")}
                    type="text"
                    placeholder="Email..."
                    className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                  ></input>

                  {errors.email?.message && errors.email?.type === "400" ? (
                    <span
                      id="email_error"
                      className="text-xs text-red-500 font-sans font-bold"
                    >
                      {errors.email.message}: Not a valid email
                    </span>
                  ) : (
                    <span
                      id="email_error"
                      className="text-xs text-gray-400 font-sans font-bold"
                    >
                      *Must be a valid email
                    </span>
                  )}

                  <label className="mt-[1em] w-full text-white">Password</label>
                  <div className="relative w-full h-[2.5em] mb-[0.5em]">
                    <input
                      {...register("password")}
                      type={passwordVisibility.type}
                      placeholder="Password..."
                      className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-full rounded-[0.5rem] outline-none text-black"
                    ></input>
                    <button
                      id="toggle-password"
                      type="button"
                      className="absolute right-0 top-0 translate-y-[20%] h-full aspect-square"
                      style={{
                        backgroundImage: `url(${passwordVisibility.logo})`,
                        backgroundSize: "75%",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      onClick={togglePasswordVisibility}
                    ></button>
                  </div>

                  {errors.password?.message &&
                  errors.password?.type === "400" ? (
                    <span
                      id="password_error"
                      className="text-xs text-red-500 font-sans font-bold"
                    >
                      {errors.password.message}: must be 5-255 chars
                    </span>
                  ) : (
                    <span
                      id="password_error"
                      className="text-xs text-gray-400 font-sans font-bold"
                    >
                      *5-255 chars
                    </span>
                  )}

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full mt-[1em] mb-[4px] p-[1em] item-center self-center bg-blue-500 rounded-[1rem] text-gray-200 font-bold shadow-[0px_4px_2px_rgb(0,0,250)] active:shadow-[0px_0px_0px] active:mt-[calc(1em+4px)] active:mb-0"
                  >
                    Register
                  </button>
                  <span className="mt-[0.5em] self-center text-gray-500 text-sm">
                    By registering, you agree with our{" "}
                    <a
                      href="/tos/"
                      className="mt-[1em] text-sm text-blue-600 hover:underline"
                    >
                      Terms of Service & Privacy Policy
                    </a>
                  </span>
                </form>
              </section>
            </div>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  );
}
