import NavigationBar from "../global/NavigationBar";
import { Outlet } from "react-router-dom";
import GlobalSideBar from "../global/GlobalSideBar";

function Dashboard() {
  return (
    <div className="app">
      <GlobalSideBar />
      <main className="content">
        <NavigationBar />
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
