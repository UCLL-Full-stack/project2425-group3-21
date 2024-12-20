import UserService from "@services/UserService";
import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const UserLoginForm: React.FC = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!email || email.trim() === "") {
      setEmailError(t('login.emailRequired'));
      result = false;
    }

    if (!password || password.trim() === "") {
      setPasswordError(t('login.passwordRequired'));
      result = false;
    }

    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    clearErrors();
  
    if (!validate()) {
      return;
    }
  
    try {
      const user = { email, password };
      const response = await UserService.loginUser(user);
  
      if (response.status === 200) {
        const userPayload = await response.json();
        const userthing = userPayload.response;
  
        setStatusMessages([{ message: t('login.success'), type: "success" }]);
  
        console.log("User logged in:", userPayload);
        sessionStorage.setItem("loggedInUser", JSON.stringify({
          token: userthing.token,
          role: userthing.role,
          userId: userthing.userId,
        }));
  
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setStatusMessages([{ message: t('login.error'), type: "error" }]);
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatusMessages([{ message: t('login.error'), type: "error" }]);
    }
  };

  return (
    <>
      <h3 className="px-0">{t('login.title')}</h3>
      {statusMessages && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto ">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-red-800": type === "error",
                  "text-green-800": type === "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailInput" className="block mb-2 text-sm font-medium">
          {t('login.label.email')}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="emailInput"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
          />
          {emailError && <div className="error-text">{emailError}</div>}
        </div>
        <div className="mb-4">
          <div>
            <label
              htmlFor="passwordInput"
              className="block mb-2 text-sm font-medium"
            >
              {t('login.label.password')}
            </label>
          </div>
          <div className="block mb-2 text-sm font-medium">
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-input"
            />
            {passwordError && (
              <div className="error-text">{passwordError}</div>
            )}
          </div>
        </div>
        <button
          className="btn-primary"
          type="submit"
        >
          {t('login.button')}
        </button>
      </form>
    </>
  );
};

export default UserLoginForm;