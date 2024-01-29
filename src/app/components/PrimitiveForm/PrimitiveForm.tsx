"use client";

import stylex from "@stylexjs/stylex";
import { useState } from "react";
import { simulateApiRequest } from "../../api/api";
import { formStyles } from "../../styles/form-styles";
import type { FormError, User } from "../../types/types";
import {
  validateAge,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
  validateURL,
} from "../../utils";
import { Spinner } from "../Spinner";
import { UserInfo } from "../User/UserInfo";
import { FormInput } from "./FormInput";

const defaultErrorState: FormError = {
  name: null,
  email: null,
  phone: null,
  age: null,
  url: null,
  password: null,
  confirmPassword: null,
  terms: false,
};

export const defaultUserState: User = {
  name: "",
  email: "",
  age: 0,
  url: "",
  phone: "",
};

export const PrimitiveForm = () => {
  const [user, setUser] = useState<User>(defaultUserState);
  const [error, setError] = useState<FormError>(defaultErrorState);
  const [loading, setLoading] = useState(false);

  const handleVerify = (
    type: string,
    message: string,
    approveMessage: string,
    specialMessage?: string
  ) => {
    if (message === approveMessage) {
      setError((prev) => ({ ...prev, [type]: null }));
      return false;
    }

    setError((prev) => ({ ...prev, [type]: specialMessage || message }));
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const name = (data.get("name") as string).trim();
    const email = (data.get("email") as string).trim();
    const phone = (data.get("phone") as string).trim();
    const age = (data.get("age") as string).trim();
    const url = (data.get("url") as string).trim();
    const password = (data.get("password") as string).trim();
    const confirm = (data.get("confirm") as string).trim();
    const terms = data.get("terms") as string;

    const validName = validateName(name);
    const isNameVerified = handleVerify("name", validName, "Name is valid");

    const validEmail = validateEmail(email);
    const isEmailVerified = handleVerify("email", validEmail, "Email is valid");

    // Phone is optional
    const validPhone = validatePhone(phone);
    handleVerify("phone", validPhone, "Phone is valid");

    const validAge = validateAge(Number(age));
    const isAgeVerified = handleVerify("age", validAge, "Age is valid");

    const validUrl = validateURL(url);
    const isURLVerified = handleVerify("url", validUrl, "URL is valid");

    const validPassword = validatePassword(password);
    const isPasswrodVerified = handleVerify(
      "password",
      validPassword,
      "Password is valid"
    );

    const isPasswordConfirm = handleVerify(
      "confirmPassword",
      confirm,
      password,
      "Passwords do not match"
    );

    const isTermsCheck = handleVerify(
      "terms",
      terms,
      "on",
      "You must agree to the terms and conditions"
    );

    if (
      isNameVerified ||
      isEmailVerified ||
      (validPhone !== "" && validPhone !== "Phone is valid") ||
      isAgeVerified ||
      isURLVerified ||
      isPasswrodVerified ||
      isPasswordConfirm ||
      isTermsCheck
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await simulateApiRequest({
        name,
        email,
        phone,
        age: Number(age),
        url,
        password,
        terms: !!terms,
      });

      setLoading(false);
      setUser({
        name: response.data.name,
        email: response.data.email,
        age: response.data.age,
        url: response.data.url,
        phone: `+${response.data.phone}` || "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div {...stylex.props(formStyles.text)}>
      <form onSubmit={handleSubmit} {...stylex.props(formStyles.flex)}>
        <div {...stylex.props(formStyles.form)}>
          <div {...stylex.props(formStyles.title)}>Primitive Form</div>
          <div {...stylex.props(formStyles.subtitle)}>
            Only vanilla React with TypeScript
          </div>

          <FormInput
            label="Name"
            code="name"
            type="text"
            labelWidth={52}
            error={error.name}
          />

          <FormInput
            label="Email"
            code="email"
            type="text"
            labelWidth={50}
            error={error.email}
          />

          <FormInput
            label="Phone"
            code="phone"
            type="text"
            labelWidth={54}
            error={error.phone}
          />

          <FormInput
            label="Age"
            code="age"
            type="text"
            labelWidth={42}
            error={error.age}
          />

          <FormInput
            label="Website URL"
            code="url"
            type="text"
            labelWidth={94}
            error={error.url}
          />

          <FormInput
            label="Password"
            code="password"
            type="text"
            labelWidth={76}
            error={error.password}
          />

          <FormInput
            label="Confirm password"
            code="confirm"
            type="text"
            labelWidth={124}
            error={error.confirmPassword}
          />

          <div {...stylex.props(formStyles.terms)}>
            <label {...stylex.props(formStyles.termsLabel)} htmlFor="terms">
              <input id="terms" type="checkbox" name="terms" />
              <span>I agree to the terms and conditions</span>
            </label>
            {error.terms && (
              <div {...stylex.props(formStyles.error)}>{error.terms}</div>
            )}
          </div>

          <button type="submit" {...stylex.props(formStyles.submit)}>
            Submit
          </button>
        </div>
      </form>

      {loading && <Spinner />}

      <UserInfo {...user} />
    </div>
  );
};