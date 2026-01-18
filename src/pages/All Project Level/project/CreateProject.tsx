import {
  Modal,
  Card,
  Stack,
  TextInput,
  Textarea,
  MultiSelect,
  Group,
  Switch,
  Button,
  Portal,
  Divider,
  Flex,
  ActionIcon,
  TagsInput,
} from "@mantine/core";
import { IconPlus, IconTrash, IconDeviceFloppy } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../../store/projectApi";
import { useGetUsersQuery } from "../../../store/userApi";
import { useForm, Controller } from "react-hook-form";
import { notifications } from "@mantine/notifications";

interface CreateProjectProps {
  opened: boolean;
  onClose: () => void;
  initialData?: any; // New prop for edit mode
}

const CreateProject = ({
  opened,
  onClose,
  initialData,
}: CreateProjectProps) => {
  const isEditMode = !!initialData;
  const [workflow, setWorkflow] = useState([
    { id: 1, name: "To Do", order: 1 },
    { id: 2, name: "In Progress", order: 2 },
    { id: 3, name: "Done", order: 3 },
  ]);

  const { data: userData } = useGetUsersQuery();
  const userOptions =
    userData?.data?.map((u: any) => ({
      value: u._id,
      label: u.name,
    })) || [];

  const handleAddStatus = () => {
    setWorkflow([
      ...workflow,
      { id: Date.now(), name: "", order: workflow.length + 1 },
    ]);
  };

  const handleStatusChange = (id: number, value: string) => {
    setWorkflow(prev =>
      prev.map(s => (s.id === id ? { ...s, name: value } : s)),
    );
  };

  const handleRemoveStatus = (id: number) => {
    setWorkflow(prev => prev.filter(s => s.id !== id));
  };

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      settings: {
        notificationsEnabled: true,
        issueAutoAssign: false,
        issuePrefix: "PROJ",
      },
      status: {
        isArchived: false,
        isActive: true,
      },
    },
  });

  // Populate form when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description);
      setValue("avatar", initialData.avatar);
      setValue("issuePrefix", initialData.settings?.issuePrefix || "PROJ");

      const memberIds = initialData.members?.map((m: any) => m.userId) || [];
      setValue("members", memberIds);

      const labelNames = initialData.labels?.map((l: any) => l.name) || [];
      setValue("labels", labelNames);

      setValue(
        "settings.notificationsEnabled",
        initialData.settings?.notificationsEnabled,
      );
      setValue(
        "settings.issueAutoAssign",
        initialData.settings?.issueAutoAssign,
      );

      setValue("status.isArchived", initialData.status?.isArchived);
      setValue("status.isActive", initialData.status?.isActive);

      if (initialData.workflow && initialData.workflow.length > 0) {
        setWorkflow(
          initialData.workflow.map((w: any) => ({ ...w, id: Math.random() })),
        ); // refresh IDs to avoid key conflicts or use backend ID
      }
    } else {
      reset(); // Clear form for create mode
      setWorkflow([
        { id: 1, name: "To Do", order: 1 },
        { id: 2, name: "In Progress", order: 2 },
        { id: 3, name: "Done", order: 3 },
      ]);
    }
  }, [initialData, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        workflow: workflow.map((w, idx) => ({
          id: w.name.toLowerCase().replace(/\s+/g, "-"),
          name: w.name,
          order: idx,
          isInitial: idx === 0,
          isFinal: idx === workflow.length - 1,
        })),
        members:
          data.members?.map((userId: string) => ({
            userId,
            role: "viewer",
          })) || [],
        labels:
          data.labels?.map((label: string) => ({
            name: label,
          })) || [],
        settings: {
          ...data.settings,
          issuePrefix: data.issuePrefix,
        },
      };

      if (isEditMode) {
        await updateProject({ id: initialData._id, data: payload }).unwrap();
        notifications.show({
          title: "Success",
          message: "Project updated",
          color: "green",
        });
      } else {
        await createProject(payload).unwrap();
        notifications.show({
          title: "Success",
          message: "Project created",
          color: "green",
        });
      }

      onClose();
      if (!isEditMode) reset();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.message || "Operation failed",
        color: "red",
      });
    }
  };

  return (
    <Portal>
      <Modal
        opened={opened}
        onClose={onClose}
        title={isEditMode ? "Edit Project" : "Create New Project"}
        centered
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <TextInput
                label="Project Name"
                placeholder="Enter your project name"
                withAsterisk
                {...register("name", {
                  required: "Project name is required",
                })}
                error={errors.name?.message as string}
              />
              <Textarea
                label="Description"
                placeholder="Enter description"
                {...register("description")}
              />
              <TextInput
                label="Avatar URL"
                placeholder="https://..."
                {...register("avatar")}
              />

              <Controller
                name="members"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Members"
                    placeholder="Select members"
                    data={userOptions}
                    searchable
                    clearable
                    {...field}
                  />
                )}
              />

              <Controller
                name="labels"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    label="Labels"
                    placeholder="Enter Labels"
                    data={[
                      "Functional Testing",
                      "Regression Issue",
                      "Functional issue",
                      "unit testing",
                    ]}
                    clearable
                    {...field}
                  />
                )}
              />

              <Stack>Status</Stack>
              <Flex gap={8}>
                <Controller
                  name="status.isArchived"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      label="Archived"
                    />
                  )}
                />
                <Controller
                  name="status.isActive"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      label="Active"
                    />
                  )}
                />
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
                <Controller
                  name="settings.notificationsEnabled"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      label="Notification"
                    />
                  )}
                />
                <Controller
                  name="settings.issueAutoAssign"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      checked={value}
                      onChange={onChange}
                      label="Auto Assign"
                    />
                  )}
                />
              </Flex>
              <TextInput
                label="Issue prefix"
                placeholder="PROJ"
                withAsterisk
                {...register("issuePrefix", {
                  required: "Issue prefix is required",
                })}
                error={errors.issuePrefix?.message as string}
              />
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  rightSection={
                    isEditMode ? (
                      <IconDeviceFloppy size={16} />
                    ) : (
                      <IconPlus size={16} />
                    )
                  }
                  type="submit"
                  loading={isCreating || isUpdating}
                >
                  {isEditMode ? "Update" : "Create"}
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
