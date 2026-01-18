import { Outlet } from "react-router-dom";
import { Box } from "@mantine/core";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <Box
      style={{
        height: "100vh", // Fixed height
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent body scroll
      }}
    >
      <Header />
      <Box
        component="main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;
