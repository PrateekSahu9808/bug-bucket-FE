import { useParams } from "react-router-dom";
import { useGetProjectTicketsQuery } from "../../../store/api/ticketApi";
import { useGetProjectByIdQuery } from "../../../store/projectApi";
import {
  Title,
  Text,
  Loader,
  Center,
  Stack,
  Group,
  Grid,
  Card,
  ThemeIcon,
  Avatar,
  Table,
  Badge,
} from "@mantine/core";
import { PieChart, BarChart } from "@mantine/charts";
import {
  IconTicket,
  IconCheck,
  IconSettings,
  IconUsers,
  IconListDetails,
} from "@tabler/icons-react";
import "@mantine/charts/styles.css";

const STATUS_COLORS: Record<string, string> = {
  "To Do": "gray.6",
  "In Progress": "blue.6",
  Done: "green.6",
  Blocked: "red.6",
  Reopened: "orange.6",
};

const Report = () => {
  const { id } = useParams();
  const { data: ticketsRes, isLoading: ticketsLoading } =
    useGetProjectTicketsQuery(id as string);
  const { data: projectData, isLoading: projectLoading } =
    useGetProjectByIdQuery(id as string);

  if (ticketsLoading || projectLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" type="bars" />
      </Center>
    );
  }

  const tickets = ticketsRes?.data || [];
  const project = projectData?.data || projectData;

  console.log("PROJECT DATA:", project);
  console.log("TICKETS DATA:", tickets);

  // 1. Status Distribution Data for Pie Chart
  const statusCounts = tickets.reduce(
    (acc: Record<string, number>, ticket: any) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    },
    {},
  );

  const pieChartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status],
    color: STATUS_COLORS[status] || "teal.6",
  }));

  // 2. Member Workload Data
  // Combine owner and members
  const allMembers = [
    ...(project?.owner ? [{ user: project.owner, role: "Owner" }] : []),
    ...(project?.members?.map((m: any) => ({ user: m.userId, role: m.role })) ||
      []),
  ].filter(m => m.user); // remove nulls

  const memberStats = allMembers.map((member: any) => {
    const userId =
      typeof member.user === "string" ? member.user : member.user._id;
    const userName =
      typeof member.user === "string"
        ? "Unknown User"
        : member.user.name || "Unknown User";
    const userAvatar =
      typeof member.user === "string" ? null : member.user.avatar;

    const memberTickets = tickets.filter((t: any) => {
      const assigneeId = t.assignee
        ? typeof t.assignee === "string"
          ? t.assignee
          : t.assignee._id
        : null;
      return assigneeId === userId;
    });

    const counts = memberTickets.reduce(
      (acc: Record<string, number>, t: any) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      id: userId,
      name: userName,
      avatar: userAvatar,
      total: memberTickets.length,
      "To Do": counts["To Do"] || 0,
      "In Progress": counts["In Progress"] || 0,
      Done: counts["Done"] || 0,
    };
  });

  const barChartData = memberStats.map(stat => ({
    name: stat.name.split(" ")[0], // First name for chart label
    "To Do": stat["To Do"],
    "In Progress": stat["In Progress"],
    Done: stat["Done"],
  }));

  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(
    (t: any) => t.status === "Done",
  ).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" }}>
      <Stack p="md" gap="xl" pb="xl">
      <div>
        <Title order={2}>Project Insights</Title>
        <Text c="dimmed" size="sm">
          Analytics and workload distribution for {project?.name}
        </Text>
      </div>

      {/* Top Level KPIs */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 as any }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" tt="uppercase" fw={700} size="xs">
                  Total Issues
                </Text>
                <Text fw={700} size="xl">
                  {totalTickets}
                </Text>
              </div>
              <ThemeIcon color="blue" variant="light" size={38} radius="md">
                <IconTicket size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 as any }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" tt="uppercase" fw={700} size="xs">
                  To Do
                </Text>
                <Text fw={700} size="xl">
                  {statusCounts["To Do"] || 0}
                </Text>
              </div>
              <ThemeIcon color="gray" variant="light" size={38} radius="md">
                <IconListDetails size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 as any }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" tt="uppercase" fw={700} size="xs">
                  In Progress
                </Text>
                <Text fw={700} size="xl">
                  {statusCounts["In Progress"] || 0}
                </Text>
              </div>
              <ThemeIcon color="orange" variant="light" size={38} radius="md">
                <IconSettings size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 as any }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" tt="uppercase" fw={700} size="xs">
                  Completed
                </Text>
                <Text fw={700} size="xl">
                  {completedTickets}
                </Text>
              </div>
              <ThemeIcon color="green" variant="light" size={38} radius="md">
                <IconCheck size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2.4 as any }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" tt="uppercase" fw={700} size="xs">
                  Team Members
                </Text>
                <Text fw={700} size="xl">
                  {allMembers.length}
                </Text>
              </div>
              <ThemeIcon color="violet" variant="light" size={38} radius="md">
                <IconUsers size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid gutter="xl">
        {/* Status Distribution Chart */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="sm" padding="xl" radius="md" withBorder h="100%">
            <Title order={4} mb="xl">
              Issue Distribution
            </Title>
            {pieChartData.length > 0 ? (
              <Center>
                <PieChart
                  data={pieChartData}
                  withTooltip
                  tooltipDataSource="segment"
                  size={250}
                  labelsPosition="outside"
                  withLabels
                  labelsType="percent"
                />
              </Center>
            ) : (
              <Center h={200}>
                <Text c="dimmed">No issues to display</Text>
              </Center>
            )}
          </Card>
        </Grid.Col>

        {/* Workload Bar Chart */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="sm" padding="xl" radius="md" withBorder h="100%">
            <Title order={4} mb="xl">
              Workload by Member
            </Title>
            {barChartData.length > 0 ? (
              <BarChart
                h={250}
                data={barChartData}
                dataKey="name"
                type="stacked"
                series={[
                  { name: "To Do", color: "gray.6" },
                  { name: "In Progress", color: "blue.6" },
                  { name: "Done", color: "green.6" },
                ]}
                tickLine="y"
              />
            ) : (
              <Center h={200}>
                <Text c="dimmed">No workload to display</Text>
              </Center>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* Detailed Member Issue Statistics Table */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Title order={4} mb="md">
          Member Statistics
        </Title>
        <Table.ScrollContainer minWidth={500}>
          <Table verticalSpacing="sm" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Member</Table.Th>
                <Table.Th>Total Assigned</Table.Th>
                <Table.Th>To Do</Table.Th>
                <Table.Th>In Progress</Table.Th>
                <Table.Th>Done</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {memberStats.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      No members found. (Debug: Project keys:{" "}
                      {Object.keys(project || {}).join(", ")})
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                memberStats.map(stat => (
                  <Table.Tr key={stat.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar
                          size={30}
                          src={stat.avatar}
                          radius="xl"
                          color="blue"
                        >
                          {stat.name ? stat.name.charAt(0) : "?"}
                        </Avatar>
                        <Text size="sm" fw={500}>
                          {stat.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="filled" color="gray">
                        {stat.total}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{stat["To Do"]}</Table.Td>
                    <Table.Td>{stat["In Progress"]}</Table.Td>
                    <Table.Td>{stat["Done"]}</Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
      </Stack>
    </div>
  );
};

export default Report;
