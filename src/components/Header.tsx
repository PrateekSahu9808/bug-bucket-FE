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
  IconChartBar,
  IconClipboard,
  IconFolder,
  IconLogout,
  IconSettings,
  IconTemplate,
  IconUser,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/authApi";
import { useDispatch } from "react-redux";
import { clearUserData } from "../store/userSlice";
import { showNotification } from "@mantine/notifications";
import { userApi } from "../store/userApi";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];
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
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "white",
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
      {/* Center: Tabs */}
      <Tabs
        value={location.pathname}
        onChange={value => navigate(value as string)}
      >
        <Tabs.List>
          {/* Global Context: Show only Projects (and maybe others later) */}
          {!location.pathname.match(/\/home\/project\/[a-zA-Z0-9-]+/) && (
            <>
              <Tabs.Tab
                value="/home/project"
                leftSection={<IconFolder size={16} />}
              >
                Projects
              </Tabs.Tab>
            </>
          )}

          {/* Project Context: Show Board, People, Templates, Reports, Configuration */}
          {location.pathname.match(/\/home\/project\/[a-zA-Z0-9-]+/) && (
            <>
              <Tabs.Tab
                value="/home/project"
                leftSection={<IconFolder size={16} />}
              >
                Projects
              </Tabs.Tab>
              <Tabs.Tab
                value={`/home/project/${location.pathname.split("/")[3]}`}
                leftSection={<IconClipboard size={16} />}
              >
                Board
              </Tabs.Tab>
              <Tabs.Tab
                value={`/home/project/${location.pathname.split("/")[3]}/people`}
                leftSection={<IconUser size={16} />}
              >
                People
              </Tabs.Tab>
              <Tabs.Tab
                value={`/home/project/${location.pathname.split("/")[3]}/templates`}
                leftSection={<IconTemplate size={16} />}
              >
                Templates
              </Tabs.Tab>
              <Tabs.Tab
                value={`/home/project/${location.pathname.split("/")[3]}/report`}
                leftSection={<IconChartBar size={16} />}
              >
                Reports
              </Tabs.Tab>
              <Tabs.Tab
                value={`/home/project/${location.pathname.split("/")[3]}/configuration`}
                leftSection={<IconSettings size={12} />}
              >
                Configuration
              </Tabs.Tab>
            </>
          )}
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
