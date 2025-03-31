import { sendPasswordResetEmail } from "../lib/api";
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Link as ChakraLink,
  Button,
  Text,
  Alert,
  AlertIndicator,
  AlertContent,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");

  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8}>
          Reset your Password
        </Heading>
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.500">
              {error?.message || "Something went wrong"}
            </Box>
          )}
          <Stack spaceX={4}>
            {isSuccess ? (
              <Alert.Root status="success" borderRadius={12}>
                <AlertIndicator />
                <AlertContent>Email sent. Check your email</AlertContent>
              </Alert.Root>
            ) : (
              <>
                <Field.Root id="email" color="white">
                  <Field.Label>Email Address</Field.Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field.Root>
                <Button
                  my={2}
                  loading={isPending}
                  disabled={!email}
                  onClick={() => sendPasswordReset(email)}
                >
                  Reset Password
                </Button>
              </>
            )}
            <Text textAlign="center" fontSize="sm" color="text.muted">
              Go back to{" "}
              <ChakraLink asChild>
                <Link to="/login" replace>
                  Sign In
                </Link>
              </ChakraLink>
              &nbsp;or&nbsp;
              <ChakraLink asChild>
                <Link to="/register" replace>
                  Sign Up
                </Link>
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};

export default ForgotPassword;
