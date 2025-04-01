import ResetPasswordForm from "../components/ResetPasswordForm";
import {
  Alert,
  AlertContent,
  AlertIndicator,
  Container,
  Flex,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const isLinkValid = code && exp && exp > now;

  return (
    <Flex justify="center" minH="100vh">
      <Container maxW="md" mx="auto" px={6} py={12} textAlign="center">
        {isLinkValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <VStack align="center" spaceX={6}>
            <Alert.Root status="error" w="fir-content" borderRadius={12}>
              <AlertIndicator />
              <AlertContent>Invalid link</AlertContent>
            </Alert.Root>
            <Text color="gray.400">The link is either invalid or expired</Text>
            <ChakraLink asChild>
              <Link to="/password/forgot" replace>
                Request a new password reset link
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};

export default ResetPassword;
