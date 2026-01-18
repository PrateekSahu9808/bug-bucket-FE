import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../store/projectApi";
import { useGetProjectTicketsQuery } from "../../store/api/ticketApi";
import { Container, Title, Text, Loader, Group, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const ProjectDashboard = () => {
  const { id } = useParams();
  const { data: projectData, isLoading: projectLoading } =
    useGetProjectByIdQuery(id as string);
  const { data: ticketData, isLoading: ticketLoading } =
    useGetProjectTicketsQuery(id); // id is passed directly

  if (projectLoading || ticketLoading) {
    return <Loader />;
  }

  const project = projectData;
  // Ticket API response structure checks needed, assuming { data: [...] } or direct array?
  // Based on controller: res.status(200).json({ status: "success", results: ..., data: tickets })
  const tickets = ticketData?.data || [];

  return (
    <Container fluid p="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>{project?.name}</Title>
          <Text c="dimmed">{project?.description}</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />}>Create Issue</Button>
      </Group>

      <Text>
        Workflow: {project?.workflow?.map((w: any) => w.name).join(" -> ")}
      </Text>
      <Text>Tickets Found: {tickets.length}</Text>
    </Container>
  );
};

export default ProjectDashboard;
