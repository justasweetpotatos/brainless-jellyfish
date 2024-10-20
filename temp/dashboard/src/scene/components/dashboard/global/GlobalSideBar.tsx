import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tokens } from "../../../../theme";
import {
  HomeOutlined as HomeOutlinedIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  ContactsOutlined as ContactsOutlinedIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  HelpOutline as HelpOutlineOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  PieChartOutline as PieChartOutlinedIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
  MapOutlined as MapOutlinedIcon,
} from "@mui/icons-material";

const dashboardRoute = "/dashboard";

const dashboardRouteList = [
  { title: "Overview", to: `${dashboardRoute}/`, icon: <BarChartOutlinedIcon /> },
  { title: "Manage Team", to: `${dashboardRoute}/team`, icon: <PeopleOutlinedIcon /> },
  { title: "Contacts Information", to: `${dashboardRoute}/contacts`, icon: <ContactsOutlinedIcon /> },
  { title: "Invoices Balances", to: `${dashboardRoute}/invoices`, icon: <ReceiptOutlinedIcon /> },
  { title: "Profile Form", to: `${dashboardRoute}/form`, icon: <PersonOutlinedIcon /> },
  { title: "Calendar", to: `${dashboardRoute}/calendar`, icon: <CalendarTodayOutlinedIcon /> },
  { title: "FAQ Page", to: `${dashboardRoute}/faq`, icon: <HelpOutlineOutlinedIcon /> },
  { title: "Pie Chart", to: `${dashboardRoute}/pie`, icon: <PieChartOutlinedIcon /> },
  { title: "Line Chart", to: `${dashboardRoute}/line`, icon: <TimelineOutlinedIcon /> },
  { title: "Geography Chart", to: `${dashboardRoute}/geography`, icon: <MapOutlinedIcon /> },
];

interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

const Item: React.FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelected(title);
    navigate(to);
  };

  useEffect(() => {
    if (selected === title) {
      document.title = `${title} - My App`;
    }
  }, [selected, title]);

  return (
    <MenuItem
      active={selected === title}
      onClick={handleClick}
      icon={icon}
      style={{
        height: "60px",
        backgroundColor: selected === title ? colors.primary[500] : colors.primary[400],
        color: selected === title ? "#868dfb" : "inherit",
      }}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

function GlobalSideBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Set the initial selected item based on the current path
    const currentPath = location.pathname;
    const currentRoute = dashboardRouteList.find((route) => route.to === currentPath);
    if (currentRoute) {
      setSelected(currentRoute.title);
    } else {
      setSelected("Overview"); // Default to Overview if no match
    }
  }, [location.pathname]);

  return (
    <Box
      sx={{
        "& .ps-menu-root": {
          background: `${colors.primary[400]} !important`,
          height: "100%",
          transition: ".1s ease-in-out",
        },
        "& .ps-sidebar-container": {
          backgroundColor: `${colors.primary[400]} !important`,
          height: "100vh",
          overflow: "hidden",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu
          menuItemStyles={{
            button: {
              transition: ".1s ease-in-out",
              ":hover": {
                color: "#868dfb !important",
                backgroundColor: colors.primary[500],
              },
              ":active": {
                color: "#868dfb !important",
                backgroundColor: colors.primary[500],
              },
            },
          }}
        >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={<MenuOutlinedIcon />}
            rootStyles={{ margin: "0 0 20px 0", color: colors.grey[100] }}
          />

          <Box mb="25px">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: isCollapsed ? "50px" : "100px",
                transition: ".1s ease-in-out",
              }}
            >
              <img
                alt="profile-user"
                width={isCollapsed ? "40px" : "80px"}
                height={isCollapsed ? "40px" : "80px"}
                src={process.env.PUBLIC_URL + "/serverTestIco.png"}
                style={{ cursor: "pointer", borderRadius: "50%", margin: "auto", transition: ".1s ease-in-out" }}
              />
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h3"
                style={{
                  color: isCollapsed ? "transparent" : colors.grey[100],
                  fontWeight: "bold",
                  margin: "10px 0 0 0",
                  whiteSpace: "nowrap",
                  transition: ".1s ease-in-out",
                  height: isCollapsed ? "0px" : "max-content",
                }}
              >
                {isCollapsed ? "" : "Thiên Hà Của Sứa"}
              </Typography>
              <Typography
                variant="h5"
                style={{
                  color: isCollapsed ? "transparent" : colors.greenAccent[500],
                  whiteSpace: "nowrap",
                  transition: ".1s ease-in-out",
                  height: isCollapsed ? "0px" : "max-content",
                }}
              >
                {isCollapsed ? "" : `User session: Test`}
              </Typography>
            </Box>
          </Box>

          <Box paddingLeft={isCollapsed ? undefined : "3%"} paddingTop={`5%`}>
            {dashboardRouteList.map((route) => (
              <Item
                key={route.title}
                title={route.title}
                to={route.to}
                icon={route.icon}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
}

export default GlobalSideBar;
