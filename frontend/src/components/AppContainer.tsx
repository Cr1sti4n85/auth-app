import { Box, Center, Spinner } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router";

const AppContainer = () => {
  const { user, isLoading } = useAuth();
  return isLoading ? (
    <Center w="100vw" h="90vh" flexDir="column">
      <Spinner mb={4} />
    </Center>
  ) : user ? (
    <Box p={4} minH="100vh">
      <Outlet />
    </Box>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ redirectUrl: window.location.pathname }}
    />
  );
};

export default AppContainer;
