import queryClient from "../config/queryClient";
import { logout } from "../lib/api";
import { Avatar, Button, Menu, Portal } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";

const UserMenu = () => {
  const navigate = useNavigate();
  const { mutate: signout } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear(); //clears the entire cache
      navigate("/login", { replace: true });
    },
  });
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Avatar.Root>
          <Avatar.Image src="#" />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item asChild value="profile">
              <Link to="/profile">
                <Button variant="ghost" colorScheme="blue">
                  Profile
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item asChild value="settings">
              <Link to="/settings">
                <Button variant="ghost" colorScheme="blue">
                  Settings
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item asChild value="logout">
              <Button
                variant="ghost"
                colorScheme="blue"
                onClick={() => signout()}
              >
                Logout
              </Button>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default UserMenu;
