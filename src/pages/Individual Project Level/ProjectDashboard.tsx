import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../store/projectApi";
import { useGetProjectTicketsQuery } from "../../store/api/ticketApi";
import {
  Container,
  Title,
  Text,
  Loader,
  Group,
  Button,
  Stack,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const ProjectDashboard = () => {
  const { id } = useParams();
  const { data: projectData, isLoading: projectLoading } =
    useGetProjectByIdQuery(id as string);
  const { data: ticketData, isLoading: ticketLoading } =
    useGetProjectTicketsQuery(id);

  if (projectLoading || ticketLoading) {
    return <Loader />;
  }

  const project = projectData;
  const tickets = ticketData?.data || [];

  return (
    <Stack p="md" gap="lg" h="100%" style={{ overflow: "hidden" }}>
      {/* Fixed Header Section */}
      <Stack gap="xs" style={{ flexShrink: 0 }}>
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>{project?.name}</Title>
            <Text c="dimmed" size="sm" lineClamp={1}>
              {project?.description}
            </Text>
          </div>
          <Button leftSection={<IconPlus size={16} />}>Create Issue</Button>
        </Group>
        {/* Can add filters/tabs here later */}
      </Stack>

      {/* Scrollable Content Area */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
        {/* Placeholder for Kanban Board */}
        <div
          style={{
            height: "2000px",
            background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
          }}
        >
          <Text p="md" c="dimmed">
            Scrollable area test...
          </Text>
        </div>
      </div>
    </Stack>
  );
};

export default ProjectDashboard;
