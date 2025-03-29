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
import { useState } from "react";
import { Link } from "react-router";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <>
      <Flex minH="100vh" align="center" justify="center">
        <Container mx="auto" maxW="md" py={12} px={6} textAlign="center">
          <Heading fontSize="4xl" mb={8}>
            Sign into your Account
          </Heading>
          <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
            <Stack wordSpacing={4}>
              <Field.Root id="email">
                <Field.Label>Email Address</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field.Root>
              <Field.Root id="password">
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field.Root>
              <ChakraLink asChild fontSize="sm">
                <Link to="/password/forgot">Forgot Password</Link>
              </ChakraLink>
              <Button
                my={2}
                disabled={!email || password.length < 8}
                type="submit"
              >
                Sign In
              </Button>
              <Text textAlign="center" fontSize="sm" color="gray.500">
                Don't have an account?{" "}
                <ChakraLink asChild>
                  <Link to="/register">Sign Up</Link>
                </ChakraLink>
              </Text>
            </Stack>
          </Box>
        </Container>
      </Flex>
    </>
  );
};

export default Login;
