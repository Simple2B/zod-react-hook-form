"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import stylex from "@stylexjs/stylex";
import axios, { AxiosResponse } from "axios";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { formStyles } from "@/app/styles/form-styles";
import type { TypeUserSchema, ValidFieldNames } from "@/app/types/types";
import { UserSchema } from "@/app/types/zod-scheme";

import { defaultUserState } from "../PrimitiveForm/PrimitiveForm";
import { Spinner } from "../Spinner";
import { UserInfo } from "../User/UserInfo";
import { FormField } from "./FormField";

export const ModernForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TypeUserSchema>({
    resolver: zodResolver(UserSchema),
    // mode: "onSubmit",
    // reValidateMode: "onSubmit",
    // delayError: 3000,
    // shouldFocusError: true,
  });

  const [user, setUser] = useState(defaultUserState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: TypeUserSchema) => {
    try {
      setLoading(true);
      // Data sent to backend with incorrect data
      // const response = await axios.post<TypeUserSchema, AxiosResponse>("/api/form", {
      //   name: 1234,
      //   email: "Not an email",
      //   age: "Hello",
      //   url: "Not a URL",
      //   password: 1234,
      //   confirmPassword: 12345,
      //   terms: false,
      // });

      const response = await axios.post<TypeUserSchema, AxiosResponse>(
        "/api/form",
        data,
      );

      const { errors = {} } = response.data;
      // Define a mapping between server-side field names and their corresponding client-side names
      const fieldErrorMapping: Record<string, ValidFieldNames> = {
        name: "name",
        email: "email",
        age: "age",
        url: "url",
        password: "password",
        confirmPassword: "confirmPassword",
        terms: "terms",
      };

      // Find the first field with an error in the response data
      const fieldWithError = Object.keys(fieldErrorMapping).find(
        (field) => errors[field],
      );

      if (fieldWithError) {
        // Use the ValidFieldNames type to ensure the correct field names
        setError(fieldErrorMapping[fieldWithError], {
          type: "server",
          message: errors[fieldWithError],
        });
      }
      setUser({
        name: data.name,
        email: data.email,
        age: data.age,
        url: data.url,
        phone: data.phone || "",
      });
      setLoading(false);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      setLoading(false);
      console.log("error", error);

      alert("Submitting form failed!");
    }
  };

  return (
    <div {...stylex.props(formStyles.text)}>
      <UserInfo {...user} />
      {loading && <Spinner />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        {...stylex.props(formStyles.flex)}
      >
        <div {...stylex.props(formStyles.form)}>
          <div {...stylex.props(formStyles.title)}>Modern Form</div>
          <div {...stylex.props(formStyles.subtitle)}>
            Zod + React Hook Form
          </div>

          <FormField
            type="text"
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            labelWidth={52}
          />

          <FormField
            type="email"
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            labelWidth={50}
          />
          <FormField
            type="text"
            label="Phone"
            name="phone"
            register={register}
            error={errors.phone}
            labelWidth={54}
          />

          <FormField
            type="text"
            label="Age"
            name="age"
            register={register}
            error={errors.age}
            labelWidth={42}
          />

          <FormField
            type="text"
            label="Website URL"
            name="url"
            register={register}
            error={errors.url}
            labelWidth={94}
          />

          <FormField
            type="password"
            label="Password"
            name="password"
            register={register}
            error={errors.password}
            labelWidth={76}
          />

          <FormField
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
            labelWidth={124}
          />

          <div {...stylex.props(formStyles.terms)}>
            <label {...stylex.props(formStyles.termsLabel)}>
              <input
                type="checkbox"
                {...register("terms", { required: true })}
              />
              I agree to the terms and conditions
            </label>
            {errors.terms && (
              <div {...stylex.props(formStyles.error)}>
                You must agree to the terms and conditions
              </div>
            )}
          </div>

          <button type="submit" {...stylex.props(formStyles.submit)}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
