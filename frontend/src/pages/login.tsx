import { Link, Navigate, useNavigate } from "react-router-dom";
import { hidePasswordLogo, showPasswordLogo } from "../assets/assets";
import Layout from "../layouts/layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

type LoginValues = {
  usernameOrEmail: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();

  const [passwordVisibility, setPasswordVisibility] = useState({
    type: "password",
    logo: hidePasswordLogo,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["getLogin"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/spa/login", {
        withCredentials: true,
      });
      return response.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    console.error("Error:", error.message);
    return <Navigate to="/communities/analytics" replace />;
  }

  async function onSubmit(data: LoginValues) {
    try {
      console.log(data);

      const response = await axios.post(
        "http://localhost:8000/spa/login",
        data,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate("/explore", { replace: true });
    } catch (error: any) {
      console.log(error.response.data);
      setError("password", {
        type: "server",
        message: error.response.data.detail,
      });
    }
  }

  function togglePasswordVisibility() {
    if (passwordVisibility.type === "password") {
      setPasswordVisibility({ type: "text", logo: showPasswordLogo });
    } else {
      setPasswordVisibility({ type: "password", logo: hidePasswordLogo });
    }
  }

  return (
    <Layout hideInnerSidebar={true}>
      <Layout.Main>
        <div
          className="
                flex-1 min-w-[15rem] border-r border-r-gray-800
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
          <div className="p-[1.5em] w-full min-h-full flex flex-row justify-center items-center">
            <div className="p-[1em] max-w-[40rem] flex-1 bg-gray-800/50 rounded-[2.5rem]">
              <section className="p-[1em] [@media(min-width:480px)]:p-[2em] w-full flex flex-col justify-stretch items-center">
                <header className="font-sans font-bold text-4xl [@media(min-width:480px)]:text-5xl text-white">
                  Login
                </header>

                {data.verify_message && (
                  <span className="mt-[2em] text-xs text-green-500 font-sans font-bold self-start">
                    {data.verify_message}
                  </span>
                )}

                <span className="mt-[2em] self-start text-white text-sm">
                  Don't have an account?{" "}
                  <Link to="/register/" className="underline text-blue-600">
                    Register
                  </Link>
                  .
                </span>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-[1em] w-full flex flex-col justify-stretch items-start gap-[0.5em]"
                >
                  <label className="w-full text-white">Username or Email</label>
                  <input
                    {...register("usernameOrEmail", { required: true })}
                    type="text"
                    placeholder="Username or Email..."
                    className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-full rounded-[0.5rem] outline-none text-black"
                  ></input>

                  <label className="mt-[1em] w-full text-white">Password</label>
                  <div className="relative w-full h-[2.5em] mb-[0.5em]">
                    <input
                      {...register("password", { required: true })}
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

                  <span
                    id="password_error"
                    className="text-xs text-red-500 font-sans"
                  >
                    {errors.password ? errors.password.message : ""}
                  </span>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full mt-[1em] mb-[4px] p-[1em] item-center self-center bg-blue-500 rounded-[1rem] text-gray-200 font-bold shadow-[0px_4px_2px_rgb(0,0,250)] active:shadow-[0px_0px_0px] active:mt-[calc(1em+4px)] active:mb-0"
                  >
                    Login
                  </button>
                  <a
                    href="/auth/forget_password"
                    className="mt-[1em] self-center text-sm text-blue-600 hover:underline"
                  >
                    Forget password?
                  </a>
                </form>
              </section>
            </div>
          </div>
        </div>
      </Layout.Main>
    </Layout>
  );
}
