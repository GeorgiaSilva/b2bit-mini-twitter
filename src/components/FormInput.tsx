
import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label: string;
  id: string;
  type: string;
  registration: UseFormRegisterReturn;
  icon?: React.ReactNode;
  error?: FieldError;
  placeholder?: string;

};

export const FormInput = (props: FormInputProps) => {
  return (
    <div className="mb-4 gap-1 flex flex-col">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 border-none"
      >
        {props.label}
      </label>
      <div className="flex border border-gray-300 dark:border-gray-600 items-center rounded-md p-2 px-4 bg-(--card-bg) ">
      <input
        id={props.id}
        type={props.type}
        {...props.registration}
        placeholder={props.placeholder}
        className="flex-1"
      />
      {props.icon && <span className="text-gray-500"> {props.icon} </span>}

      </div>
      {props.error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {props.error.message}
        </p>
      )}
    </div>
  );
};
