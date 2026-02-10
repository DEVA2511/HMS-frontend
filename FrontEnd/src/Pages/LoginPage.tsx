import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHeartbeat } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { loginUser } from "../Service/UserService";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../Utility/Notification";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setJwt } from "../Slice/JwtSlice";

import { jwtDecode } from "jwt-decode";
import { setuser } from "../Slice/UserSlice";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: any) => (value.length >= 8 ? null : "Invalid password"),
    },
  });
  const handleFormSubmit = async (values: typeof form.values) => {
    setLoading(true);
    console.log("Login values:", values);
    loginUser(values)
      .then((_data) => {
        console.log("Token decoded:", jwtDecode(_data));
        SUCCESS_NOTIFICATION("Login Successfully");
        dispatch(setJwt(_data));
        dispatch(setuser(jwtDecode(_data)));
      })
      .catch((error) => {
        ERROR_NOTIFICATION(
          error.message || error.errorMessage || "Login Failed"
        );
        // console.log(error);
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
          onSubmit={form.onSubmit(handleFormSubmit)}
          className="flex flex-col gap-5 [&_input]:placeholder-neutral-100 [&_.mantine-Input-input]:!border-white focus-within:[&_.mantine-Input-input]:!border-pink-300  [&_.mantine-Input-input]:!border [&_input]:!pl-2 [&_svg]:!text-white  [&_input]:!text-white "
        >
          <div className="self-center font-medium font-heading text-2xl text-white">
            Login
          </div>
          <TextInput
            className="transition duration-300 "
            variant="unstyled"
            placeholder="Email"
            // label="User Name"
            radius="md"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            className="transition duration-300 "
            variant="unstyled"
            placeholder="Password"
            // label="Password"
            // description="Password must include at least one letter, number and special character"
            radius="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button
            loading={loading}
            radius="md"
            size="md"
            color="pink"
            type="submit"
          >
            Login
          </Button>
          <div className="text-neutral-100 text-sm self-center">
            Don't have an account?
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
