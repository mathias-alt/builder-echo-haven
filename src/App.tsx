import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CrmDashboard from "./crm/CrmDashboard";
import BusinessCanvasDashboard from "./dashboard/BusinessCanvasDashboard";
import LandingPage from "./landing/LandingPage";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import CanvasPage from "./canvas/CanvasPage";
import TeamManagementPage from "./team/TeamManagementPage";
import InvitationLandingPage from "./invite/InvitationLandingPage";
import JoinCompanyPage from "./invite/JoinCompanyPage";
import InvitePage from "./invite/InvitePage";

function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<BusinessCanvasDashboard />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/team" element={<TeamManagementPage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/invite/:token" element={<InvitationLandingPage />} />
        <Route path="/invite/join" element={<JoinCompanyPage />} />
        <Route path="/crm/*" element={<CrmDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
