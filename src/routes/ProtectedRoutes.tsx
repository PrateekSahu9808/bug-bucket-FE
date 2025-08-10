import { type ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useProfileQuery } from "../store/userApi";
import { setUserData, setTriedAuth } from "../store/userSlice";
import { Center, Loader } from "@mantine/core";

interface ProtectedNodeProps {
  children: ReactNode;
}

const ProtectedRoutes = ({ children }: ProtectedNodeProps) => {
  const dispatch = useDispatch();
  const { isAuthenticated, hasTriedAuth } = useSelector(
    (state: any) => state.userReducer
  );

  const { data, isLoading, isSuccess, isError } = useProfileQuery(undefined, {
    skip: isAuthenticated || hasTriedAuth,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUserData(data));
    } else if (isError) {
      dispatch(setTriedAuth());
    }
  }, [isSuccess, isError, data, dispatch]);

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" type="bars" />
      </Center>
    );
  }

  if (!isAuthenticated && hasTriedAuth) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoutes;
