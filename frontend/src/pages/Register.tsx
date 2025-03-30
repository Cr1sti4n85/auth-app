import { register } from "../lib/api";
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
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", { replace: true });
    },
  });
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
        <Heading fontSize="4xl" mb={8}>
          Create an Account
        </Heading>
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
          {isError && (
            <Box mb={3} color="red.500">
              {error?.message || "Something went wrong"}
            </Box>
          )}
          <Stack wordSpacing={4}>
            <Field.Root id="email" color="white">
              <Field.Label>Email Address</Field.Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>
            <Field.Root id="password" color="white">
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Text color="text.muted" fontSize="xs" textAlign="left" mt={2}>
                Must be at least eight characters long.
              </Text>
            </Field.Root>

            <Field.Root id="confirmPassword" color="white">
              <Field.Label>Confirm Password</Field.Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  createAccount({ email, password, confirmPassword })
                }
              />
            </Field.Root>

            <Button
              loading={isPending}
              my={2}
              disabled={
                !email || password.length < 8 || password !== confirmPassword
              }
              type="submit"
              onClick={() =>
                createAccount({ email, password, confirmPassword })
              }
            >
              Create Account
            </Button>
            <Text textAlign="center" fontSize="sm" color="gray.500">
              Already have an account?{" "}
              <ChakraLink asChild>
                <Link to="/login">Sign In</Link>
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};

export default Register;
