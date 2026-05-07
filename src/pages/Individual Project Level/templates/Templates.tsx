import { useParams } from "react-router-dom";
import {
  useGetProjectTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} from "../../../store/api/templateApi";
import {
  Title,
  Text,
  Loader,
  Group,
  Button,
  Stack,
  Center,
  Card,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Switch,
  Divider,
  Grid,
} from "@mantine/core";
import { IconPlus, IconTrash, IconPencil } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

const Templates = () => {
  const { id } = useParams();
  const { data: templateData, isLoading, refetch } = useGetProjectTemplatesQuery(id as string);
  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
  const [deleteTemplate] = useDeleteTemplateMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setIsDefault(editingTemplate.isDefault);
      setFields(editingTemplate.fields || []);
    } else {
      setName("");
      setIsDefault(false);
      setFields([]);
    }
  }, [editingTemplate, isModalOpen]);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (template: any) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const addField = () => {
    setFields([
      ...fields,
      { name: "", type: "text", isRequired: false, isEnabled: true, order: fields.length, options: [] },
    ]);
  };

  const updateField = (index: number, key: string, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      notifications.show({ title: "Error", message: "Template name is required", color: "red" });
      return;
    }

    try {
      if (editingTemplate) {
        await updateTemplate({
          id: editingTemplate._id,
          name,
          isDefault,
          fields,
        }).unwrap();
        notifications.show({ title: "Success", message: "Template updated", color: "green" });
      } else {
        await createTemplate({
          project: id,
          name,
          isDefault,
          fields,
        }).unwrap();
        notifications.show({ title: "Success", message: "Template created", color: "green" });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      notifications.show({ title: "Error", message: "Failed to save template", color: "red" });
    }
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(templateId).unwrap();
        notifications.show({ title: "Success", message: "Template deleted", color: "green" });
        refetch();
      } catch (err: any) {
        notifications.show({ title: "Error", message: err.data?.message || "Failed to delete template", color: "red" });
      }
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" type="bars" />
      </Center>
    );
  }

  const templates = templateData?.data || [];

  return (
    <Stack p="md" gap="lg" h="100%" style={{ overflowY: "auto" }}>
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Ticket Templates</Title>
          <Text c="dimmed" size="sm">
            Manage templates and custom fields for this project.
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
          Create Template
        </Button>
      </Group>

      <Grid gutter="md">
        {templates.map((template: any) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={template._id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <Text fw={500}>{template.name}</Text>
                  {template.isDefault && <Badge color="green">Default</Badge>}
                </Group>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenEdit(template)}>
                    <IconPencil size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(template._id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                {template.fields.length} Custom Fields
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal opened={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTemplate ? "Edit Template" : "Create Template"} size="xl">
        <Stack gap="md">
          <Group grow align="flex-end">
            <TextInput
              label="Template Name"
              placeholder="e.g., Bug Report"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Switch
              label="Set as Default Template"
              checked={isDefault}
              onChange={(event) => setIsDefault(event.currentTarget.checked)}
            />
          </Group>

          <Divider my="sm" />
          
          <Group justify="space-between">
            <Title order={4}>Custom Fields</Title>
            <Button variant="outline" size="xs" onClick={addField}>+ Add Field</Button>
          </Group>

          {fields.length === 0 ? (
            <Text c="dimmed" fs="italic" ta="center" py="md">No custom fields added yet. The default ticket fields (Title, Description, etc.) will always be present.</Text>
          ) : (
            fields.map((field, index) => (
              <Card key={index} withBorder shadow="none" p="sm">
                <Grid align="flex-end">
                  <Grid.Col span={4}>
                    <TextInput
                      label="Field Name"
                      value={field.name}
                      onChange={(e) => updateField(index, "name", e.target.value)}
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      label="Field Type"
                      data={["text", "textarea", "number", "select", "multiselect", "date", "toggle"]}
                      value={field.type}
                      onChange={(val) => updateField(index, "type", val)}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                     <Stack gap={5}>
                        <Switch
                          label="Required"
                          checked={field.isRequired}
                          onChange={(e) => updateField(index, "isRequired", e.currentTarget.checked)}
                        />
                        <Switch
                          label="Enabled"
                          checked={field.isEnabled}
                          onChange={(e) => updateField(index, "isEnabled", e.currentTarget.checked)}
                        />
                     </Stack>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <ActionIcon color="red" variant="light" onClick={() => removeField(index)} mb={5}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
                {(field.type === "select" || field.type === "multiselect") && (
                  <TextInput
                    mt="sm"
                    label="Options (comma separated)"
                    placeholder="Option 1, Option 2"
                    value={field.options?.join(", ")}
                    onChange={(e) => updateField(index, "options", e.target.value.split(",").map(s => s.trim()))}
                  />
                )}
              </Card>
            ))
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={isCreating || isUpdating}>Save Template</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default Templates;
