import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  TextInput,
  PasswordInput,
  Anchor,
  Button,
  Flex,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { useLoginMutation, useSignupMutation } from "../store/authApi";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../store/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SingIn.module.scss";
import { IconBugFilled, IconLogin2, IconUserPlus } from "@tabler/icons-react";
type signInForm = {
  name: string;
  email: string;
  password: string;
};
const SignIn = () => {
  const [signup] = useSignupMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: any) => state.userReducer
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<signInForm>();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const onSubmit = async (data: signInForm) => {
    try {
      if (isLogin) {
        const { email, password } = data;
        const loginRes = await login({ email, password }).unwrap();
        showNotification({
          title: "Welcome back!",
          message: loginRes?.message || "You have successfully logged in.",
          color: "teal",
          icon: <IconLogin2 size={18} />,
        });
        dispatch(setUserData(loginRes));
      } else {
        const res = await signup(data).unwrap();
        showNotification({
          title: "Account created",
          message:
            res?.message || "Your account has been created successfully.",
          color: "teal",
          icon: <IconUserPlus size={18} />,
        });
        dispatch(setUserData(res));
        setIsLogin(false);
      }
      reset();
    } catch (error: any) {
      const message = error?.data?.message || "Unknown error occurred";
      showNotification({
        title: "Something went wrong",
        message,
        color: "red",
      });
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [user]);
  return (
    <>
      <div className={styles.back_Image}>
        <Container
          fluid
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper
              p="xl"
              radius="md"
              shadow="sm"
              withBorder
              style={{ width: 420 }}
            >
              <Flex align={"center"} justify={"center"} gap={8}>
                <Title>
                  {" "}
                  <IconBugFilled size={48} color="#228be6" />
                </Title>
                <Title order={3} ta="center">
                  Bug Bucket
                </Title>
              </Flex>
              <Stack>
                {" "}
                <Text c="dimmed" size="sm" ta="center">
                  Every bug need a Bucket
                </Text>
              </Stack>
              <Stack>
                {!isLogin && (
                  <TextInput
                    label="Name"
                    placeholder="Enter your name"
                    required
                    {...register("name", { required: "Name is required" })}
                    error={errors.name?.message}
                  />
                )}
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  required
                  {...register("email", { required: "email is required" })}
                  error={errors.email?.message}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  {...register("password", {
                    required: "password is required",
                  })}
                  error={errors.password?.message}
                />
                <Flex justify={"space-between"}>
                  <Anchor size="sm" onClick={() => setIsLogin(!isLogin)}>
                    {!isLogin
                      ? "Login if already exist !"
                      : "Sign in or create account !"}
                  </Anchor>
                </Flex>
                <Button type="submit" fullWidth mt="xl">
                  {isLogin ? "login" : "Sign In"}
                </Button>
              </Stack>
            </Paper>
          </form>
        </Container>
      </div>
    </>
  );
};
export default SignIn;
