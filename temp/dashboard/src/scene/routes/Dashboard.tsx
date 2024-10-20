import NavigationBar from "../components/dashboard/global/NavigationBar";
import { Outlet } from "react-router-dom";
import GlobalSideBar from "../components/dashboard/global/GlobalSideBar";

function Dashboard() {
  return (
    <div className="app">
      <GlobalSideBar />
      <main className="content" style={{maxHeight: "100vh"}}>
        <NavigationBar />
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
