import React, { useState } from "react";
import { Container, Navbar, Nav, Card } from "react-bootstrap";
import RealMDashboard from "./RealMDashboard";
import RxJsDashboard from "./RxDbDashboard";
import Logo from "../logo.svg";
import SQLiteDashboard from "./SQLiteDashboard";
import { version } from "./../../../package.json";
import { IDatabaseMode } from "../components/DatabaseDetail";

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

  return (
    <>
      <header>
        <Navbar
          bg="dark"
          variant="dark"
          className="justify-content-between"
          fixed="top"
        >
          <div>
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
          </div>
          <div>
            <Nav className="pr-5">
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
          </div>
        </Navbar>
      </header>
      <main>
        <Container>
          <Card className="p-3 mb-5 text-center text-light bg-dark">
            <h1> Electron - React - {databaseMode}</h1>
          </Card>
          {dashboard}
        </Container>
      </main>
      <footer>
        <Navbar
          fixed="bottom"
          className="bg-dark justify-content-between footer px-3 py-1 "
        >
          <span className="text-muted font-weight-lighter ">
            Copyright © {new Date().getFullYear()} Vazra. MIT License.
          </span>
          <span className="text-muted float-right font-weight-lighter">
            v{version}
          </span>
        </Navbar>
      </footer>
    </>
  );
}

export default Home;
