import { Box, Text, Group } from "@mantine/core";

const Footer = () => {
  return (
    <Box
      component="footer"
      py="md"
      px="lg"
      style={{
        borderTop: "1px solid #e9ecef",
        backgroundColor: "#f8f9fa",
        marginTop: "auto",
      }}
    >
      <Group justify="space-between">
        <Text size="sm" color="dimmed">
          © {new Date().getFullYear()} BugBucket. All rights reserved.
        </Text>
        <Text size="sm" color="dimmed">
          Made with 🐞 and ☕
        </Text>
      </Group>
    </Box>
  );
};

export default Footer;
