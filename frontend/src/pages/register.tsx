import { Link } from "react-router-dom";
import { hidePasswordLogo, showPasswordLogo } from "../assets/assets";
import Layout from "../layouts/layout";
import { useState } from "react";

export default function Register() {
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
                  action="/register/"
                  method="post"
                  className="mt-[2em] w-full flex flex-col justify-stretch items-start gap-[0.5em]"
                >
                  {/* {% if register_error %}
                                {% if register_error.get('username_error') %}
                                    <span className="text-xs text-red-500 font-sans font-bold">
                                        *Error: {{ register_error.get('username_error').get('message') }}
                                    </span>
                                {% endif %}

                                {% if register_error.get('first_last_error') %}
                                    <span className="text-xs text-red-500 font-sans font-bold">
                                        *Error: {{ register_error.get('first_last_error').get('message') }}
                                    </span>
                                {% endif %}
                            {% endif %} */}
                  <div className="flex flex-col justify-start items-start [@media(min-width:480px)]:flex-row [@media(min-width:480px)]:justify-between [@media(min-width:480px)]:items-stretch gap-[2em]">
                    <div className="flex-1">
                      <label className="w-full text-white">First Name</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        placeholder="First Name..."
                        className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                      ></input>
                      {/* {% if first_name_error %}
                                        <span id="first_name_error" className="text-xs text-red-500 font-sans font-bold">{{ first_name_error }}: must be 3-100 chars, A-Z, a-z, or _</span>                            
                                    {% else %} */}
                      <span
                        id="first_name_error"
                        className="text-xs text-gray-400 font-sans font-bold"
                      >
                        *3-100 chars, A-Z, a-z, or _
                      </span>
                      {/* {% endif %} */}
                    </div>
                    <div className="flex-1">
                      <label className="w-full text-white">Last Name</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        placeholder="Last Name..."
                        className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                      ></input>
                      {/* {% if last_name_error %}
                                        <span id="last_name_error" className="text-xs text-red-500 font-sans font-bold">{{ last_name_error }}: must be 3-100 chars, A-Z, a-z, or _</span>
                                    {% else %} */}
                      <span
                        id="last_name_error"
                        className="text-xs text-gray-400 font-sans font-bold"
                      >
                        *3-100 chars, A-Z, a-z, or _
                      </span>
                      {/* {% endif %} */}
                    </div>
                  </div>

                  <label className="mt-[1em] w-full text-white">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username..."
                    className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                  ></input>
                  {/* {% if username_error %}
                                <span id="username_error" className="text-xs text-red-500 font-sans font-bold">{{ username_error }}: must be 5-100 chars, A-Z, a-z, or _</span>
                            {% else %} */}
                  <span
                    id="username_error"
                    className="text-xs text-gray-400 font-sans font-bold"
                  >
                    *5-100 chars, A-Z, a-z, or _
                  </span>
                  {/* {% endif %} */}

                  <label className="mt-[1em] w-full text-white">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email..."
                    className="bg-white mt-[0.5em] px-[1em] py-[0.5em] w-full h-[2.5em] rounded-[0.5rem] outline-none text-black"
                  ></input>
                  {/* {% if email_error %}
                                <span id="email_error" className="text-xs text-red-500 font-sans font-bold">{{ email_error }}: Not a valid email</span>
                            {% else %} */}
                  <span
                    id="email_error"
                    className="text-xs text-gray-400 font-sans font-bold"
                  >
                    *Must be a valid email
                  </span>
                  {/* {% endif %} */}

                  <label className="mt-[1em] w-full text-white">Password</label>
                  <div className="relative w-full h-[2.5em] mb-[0.5em]">
                    <input
                      type={passwordVisibility.type}
                      id="password"
                      name="password"
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
                  {/* {% if password_error %}
                                <span id="password_error" className="text-xs text-red-500 font-sans font-bold">{{ password_error }}: must be 5-255 chars</span>
                            {% else %} */}
                  <span
                    id="password_error"
                    className="text-xs text-gray-400 font-sans font-bold"
                  >
                    *5-255 chars
                  </span>
                  {/* {% endif %} */}

                  <button
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
