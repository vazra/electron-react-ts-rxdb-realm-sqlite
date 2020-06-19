import React, { useState } from "react";
import { Container, Jumbotron, Button } from "react-bootstrap";
// import RealMDashboard from "./RealMDashboard";
import RxJsDashboard from "./Dashboard";
import SQLiteDashboard from "./SQLiteDashboard";

// interface IHome {
//   children: React.ReactNode;
// }

export function Home() {
  const [isRxDB, setIsRxDB] = useState<boolean>(true);

  const title = isRxDB ? `RxDB ` : `SQLite`;
  const dashboard = isRxDB ? <RxJsDashboard /> : <SQLiteDashboard />;
  return (
    <Container className="p-3">
      <Jumbotron style={{ textAlign: "center" }}>
        <h1 className="header"> {title}- Electron - React</h1>
        <p>
          <Button
            variant="outline-primary"
            onClick={() => {
              setIsRxDB((val) => !val);
            }}
          >
            switch to {!isRxDB ? `RxDB ` : `Realm`}
          </Button>
        </p>
      </Jumbotron>
      {dashboard}
    </Container>
  );
}

export default Home;
