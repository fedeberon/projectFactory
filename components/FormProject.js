import React, { useState } from "react";
import { useForm } from "react-hook-form";

const FormProject = () => {
  const [user, setUser] = useState();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = ({ name, description, remember }) => {
    // You should handle login logic with name, password and remember form data
    setUser({ name: name });
  };

  return (
    // <div className="container">
    //   {user ? (
    //     <span className="hello-user">Hello, {user.name}!</span>
    //   ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <h3 className="form-header">FORM PROJECT</h3>
      </div>
      <div className="row">
        <input
          type="text"
          placeholder="write the name here please"
          {...register("name", {
            required: { value: true, message: "Name is required" },
            minLength: {
              value: 3,
              message: "Name cannot be less than 3 character",
            },
          })}
          className={"form-field" + (errors.name ? " has-error" : "")}
        />
        {errors.name && (
          <span className="error-label">{errors.name.message}</span>
        )}
      </div>
      <div className="row">
        <input
          type="text"
          placeholder="write the description here please"
          {...register("description", {
            required: { value: true, message: "Description is required" },
            minLength: {
              value: 3,
              message: "Description cannot be less than 3 character",
            },
          })}
          className={"form-field" + (errors.description ? " has-error" : "")}
        />
        {errors.description && (
          <span className="error-label">{errors.description.message}</span>
        )}
      </div>
      <div className="row">
        <input
          type="number"
          placeholder="write the totalArea here please"
          {...register("totalArea", {
            required: { value: true, message: "TotalArea is required" },
            minLength: {
              value: 3,
              message: "TotalArea cannot be less than 3 character",
            },
          })}
          className={"form-field" + (errors.totalArea ? " has-error" : "")}
        />
        {errors.totalArea && (
          <span className="error-label">{errors.totalArea.message}</span>
        )}
      </div>
      <div className="row">
        <input
          type="email"
          placeholder="write the Email here please"
          {...register("email", {
            required: { value: true, message: "Email is required" },
            minLength: {
              value: 3,
              message: "Email cannot be less than 3 character",
            },
          })}
          className={"form-field" + (errors.email ? " has-error" : "")}
        />
        {errors.email && (
          <span className="error-label">{errors.email.message}</span>
        )}
      </div>
      <div className="row">
        <input type="number" placeholder="write the Year here please" />
      </div>

      {/* <div className="row">
        <input
          type="password"
          placeholder="password"
          {...register("password", {
            required: {
              value: true,
              message: "Please enter your password",
            },
          })}
          className={"form-field" + (errors.password ? " has-error" : "")}
        />
        {errors.password && (
          <span className="error-label">{errors.password.message}</span>
        )}
      </div> */}
      <div className="row row-remember">
        <input type="checkbox" id="remember" {...register("remember")} />
        <label htmlFor="remember" className="remember-label">
          Remember me
        </label>
      </div>
      <div className="row">
        <button type="submit" className="btn login-btn">
          Login
        </button>
      </div>
    </form>
    //   )}
    // </div>
  );
};

export default FormProject;
