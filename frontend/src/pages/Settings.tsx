import { Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import useSessions from "../hooks/useSessions";
import SessionCard from "../components/SessionCard";

const Settings = () => {
  const { sessions, isPending, isSuccess, isError } = useSessions();
  return (
    <Container mb={16}>
      <Heading mb={6}>My Sessions</Heading>
      {isPending && <Spinner />}
      {isError && <Text color="red.400">Failed to get sessions</Text>}
      {isSuccess && (
        <VStack spaceY={3} align="flex-start">
          {sessions.map((session) => (
            <SessionCard key={session._id} session={session}></SessionCard>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Settings;
