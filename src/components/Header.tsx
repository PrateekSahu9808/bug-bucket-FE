import {
  Avatar,
  Box,
  Flex,
  Group,
  Menu,
  Tabs,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBugFilled,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/authApi";
import { useDispatch } from "react-redux";
import { clearUserData } from "../store/userSlice";
import { showNotification } from "@mantine/notifications";
import { userApi } from "../store/userApi";

const Header = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const logOutRes = await logout().unwrap();
      dispatch(clearUserData());
      dispatch(userApi.util.resetApiState());
      showNotification({
        title: "Signed out",
        message: logOutRes?.message || "You have been logged out successfully.",
        color: "teal",
        icon: <IconLogout size={18} />,
      });
      navigate("/");
    } catch (error) {
      console.log("unable logout", error);
    }
  };
  return (
    <Box
      component="header"
      px="lg"
      py="sm"
      style={{
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left: App Name */}
      <Flex align={"center"} justify={"center"} gap={8}>
        <Title>
          {" "}
          <IconBugFilled size={32} color="#228be6" />
        </Title>
        <Title order={3} ta="center">
          Bug Bucket
        </Title>
      </Flex>

      {/* Center: Tabs */}
      <Tabs
        defaultValue="dashboard"
        variant="outline"
        onChange={value => {
          if (value) navigate(`/${value}`);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Tab value="issues">Issues</Tabs.Tab>
          <Tabs.Tab value="teams">Teams</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Right: Avatar Dropdown */}
      <Group>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UnstyledButton>
              <Avatar
                src="https://avatars.githubusercontent.com/u/0000000?v=4"
                alt="User"
                radius="xl"
              />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>

            <Menu.Item onClick={() => navigate("/profile")}>
              <Group gap="xs">
                <IconUser size={16} />
                <Text>Profile</Text>
              </Group>
            </Menu.Item>

            <Menu.Item onClick={() => navigate("/settings")}>
              <Group gap="xs">
                <IconSettings size={16} />
                <Text>Settings</Text>
              </Group>
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item onClick={handleLogout} color="red">
              <Group gap="xs">
                <IconLogout size={16} />
                <Text>Logout</Text>
              </Group>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
};

export default Header;
