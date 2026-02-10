import {
  Button,
  PasswordInput,
  SegmentedControl,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHeartbeat } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Service/UserService";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../Utility/Notification";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      role: "PATIENT",
      password: "",
      confirmPassword: "",
    },

    validate: {
      name: (value: any) =>
        value.length < 3 ? "Name must be at least 3 characters long" : null,
      email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: any) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
          ? null
          : "Password must contain 8+ chars, uppercase, lowercase, number & special character",

      confirmPassword: (value: any, values: any) =>
        value === values.password ? null : "Passwords do not match",
    },
  });
  const handleRegisterFormSubmit = async (values: any) => {
    setLoading(true);
    registerUser(values)
      .then((data) => {
        SUCCESS_NOTIFICATION("Registered Successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        ERROR_NOTIFICATION(
          error.message || error.errorMessage || "Registration Failed"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div
      style={{
        background: 'url("/Login.jpg")',
      }}
      className="h-screen w-screen !bg-center !bg-no-repeat !bg-cover flex flex-col justify-center items-center"
    >
      <div className="text-pink-400  flex gap-1 items-center flex py-3 ">
        <IconHeartbeat size={45} stroke={2.5} />
        <span className="font-heading font-semibold text-4xl">Pulse</span>
      </div>
      <div className="w-[450px] backdrop-blur-md p-10 py-8 rounded-lg  ">
        <form
          onSubmit={form.onSubmit(handleRegisterFormSubmit)}
          className="flex flex-col gap-5 [&_input]:placeholder-neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-300  [&_.mantine-Input-input]:!border [&_input]:!pl-2 [&_svg]:!text-white  [&_input]:!text-white "
        >
          <div className="self-center font-medium font-heading text-2xl text-white">
            Register
          </div>
          <SegmentedControl
            {...form.getInputProps("role")}
            fullWidth
            size="md"
            radius="lg"
            color="pink"
            bg="none"
            className="[&_*]:!text-white border border-white"
            data={[
              { label: "PATIENT", value: "PATIENT" },
              { label: "DOCTOR", value: "DOCTOR" },
              { label: "ADMIN", value: "ADMIN" },
            ]}
          />
          <TextInput
            className="transition duration-300 "
            variant="unstyled"
            placeholder="Name"
            radius="md"
            size="md"
            {...form.getInputProps("name")}
          />

          <TextInput
            className="transition duration-300 "
            variant="unstyled"
            placeholder="Email"
            radius="md"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            className="transition duration-300 "
            variant="unstyled"
            placeholder="Password"
            radius="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            className="transition duration-300 "
            variant="unstyled"
            placeholder="Confirm Password"
            radius="md"
            size="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Button
            loading={loading}
            radius="md"
            size="md"
            color="pink"
            type="submit"
          >
            Register
          </Button>
          <div className="text-neutral-100 text-sm self-center">
            Already have an account?
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
