import { useParams, useNavigate } from "react-router-dom";
import { useGetTicketByIdQuery, useUpdateTicketMutation } from "../../../store/api/ticketApi";
import { useGetProjectByIdQuery } from "../../../store/projectApi";
import {
  Stack,
  Group,
  Title,
  Text,
  Loader,
  Center,
  Grid,
  Paper,
  TextInput,
  Textarea,
  Select,
  Button,
  ActionIcon,
  Badge,
  NumberInput,
  Divider,
  Switch,
  MultiSelect,
} from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

const TicketDetail = () => {
  const { id, ticketId } = useParams();
  const navigate = useNavigate();

  const { data: ticketRes, isLoading: ticketLoading } = useGetTicketByIdQuery(ticketId as string);
  const { data: projectData, isLoading: projectLoading } = useGetProjectByIdQuery(id as string);
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();

  const [formData, setFormData] = useState<any>({});
  const [customFieldsData, setCustomFieldsData] = useState<any>({});

  const ticket = ticketRes?.data;
  const project = projectData;

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description || "",
        type: ticket.type,
        priority: ticket.priority,
        status: ticket.status,
        assignee: ticket.assignee?._id || null,
      });
      setCustomFieldsData(ticket.customFields || {});
    }
  }, [ticket]);

  if (ticketLoading || projectLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" type="bars" />
      </Center>
    );
  }

  if (!ticket || !project) {
    return <Center style={{ height: "100vh" }}><Text>Not found</Text></Center>;
  }

  const assigneeOptions = [
    ...(project.owner ? [{ value: project.owner._id, label: `${project.owner.name} (Owner)` }] : []),
    ...(project.members?.reduce((acc: any[], m: any) => {
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

  const handleUpdate = async () => {
    try {
      await updateTicket({ 
        id: ticketId as string, 
        ...formData,
        customFields: customFieldsData
      }).unwrap();
      notifications.show({ title: "Success", message: "Ticket updated", color: "green" });
    } catch (err) {
      notifications.show({ title: "Error", message: "Failed to update ticket", color: "red" });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCustomFieldChange = (field: string, value: any) => {
     setCustomFieldsData((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderCustomField = (field: any) => {
    if (!field.isEnabled) return null;

    const value = customFieldsData[field.name] !== undefined ? customFieldsData[field.name] : (field.defaultValue || "");

    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={field.name}
            label={field.name}
            required={field.isRequired}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.name}
            label={field.name}
            required={field.isRequired}
            minRows={3}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
          />
        );
      case "number":
        return (
          <NumberInput
             key={field.name}
             label={field.name}
             required={field.isRequired}
             value={value}
             onChange={(val) => handleCustomFieldChange(field.name, val)}
          />
        );
      case "select":
        return (
          <Select
             key={field.name}
             label={field.name}
             required={field.isRequired}
             data={field.options || []}
             value={value}
             onChange={(val) => handleCustomFieldChange(field.name, val)}
          />
        );
      case "multiselect":
        return (
          <MultiSelect
             key={field.name}
             label={field.name}
             required={field.isRequired}
             data={field.options || []}
             value={value || []}
             onChange={(val) => handleCustomFieldChange(field.name, val)}
          />
        );
      case "toggle":
        return (
          <Switch
            key={field.name}
            label={field.name}
            checked={!!value}
            onChange={(e) => handleCustomFieldChange(field.name, e.currentTarget.checked)}
            mt="xs"
          />
        );
      case "date":
        return (
           <TextInput
            key={field.name}
            type="date"
            label={field.name}
            required={field.isRequired}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
          />
        )
      default:
        return null;
    }
  };

  // We use the snapshot saved on the ticket, so historical tickets don't break if a template changes.
  const customFieldsToRender = ticket.templateSnapshot || [];

  return (
    <Stack p="md" gap="lg" h="100%">
      {/* Header */}
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => navigate(`/home/project/${id}`)}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Badge color="blue" variant="light">{ticket.type}</Badge>
          <Text c="dimmed">{project.name} / {ticket._id.substring(ticket._id.length - 6)}</Text>
        </Group>
        <Button 
          leftSection={<IconDeviceFloppy size={16} />} 
          onClick={handleUpdate} 
          loading={isUpdating}
        >
          Save Changes
        </Button>
      </Group>

      {/* Main Content Area */}
      <Grid gutter="xl">
        {/* Left Side: Title and Description */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="xl">
            <TextInput
              label="Title"
              size="lg"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              styles={{ input: { fontSize: '1.25rem', fontWeight: 600 } }}
            />

            <Textarea
              label="Description"
              placeholder="Add a detailed description..."
              minRows={10}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {customFieldsToRender.length > 0 && (
               <>
                 <Divider label="Custom Fields" labelPosition="center" />
                 <Stack gap="md">
                    {customFieldsToRender.map(renderCustomField)}
                 </Stack>
               </>
            )}
          </Stack>
        </Grid.Col>

        {/* Right Side: Details and Attributes */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Title order={5} c="dimmed" tt="uppercase" size="xs">Details</Title>
              
              <Select
                label="Status"
                data={["To Do", "In Progress", "Done"]}
                value={formData.status}
                onChange={(val) => handleChange("status", val)}
              />

              <Select
                label="Assignee"
                placeholder="Unassigned"
                data={assigneeOptions}
                value={formData.assignee}
                onChange={(val) => handleChange("assignee", val)}
                clearable
                searchable
              />

              <Select
                label="Priority"
                data={["Low", "Medium", "High", "Critical"]}
                value={formData.priority}
                onChange={(val) => handleChange("priority", val)}
              />

              <Select
                label="Type"
                data={["Task", "Bug", "Story"]}
                value={formData.type}
                onChange={(val) => handleChange("type", val)}
              />

              <Group mt="xl" justify="space-between">
                <Text size="xs" c="dimmed">Reporter</Text>
                <Text size="sm">{ticket.reporter?.name || 'Unknown'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">Created</Text>
                <Text size="sm">{new Date(ticket.createdAt).toLocaleDateString()}</Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default TicketDetail;
