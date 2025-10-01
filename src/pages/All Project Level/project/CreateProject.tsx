import {
  Modal,
  Card,
  Stack,
  TextInput,
  Textarea,
  ColorInput,
  MultiSelect,
  Group,
  Switch,
  Button,
  Portal,
  Divider,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useCreateProjectMutation } from "../../../store/projectApi";
import { useForm } from "react-hook-form";

interface CreateProjectProps {
  opened: boolean;
  onClose: () => void;
}

const CreateProject = ({ opened, onClose }: CreateProjectProps) => {
  const [workflow, setWorkflow] = useState([
    { id: 1, name: "To Do" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Done" },
  ]);

  const handleAddStatus = () => {
    setWorkflow([...workflow, { id: Date.now(), name: "" }]);
  };

  const handleStatusChange = (id: number, value: string) => {
    setWorkflow(prev =>
      prev.map(s => (s.id === id ? { ...s, name: value } : s))
    );
  };

  const handleRemoveStatus = (id: number) => {
    setWorkflow(prev => prev.filter(s => s.id !== id));
  };

  const [createProject] = useCreateProjectMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const onSubmit = async (data: any) => {
    try {
      console.log("data", data);
      const payload = {};
      const projectRes = await createProject(payload).unwrap();
      console.log(projectRes);
    } catch (error) {}
  };
  return (
    <Portal>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Create New Project"
        centered
        size="lg"
      >
        {" "}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <TextInput
                label="Project Name"
                placeholder="Enter your project name"
                required
                {...register("projectName", {
                  required: "Project name is required",
                })}
                error={errors.projectName?.message as string}
              />
              <Textarea
                label="Description"
                placeholder="Enter you Description"
                {...register("description")}
              />
              <TextInput
                label="Avatar"
                placeholder="Enter you avatar url"
                {...register("avatar")}
              />
              <MultiSelect
                label="Members"
                placeholder="Enter Members"
                data={[
                  { value: "prateek", label: "Prateek Sahu" },
                  { value: "john", label: "John Doe" },
                  { value: "jane", label: "Jane Smith" },
                  { value: "emma", label: "Emma Watson" },
                ]}
                searchable
                clearable
                nothingFoundMessage="no data found"
              />
              <MultiSelect
                label="Labels"
                placeholder="Enter Labels"
                data={[
                  { value: "functional testing", label: "Functional Testing" },
                  { value: "regression issue", label: "Regression Issue" },
                  { value: "functional issue", label: "Functional issue" },
                  { value: "unit testing", label: "unit testing" },
                ]}
                searchable
                clearable
                nothingFoundMessage="no data found"
              />
              <Stack>Status</Stack>
              <Flex gap={8}>
                <Switch value="archived" label="Archived" />
                <Switch value="active" label="Active" />
              </Flex>
              <Divider label="Workflow" />
              <Stack gap="sm">
                {workflow.map(status => (
                  <Flex key={status.id} align="center" gap={8}>
                    <TextInput
                      placeholder="Enter status name"
                      value={status.name}
                      onChange={e =>
                        handleStatusChange(status.id, e.currentTarget.value)
                      }
                      style={{ flex: 1 }}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleRemoveStatus(status.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Flex>
                ))}
                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={handleAddStatus}
                >
                  Add Status
                </Button>
              </Stack>
              <Divider label="Settings" />
              <Stack>Settings</Stack>
              <Flex gap={8}>
                <Switch value="notification" label="Notification" />
                <Switch value="auto assign" label="Auto Assign" />
              </Flex>
              <TextInput
                label="Issue prefix"
                placeholder="Enter your prefix name"
                required
                {...register("issuePrefix", {
                  required: "issuePrefix name is required",
                })}
                error={errors.projectName?.message as string}
              />
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={onClose}>
                  Cancel
                </Button>
                <Button rightSection={<IconPlus size={16} />} type="submit">
                  Create
                </Button>
              </Group>
            </Stack>
          </Card>
        </form>
      </Modal>
    </Portal>
  );
};

export default CreateProject;
