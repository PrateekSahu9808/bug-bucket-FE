import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../../store/projectApi";
import {
  useGetProjectTicketsQuery,
  useDeleteTicketMutation,
} from "../../../store/api/ticketApi";
import {
  Title,
  Text,
  Loader,
  Group,
  Button,
  Stack,
  Center,
  Grid,
  Card,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import CreateTicketModal from "./CreateTicketModal";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

const STAGES = ["To Do", "In Progress", "Done"];

const ProjectDashboard = () => {
  const { id } = useParams();
  const { data: projectData, isLoading: projectLoading } =
    useGetProjectByIdQuery(id as string);
  const { data: ticketData, isLoading: ticketLoading } =
    useGetProjectTicketsQuery(id);
  const [deleteTicket] = useDeleteTicketMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (projectLoading || ticketLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" type="bars" />
      </Center>
    );
  }

  const project = projectData;
  const tickets = ticketData?.data || [];

  const getTicketsByStatus = (status: string) => {
    return tickets.filter((ticket: any) => ticket.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "red";
      case "High":
        return "orange";
      case "Medium":
        return "yellow";
      case "Low":
        return "blue";
      default:
        return "gray";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bug":
        return "red";
      case "Story":
        return "green";
      case "Task":
        return "blue";
      default:
        return "gray";
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    modals.openConfirmModal({
      title: "Delete Ticket",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this ticket?</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },

      onConfirm: async () => {
        try {
          await deleteTicket(ticketId).unwrap();

          notifications.show({
            title: "Success",
            message: "Ticket deleted",
            color: "green",
          });
        } catch (err) {
          notifications.show({
            title: "Error",
            message: "Failed to delete ticket",
            color: "red",
          });
        }
      },
    });
  };

  return (
    <>
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
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Issue
            </Button>
          </Group>
        </Stack>

        {/* Scrollable Content Area: Kanban Board */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            paddingRight: "8px",
          }}
        >
          <Grid gutter="md" style={{ minWidth: "800px", height: "100%" }}>
            {STAGES.map(stage => (
              <Grid.Col
                span={4}
                key={stage}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "16px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Group justify="space-between" mb="xs">
                    <Title order={4} size="h5" c="dark.7">
                      {stage}
                    </Title>
                    <Badge color="gray" variant="light">
                      {getTicketsByStatus(stage).length}
                    </Badge>
                  </Group>

                  {getTicketsByStatus(stage).map((ticket: any) => (
                    <Card
                      key={ticket._id}
                      shadow="xs"
                      padding="sm"
                      radius="md"
                      withBorder
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/home/project/${id}/ticket/${ticket._id}`)}
                    >
                      <Stack gap="xs">
                        <Group
                          justify="space-between"
                          wrap="nowrap"
                          align="flex-start"
                        >
                          <Text
                            fw={500}
                            size="sm"
                            lineClamp={2}
                            style={{ flex: 1 }}
                          >
                            {ticket.title}
                          </Text>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket._id);
                            }}
                          >
                            <Tooltip label="Delete">
                              <IconTrash size={14} />
                            </Tooltip>
                          </ActionIcon>
                        </Group>

                        <Group justify="space-between" align="center" mt="sm">
                          <Group gap="xs">
                            <Badge
                              size="sm"
                              color={getTypeColor(ticket.type)}
                              variant="light"
                            >
                              {ticket.type}
                            </Badge>
                            <Badge
                              size="sm"
                              color={getPriorityColor(ticket.priority)}
                              variant="outline"
                            >
                              {ticket.priority}
                            </Badge>
                          </Group>
                          {ticket.assignee && (
                            <Tooltip
                              label={`Assigned to ${ticket.assignee.name}`}
                            >
                              <Badge size="sm" variant="dot" color="blue">
                                {ticket.assignee.name.split(" ")[0]}
                              </Badge>
                            </Tooltip>
                          )}
                        </Group>
                      </Stack>
                    </Card>
                  ))}

                  {getTicketsByStatus(stage).length === 0 && (
                    <Center style={{ flex: 1, minHeight: "100px" }}>
                      <Text c="dimmed" size="sm">
                        No tickets
                      </Text>
                    </Center>
                  )}
                </div>
              </Grid.Col>
            ))}
          </Grid>
        </div>
      </Stack>

      {id && project && (
        <CreateTicketModal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={id}
          members={project.members || []}
          owner={project.owner}
        />
      )}
    </>
  );
};

export default ProjectDashboard;
