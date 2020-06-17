import React, { useEffect, useState, useRef } from "react";
import { getDB, changeAdapter } from "../db/db";
import { RxDatabase } from "rxdb";
import { addUserstoDB } from "../utils/helper";
import {
  Container,
  Jumbotron,
  Button,
  Row,
  Col,
  Form,
  ProgressBar,
  Card,
  ButtonGroup,
  Spinner,
} from "react-bootstrap";
import { TableChangeType, TableChangeState } from "react-bootstrap-table-next";
import RemoteTable from "./RemoteTable";
import { UserDocType, MyDatabaseCollections, IAdapter } from "../types";

// interface IDashboard {
//   children: React.ReactNode;
// }

export function Dashboard() {
  const [users, setUsers] = useState<UserDocType[]>();
  const [db, setDB] = useState<RxDatabase<MyDatabaseCollections>>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [addCount, setAddCount] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);
  const [sizePerPage, setSizePerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [adapter, setAdapter] = useState<IAdapter>("memory");
  const [isLoading, setLoading] = useState<[boolean, string]>([false, ""]);
  const target = useRef<HTMLDivElement>(null);

  const [latestReadTime, setLatestReadTime] = useState<[number, number]>([
    334.54,
    20,
  ]);
  const [latestWriteTime, setLatestWriteTime] = useState<[number, number]>([
    334.54,
    20,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availabeAdapters, setAvailabeAdapters] = useState<IAdapter[]>([
    "idb",
    "memory",
    "leveldb",
    "websql",
  ]);

  useEffect(() => {
    // create the databse
    async function anyNameFunction() {
      setLoading([true, "initializing database"]);
      const theDB = await getDB(adapter);

      setDB(theDB);
      await addUserstoDB(theDB, 100, setProgress, setLatestWriteTime);

      const users = await theDB?.users?.getDocs(10, 1, setLatestReadTime);
      setUsers(users);
      setLoading([false, ""]);
    }
    anyNameFunction();
  }, [adapter]);

  const getDocs = async () => {
    const users =
      (await db?.users?.getDocs(sizePerPage, page, setLatestReadTime)) || [];
    setUsers(users);
  };

  const reloadUI = async () => {
    setProgress(0);
    setPage(1);
    setSizePerPage(10);
    setUsers([]);
    setTotalCount(0);

    const theDB = await getDB(adapter);
    setDB(theDB);

    await getDocs();
  };

  useEffect(() => {
    async function anyNameFunction() {
      console.log("here", sizePerPage, page);
      setLoading([true, "initializing database"]);
      const users = await db?.users?.getDocs(
        sizePerPage,
        page,
        setLatestReadTime
      );
      setUsers(users);
      setLoading([false, ""]);
    }
    anyNameFunction();

    // db?.users
    //   .getDocs(sizePerPage, page, setLatestReadTime)
    //   .then((docs) => {
    //     console.log("kkk got new users", docs);
    //     setUsers(docs);
    //   })
    //   .catch((err) => {
    //     console.error("Failed to get users", err);
    //   });
  }, [db, page, sizePerPage]);

  useEffect(() => {
    // Create an scoped async function in the hook
    async function anyNameFunction() {
      const theDB = await getDB(adapter);
      // await theDB?.users?.getCount().then((count) => {
      //   setTotalCount(count);
      // });

      // await theDB?.users?.getCountPouch().then((count) => {
      //   setTotalCount(count);
      // });

      await theDB?.users?.getCountWithInfo().then((count) => {
        setTotalCount(count);
      });
    }
    // Execute the created function directly
    anyNameFunction();
  }, [adapter, users]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAddCount(+e.target.value);
    setProgress(0);
  };
  const adapterLabel = {
    idb: "IndexedDB",
    memory: "In Memmory",
    websql: "Web SQL",
    leveldb: "Level DB",
    localstorage: "Local Storage",
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(0);
    db && (await addUserstoDB(db, addCount, setProgress, setLatestWriteTime));
    setAddCount(100);
    getDocs();
  };

  const progressInstance = (
    <ProgressBar now={progress} label={`${progress}%`} />
  );

  const handleTableChange = (
    type: TableChangeType,
    { page, sizePerPage }: TableChangeState<any>
  ) => {
    // if (type === "pagination")
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  // fetchCount();

  return (
    <Container className="p-3">
      <div ref={target}>
        <Jumbotron style={{ textAlign: "center" }}>
          <h1 className="header">RxDB ({adapterLabel[adapter]}) with React</h1>
        </Jumbotron>
      </div>
      <Row>
        <Col>
          <Form onSubmit={handleAddSubmit}>
            <Form.Row className="align-items-center">
              <Col xs="auto">
                <Form.Control
                  className="mb-1"
                  id="inlineFormInput"
                  placeholder="Enter No"
                  value={addCount}
                  onChange={handleChangeInput}
                />
              </Col>

              <Col xs="auto">
                <Button variant="success" type="submit" className="mb-2">
                  Add {addCount} Users
                </Button>
                <br />
                {progressInstance}
              </Col>
              <Col> </Col>
            </Form.Row>
          </Form>
        </Col>
        <Col>
          {isLoading[0] ? (
            <Row>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...{isLoading[1]}</span>
              </Spinner>
            </Row>
          ) : (
            <ButtonGroup aria-label="Adapters">
              {availabeAdapters.map((anAdapter) => (
                <Button
                  key={anAdapter}
                  onClick={async () => {
                    setLoading([true, `updating adapter ${anAdapter}`]);
                    await changeAdapter(anAdapter);
                    setAdapter(anAdapter);
                  }}
                  variant={anAdapter === adapter ? "info" : "outline-info"}
                >
                  {adapterLabel[anAdapter]}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </Col>

        <Col xs="auto">
          <Button
            variant="primary"
            className="mb-2"
            onClick={() => {
              reloadUI();
            }}
          >
            Reload
          </Button>{" "}
          <Button
            variant="outline-danger"
            className="mb-2"
            onClick={() => {
              reloadUI();
            }}
          >
            Delete DB
          </Button>{" "}
          <p>
            ({users?.length}/{totalCount}) Fetched
          </p>
        </Col>
        <Col xs="auto"></Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ marginTop: "16px" }}>
            <Card.Body>
              Latest Read Time : {latestReadTime[0]}ms for {latestReadTime[1]}{" "}
              docs
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ marginTop: "16px" }}>
            <Card.Body>
              Latest Write Time : {latestWriteTime[0]}ms for{" "}
              {latestWriteTime[1]} docs
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col style={{ marginTop: "16px" }}>
          <RemoteTable
            data={users || []}
            page={page}
            sizePerPage={sizePerPage}
            totalSize={totalCount}
            onTableChange={handleTableChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ marginTop: "16px" }}>
            <Card.Body>
              {" "}
              First Doc : {JSON.stringify(users && users[0])}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
