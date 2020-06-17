import React from "react";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import BootstrapTable, {
  TableChangeType,
  TableChangeState,
} from "react-bootstrap-table-next";
import { Row, Col } from "react-bootstrap";

interface IRemoteTable {
  data: any[];
  page: number;
  sizePerPage: number;
  onTableChange: (
    type: TableChangeType,
    newState: TableChangeState<any>
  ) => void;
  totalSize: number;
}

export function RemoteTable({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
}: IRemoteTable) {
  const columns = [
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "phone",
      text: "Phone No",
    },
    {
      dataField: "address",
      text: "Address",
    },
    {
      dataField: "area",
      text: "Area",
    },
  ];

  return (
    <div>
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize,
        })}
      >
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <div></div>
            <Row>
              <Col>
                <BootstrapTable
                  remote
                  bootstrap4
                  {...paginationTableProps}
                  keyField="phone"
                  data={data}
                  columns={columns}
                  onTableChange={onTableChange}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <SizePerPageDropdownStandalone {...paginationProps} />
              </Col>
              <Col className="align-items-center">
                <PaginationTotalStandalone {...paginationProps} />
              </Col>
              <Col>
                <div className="float-right">
                  <PaginationListStandalone {...paginationProps} />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
}

export default RemoteTable;
