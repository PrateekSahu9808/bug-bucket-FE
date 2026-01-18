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
  IconPencil,
} from "@tabler/icons-react";
import { useState } from "react";
import CreateProject from "./CreateProject";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../../../store/projectApi";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const Project = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<any>(null); // Store selected project for edit
  const { data, isLoading } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id).unwrap();
        notifications.show({
          title: "Success",
          message: "Project deleted successfully",
          color: "green",
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to delete project",
          color: "red",
        });
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, project: any) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  // if (isLoading) {
  //   return <Text>Loading projects...</Text>;
  // }
  // The API returns { success: true, count: N, data: [] }
  const projects = data?.data || [];

  return (
    <>
      <Stack p="md" gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Projects</Title>
          <Button onClick={handleCreate}>Create Project</Button>
        </Group>

        {/* Search */}
        <TextInput
          placeholder="Search"
          leftSection={<IconSearch size={16} />}
          radius="md"
        />

        {/* Projects Grid */}
        <Grid>
          {projects.map((project: any) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={project._id}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => navigate(`/home/project/${project._id}`)}
              >
                <Group
                  justify="space-between"
                  mb="xs"
                  align="flex-start"
                  wrap="nowrap"
                >
                  <Group align="flex-start" wrap="nowrap">
                    <Avatar
                      src={project.avatar}
                      alt={project.name}
                      radius="xl"
                      size={50}
                    >
                      {project.name?.charAt(0).toUpperCase()}
                    </Avatar>

                    <div style={{ flex: 1 }}>
                      <Text fw={500} lineClamp={1} title={project.name}>
                        {project.name}
                      </Text>
                      <Tooltip
                        label={project.description}
                        multiline
                        w={220}
                        withArrow
                      >
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {project.description}
                        </Text>
                      </Tooltip>
                    </div>
                  </Group>

                  <Group gap={4} wrap="nowrap">
                    {/* Edit icon */}
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={e => handleEdit(e, project)}
                    >
                      <Tooltip label="Edit" position="bottom">
                        <IconPencil size={16} />
                      </Tooltip>
                    </ActionIcon>

                    {/* Delete icon */}
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={e => handleDelete(e, project._id)}
                    >
                      <Tooltip label="delete" position="bottom">
                        <IconTrash size={16} />
                      </Tooltip>
                    </ActionIcon>
                  </Group>
                </Group>

                <Divider my="sm" />

                {/* Footer info */}
                <Group gap="lg" mt="auto">
                  <Group gap={4}>
                    <IconUsers size={16} />
                    <Text size="sm" c="dimmed">
                      {project.members?.length || 1} members
                    </Text>
                  </Group>
                  <Group gap={4}>
                    <IconClock size={16} />
                    <Text size="sm" c="dimmed">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </Text>
                  </Group>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
      {isOpen && (
        <CreateProject
          opened={isOpen}
          onClose={handleClose}
          initialData={selectedProject}
        />
      )}
    </>
  );
};

export default Project;
