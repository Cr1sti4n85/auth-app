import { verifyEmail } from "../lib/api";
import {
  Alert,
  AlertIndicator,
  Container,
  Flex,
  Spinner,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";

const VerifyEmail = () => {
  const { code } = useParams<string>();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code as string),
  });

  return (
    <Flex minH="100vh" justify="center" mt={12}>
      <Container mx="auto" maxW="md" textAlign="center" py={12} px={6}>
        {isPending ? (
          <Spinner />
        ) : (
          <VStack align="center" spaceY={6}>
            <Alert.Root
              status={isSuccess ? "success" : "error"}
              w="fit-content"
              borderRadius={12}
            >
              <AlertIndicator />
              {isSuccess ? "Email verified" : "Invalid link"}
            </Alert.Root>
            {isError && (
              <Text color="gray.500">
                The link is either invalid or expired.{" "}
                <ChakraLink asChild>
                  <Link to="/password/reset" replace>
                    Get a new Link
                  </Link>
                </ChakraLink>
              </Text>
            )}
            <ChakraLink asChild>
              <Link to="/" replace>
                Back to Home
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};

export default VerifyEmail;
