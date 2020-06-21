import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  ProgressBar,
  Spinner,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import RemoteTable from "../components/RemoteTable";
import { TableChangeType, TableChangeState } from "react-bootstrap-table-next";
import { UserDocType } from "../types";
import {
  addUserstoDB,
  getCount,
  getDocs,
  deleteAllUsers,
} from "../sqlitedb/service";

export function SQLiteDashboard() {
  const [users, setUsers] = useState<UserDocType[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [addCount, setAddCount] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);
  const [sizePerPage, setSizePerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState<[boolean, string]>([false, ""]);
  const [latestReadTime, setLatestReadTime] = useState<[number, number]>([
    334.54,
    20,
  ]);
  const [latestWriteTime, setLatestWriteTime] = useState<[number, number]>([
    334.54,
    20,
  ]);

  useEffect(() => {
    // create the databse
    async function anyNameFunction() {
      setLoading([true, "initializing database"]);
      await addUserstoDB(100, setProgress, setLatestWriteTime);
      setLoading([false, ""]);
    }
    anyNameFunction();
  }, []);

  const reloadUI = async () => {
    setUsers([]);
    setProgress(0);
    setTotalCount(0);
    setPage(1);
    setSizePerPage(10);
    getDocsAndCount(sizePerPage, page);
  };

  async function getDocsAndCount(perPageCount: number, pageNo: number) {
    const count = await getCount();
    setTotalCount(count);
    const newUsers = await getDocs(perPageCount, pageNo, setLatestReadTime);
    setUsers(newUsers);
  }

  useEffect(() => {
    console.log("pagechanged - ", "getDocsAndCount", page, sizePerPage);
    getDocsAndCount(sizePerPage, page);
  }, [page, sizePerPage]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAddCount(+e.target.value);
    setProgress(0);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(0);
    await addUserstoDB(addCount, setProgress, setLatestWriteTime);
    setAddCount(100);
    getDocsAndCount(sizePerPage, page);
  };

  const handleTableChange = (
    type: TableChangeType,
    { page, sizePerPage }: TableChangeState<any>
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const progressInstance = (
    <ProgressBar now={progress} label={`${progress}%`} />
  );
  return (
    <>
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
            <ButtonGroup aria-label="Adapters"></ButtonGroup>
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
            onClick={async () => {
              await deleteAllUsers();
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
              First Doc : {JSON.stringify(users && users[0])}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default SQLiteDashboard;
