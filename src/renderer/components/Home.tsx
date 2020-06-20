import React, { useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import RealMDashboard from "./RealMDashboard";
import RxJsDashboard from "./Dashboard";
import Logo from "../logo.svg";
import SQLiteDashboard from "./SQLiteDashboard";
type IDatabaseMode = "RxDB" | "SQLite" | "Realm";

// interface IHome {
//   children: React.ReactNode;
// }

export function Home() {
  const [databaseMode, setDatabaseMode] = useState<IDatabaseMode>("RxDB");

  let dashboard = <></>;

  switch (databaseMode) {
    case "RxDB":
      dashboard = <RxJsDashboard />;
      break;
    case "Realm":
      dashboard = <RealMDashboard />;
      break;
    case "SQLite":
      dashboard = <SQLiteDashboard />;
      break;

    default:
      dashboard = <></>;
      break;
  }

  // const logo = path.join(__static, "/logo.svg");
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">
          <img
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
        </Navbar.Brand>
        <Navbar.Brand href="#home">Electron-React</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link
            active={databaseMode === "RxDB"}
            onClick={() => {
              setDatabaseMode("RxDB");
            }}
          >
            RxDB
          </Nav.Link>
          <Nav.Link
            active={databaseMode === "Realm"}
            onClick={() => {
              setDatabaseMode("Realm");
            }}
          >
            Realm
          </Nav.Link>
          <Nav.Link
            active={databaseMode === "SQLite"}
            onClick={() => {
              setDatabaseMode("SQLite");
            }}
          >
            SQLite
          </Nav.Link>
        </Nav>
      </Navbar>

      <Container className="p-3" style={{ paddingTop: "300px" }}>
        {dashboard}
      </Container>
    </>
  );
}

export default Home;
