import {
  Modal,
  Card,
  Stack,
  TextInput,
  Textarea,
  ColorInput,
  MultiSelect,
  Group,
  Button,
  Portal,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
interface CreateProjectProps {
  opened: boolean;
  onClose: () => void;
}
const CreateProject = ({ opened, onClose }: CreateProjectProps) => {
  const [members, setMembers] = useState([]);

  return (
    <Portal>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Create New Project"
        centered
        size="lg"
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <TextInput
              label="Project Name"
              placeholder="Enter project name"
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe your project"
              minRows={3}
            />

            <ColorInput
              label="Project Color"
              placeholder="Pick a color"
              defaultValue="#228be6"
            />

            <MultiSelect
              label="Add Members"
              placeholder="Select members"
              data={[
                { value: "1", label: "Alice" },
                { value: "2", label: "Bob" },
                { value: "3", label: "Charlie" },
              ]}
              value={members}
              onChange={setMembers}
              searchable
              nothingFound="No users found"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button leftSection={<IconPlus size={16} />}>Create</Button>
            </Group>
          </Stack>
        </Card>
      </Modal>
    </Portal>
  );
};

export default CreateProject;
