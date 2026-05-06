import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Select,
  Stack,
  Group,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";

import { notifications } from "@mantine/notifications";
import { useCreateTicketMutation } from "../../../store/api/ticketApi";

type CreateTicketModalProps = {
  opened: boolean;
  onClose: () => void;
  projectId: string;
  members: any[];
  owner: any;
};

type TicketFormData = {
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  assignee: string | null;
};

const CreateTicketModal = ({
  opened,
  onClose,
  projectId,
  members,
  owner,
}: CreateTicketModalProps) => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    defaultValues: {
      type: "Task",
      priority: "Medium",
      status: "To Do",
      description: "",
      assignee: null,
    },
  });

  const assigneeOptions = [
    ...(owner ? [{ value: owner._id, label: `${owner.name} (Owner)` }] : []),
    ...(members?.reduce((acc: any[], m: any) => {
      const user = m.userId;
      if (user) {
        acc.push({
          value: typeof user === 'string' ? user : user._id,
          label: typeof user === 'string' ? user : user.name || "Unknown User",
        });
      }
      return acc;
    }, []) || []),
  ];

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket({ ...data, project: projectId }).unwrap();
      notifications.show({
        title: "Success",
        message: "Ticket created successfully",
        color: "green",
      });
      reset();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create ticket",
        color: "red",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Issue"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="What needs to be done?"
            required
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <Textarea
            label="Description"
            placeholder="Add more details..."
            minRows={4}
            {...register("description")}
          />

          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Select
                label="Assignee"
                placeholder="Unassigned"
                data={assigneeOptions}
                clearable
                searchable
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Group grow>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  label="Type"
                  data={["Task", "Bug", "Story"]}
                  {...field}
                />
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  label="Priority"
                  data={["Low", "Medium", "High", "Critical"]}
                  {...field}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Status"
                  data={["To Do", "In Progress", "Done"]}
                  {...field}
                />
              )}
            />
          </Group>

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Create Issue
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
