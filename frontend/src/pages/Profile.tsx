import useAuth from "../hooks/useAuth";
import { User } from "../user.type";
import {
  Alert,
  AlertContent,
  AlertIndicator,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user as User;
  return (
    <Center my={16} flexDir="column">
      <Heading mb={4}>My Account</Heading>
      {!verified && (
        <Alert.Root status="warning" w="fit-content" borderRadius={12}>
          <AlertIndicator />
          <AlertContent>Please verify your email</AlertContent>
        </Alert.Root>
      )}
      <Text color="black" mb={2}>
        Email:{" "}
        <Text as="span" color="gray.300">
          {email}
        </Text>
      </Text>
      <Text color="black">
        Created on:{" "}
        <Text as="span" color="gray.300">
          {new Date(createdAt).toLocaleDateString("en-US")}
        </Text>
      </Text>
    </Center>
  );
};

export default Profile;
