import {
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  Avatar,
  Divider,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconSearch,
  IconUsers,
  IconClock,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import CreateProject from "./CreateProject";

const projects = [
  {
    id: 1,
    name: "Dashboard Redesign",
    description: "A complete overhaul of the dashboard UI",
    members: 3,
    updated: "2 days ago",
    avatarColor: "blue",
  },
  {
    id: 2,
    name: "Website Revamp",
    description: "Updating the marketing website",
    members: 3,
    updated: "2 days ago",
    avatarColor: "green",
  },
  {
    id: 3,
    name: "Mobile App",
    description: "Development of the mobile app",
    members: 3,
    updated: "2 days ago",
    avatarColor: "grape",
  },
];

const Project = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleDelete = (id: any) => {
    console.log("Delete project:", id);
    // Later: call API to delete project
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Stack p="md" gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Projects</Title>
          <Button onClick={() => setIsOpen(true)}>Create Project</Button>
        </Group>

        {/* Search */}
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch size={16} />}
          radius="md"
        />

        {/* Projects Grid */}
        <Grid>
          {projects.map(project => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={project.id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                {/* Card header */}
                <Group justify="space-between">
                  <Group>
                    <Avatar color={project.avatarColor} radius="xl">
                      {project.name.charAt(0)}
                    </Avatar>
                    <div>
                      <Text fw={500}>{project.name}</Text>
                      <Text size="sm" c="dimmed">
                        {project.description}
                      </Text>
                    </div>
                  </Group>

                  {/* Delete icon */}
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Tooltip label="delete" position="bottom">
                      <IconTrash size={16} />
                    </Tooltip>
                  </ActionIcon>
                </Group>

                <Divider my="sm" />

                {/* Footer info */}
                <Group gap="lg">
                  <Group gap={4}>
                    <IconUsers size={16} />
                    <Text size="sm" c="dimmed">
                      {project.members} members
                    </Text>
                  </Group>
                  <Group gap={4}>
                    <IconClock size={16} />
                    <Text size="sm" c="dimmed">
                      Last updated {project.updated}
                    </Text>
                  </Group>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
      {isOpen && <CreateProject opened={isOpen} onClose={handleClose} />}
    </>
  );
};

export default Project;
