import {
  Modal,
  Button,
  TextInput,
  Textarea,
  Select,
  Stack,
  Group,
  Divider,
  NumberInput,
  Switch,
  MultiSelect,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { useCreateTicketMutation } from "../../../store/api/ticketApi";
import { useGetProjectTemplatesQuery } from "../../../store/api/templateApi";
import { useEffect, useState, useMemo } from "react";

type CreateTicketModalProps = {
  opened: boolean;
  onClose: () => void;
  projectId: string;
  members: any[];
  owner: any;
};

const CreateTicketModal = ({
  opened,
  onClose,
  projectId,
  members,
  owner,
}: CreateTicketModalProps) => {
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const { data: templateData } = useGetProjectTemplatesQuery(projectId);
  const templates = templateData?.data || [];

  const defaultTemplate = useMemo(() => templates.find((t: any) => t.isDefault) || templates[0], [templates]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultTemplate && !selectedTemplateId) {
      setSelectedTemplateId(defaultTemplate._id);
    }
  }, [defaultTemplate, selectedTemplateId]);

  const activeTemplate = useMemo(() => templates.find((t: any) => t._id === selectedTemplateId), [templates, selectedTemplateId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      type: "Task",
      priority: "Medium",
      status: "To Do",
      description: "",
      assignee: null,
      customFields: {}
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

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        project: projectId,
        template: selectedTemplateId,
        templateSnapshot: activeTemplate?.fields || [],
      };

      await createTicket(payload).unwrap();
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

  const renderCustomField = (field: any) => {
    if (!field.isEnabled) return null;

    const fieldName = `customFields.${field.name}`;
    
    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={field.name}
            label={field.name}
            required={field.isRequired}
            {...register(fieldName, { required: field.isRequired ? `${field.name} is required` : false })}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.name}
            label={field.name}
            required={field.isRequired}
            minRows={3}
            {...register(fieldName, { required: field.isRequired ? `${field.name} is required` : false })}
          />
        );
      case "number":
        return (
          <Controller
            key={field.name}
            name={fieldName}
            control={control}
            rules={{ required: field.isRequired ? `${field.name} is required` : false }}
            render={({ field: controllerField }) => (
              <NumberInput
                label={field.name}
                required={field.isRequired}
                {...controllerField}
              />
            )}
          />
        );
      case "select":
        return (
          <Controller
            key={field.name}
            name={fieldName}
            control={control}
            rules={{ required: field.isRequired ? `${field.name} is required` : false }}
            render={({ field: controllerField }) => (
              <Select
                label={field.name}
                required={field.isRequired}
                data={field.options || []}
                {...controllerField}
              />
            )}
          />
        );
      case "multiselect":
        return (
          <Controller
            key={field.name}
            name={fieldName}
            control={control}
            rules={{ required: field.isRequired ? `${field.name} is required` : false }}
            render={({ field: controllerField }) => (
              <MultiSelect
                label={field.name}
                required={field.isRequired}
                data={field.options || []}
                {...controllerField}
              />
            )}
          />
        );
      case "toggle":
        return (
          <Controller
            key={field.name}
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Switch
                label={field.name}
                checked={controllerField.value || false}
                onChange={(e) => controllerField.onChange(e.currentTarget.checked)}
                mt="xs"
              />
            )}
          />
        );
      case "date":
        return (
           <TextInput
            key={field.name}
            type="date"
            label={field.name}
            required={field.isRequired}
            {...register(fieldName, { required: field.isRequired ? `${field.name} is required` : false })}
          />
        )
      default:
        return null;
    }
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
          {templates.length > 0 && (
            <Select
              label="Template"
              data={templates.map((t: any) => ({ value: t._id, label: t.name }))}
              value={selectedTemplateId}
              onChange={setSelectedTemplateId}
              allowDeselect={false}
              description="Selecting a different template will load its custom fields."
            />
          )}

          <TextInput
            label="Title"
            placeholder="What needs to be done?"
            required
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message as string}
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

          {activeTemplate?.fields && activeTemplate.fields.length > 0 && (
             <>
               <Divider my="sm" label="Custom Fields" labelPosition="center" />
               {activeTemplate.fields.map(renderCustomField)}
             </>
          )}

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
