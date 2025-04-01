import { resetPassword } from "../lib/api";
import {
  Alert,
  AlertContent,
  AlertIndicator,
  Box,
  Heading,
  Link as ChakraLink,
  Stack,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

type Props = {
  code: string;
};

const ResetPasswordForm = ({ code }: Props) => {
  const [password, setPassword] = useState<string>("");

  const {
    mutate: resetUserPassword,
    isError,
    error,
    isSuccess,
    isPending,
  } = useMutation({ mutationFn: resetPassword });

  return (
    <>
      <Heading>Change your Password</Heading>
      <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
        {isError && (
          <Box mb={3} color="red.400">
            {error.message || "An error ocurred "}
          </Box>
        )}
        {isSuccess ? (
          <Box>
            <Alert.Root status="success" borderRadius={12} mb={3}>
              <AlertIndicator />
              <AlertContent>Password updated succesfully</AlertContent>
            </Alert.Root>
            <ChakraLink asChild>
              <Link to="/login" replace>
                Sign In
              </Link>
            </ChakraLink>
          </Box>
        ) : (
          <Stack spaceX={4}>
            <Field.Root id="password" color="white">
              <Field.Label>New Password</Field.Label>
              <Input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  resetUserPassword({ password, verificationCode: code })
                }
              />
            </Field.Root>
            <Button
              loading={isPending}
              my={2}
              disabled={password.length < 8}
              type="submit"
              onClick={() =>
                resetUserPassword({ password, verificationCode: code })
              }
            >
              Reset Password
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default ResetPasswordForm;
