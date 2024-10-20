import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Route, Routes } from "react-router-dom";
import Overview from "./scene/routes/dashboard/Overview";
import Dashboard from "./scene/routes/Dashboard"; // Đảm bảo import Dashboard

function App() {
  const { theme, colorMode } = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Overview />} /> {/* Route cho trang chính */}
          <Route path="/home" element={<Overview />} /> {/* Route cho trang home */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} /> {/* Route mặc định cho dashboard */}
            <Route path="team" element={<Overview />} />
            <Route path="contacts" element={<Overview />} />
            <Route path="invoices" element={<Overview />} />
            <Route path="form" element={<Overview />} />
            <Route path="bar" element={<Overview />} />
            <Route path="pie" element={<Overview />} />
            <Route path="line" element={<Overview />} />
            <Route path="faq" element={<Overview />} />
            <Route path="calendar" element={<Overview />} />
            <Route path="geography" element={<Overview />} />
          </Route>
          <Route path="*" element={<Overview />} /> {/* Route không khớp sẽ dẫn đến Overview */}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
