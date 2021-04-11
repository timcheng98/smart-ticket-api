import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Tooltip,
  InputNumber,
  Select,
  Menu,
  Popconfirm,
  message,
  Tag,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link, useLocation } from "react-router-dom";
import { setTotalSeats, setLoading } from "../../../redux/actions/common";
import _ from "lodash";
import moment from "moment";
import AppLayout from "../../../components/AppLayout";
import { DownCircleOutlined } from "@ant-design/icons";
import * as Service from "../../../core/Service";
import LoadingScreen from "../../../components/LoadingScreen";

const title = "Event Ticket";
const selectedKey = "event_ticket";
const { Option } = Select;

const CreateEventForm = () => {
  const [area, setArea] = useState("");
  const [ticketType, setTicketType] = useState(null);
  const [selectedMenuKey, setSelectedMenuKey] = useState(["vip"]);
  const [rows, setRows] = useState(null);
  const [columns, setColumns] = useState(null);
  const [price, setPrice] = useState(null);
  const [seatElements, setSeatElements] = useState([]);
  const [buttonElements, setButtonElements] = useState({
    vip: [],
    reserved: [],
    normal: [],
    free: [],
    locked: [],
  });
  const [ticketList, setTicketList] = useState([]);

  const app = useSelector((state) => state.app);
  const totalSeats = useSelector((state) => state.app.totalSeats);
  const dispatch = useDispatch();

  const [events, setEvents] = useState(null);
  const location = useLocation();

  useEffect(() => {
    dispatch(setLoading(true));
    getSeatsFromChain();
    dispatch(setLoading(false));
  }, [location]);

  const getSeatsFromChain = async () => {
    let tickets = await Service.call("get", `/api/sc/event/ticket`);
    tickets = tickets[location.state.eventId];
    let areaTickets = _.groupBy(tickets, "area");
    let seats = {};
    _.each(areaTickets, (item, key) => {
      let rows = _.groupBy(item, "ticket_row");
      let body = {};
      _.each(rows, (columns, rowKey) => {
        let columnsObj = {};
        _.each(columns, (col, colKey) => {
          columnsObj[colKey + 1] = col;
        });
        body[rowKey] = columnsObj;
      });

      seats[key] = {
        body,
        meta: {
          totalRows: item[item.length - 1].ticket_row,
          totalColumns: item[item.length - 1].ticket_col,
          type: item[item.length - 1].type,
          status: "",
        },
      };
    });

    dispatch(setTotalSeats({ ...totalSeats, ...seats }));
  };

  useEffect(() => {
    dispatch(setLoading(true));
    if (location.state) {
      if (location.state.eventId !== undefined) {
        getEvent();
      }
    }
    dispatch(setLoading(false));
  }, [location]);

  useEffect(() => {
    dispatch(setLoading(true));
    renderSeats();
    dispatch(setLoading(false));
  }, [totalSeats]);

  const onChangeSeat = ({ area, row, column }) => {
    let target = totalSeats[area]["body"][row][column];
    totalSeats[area]["body"][row][column].available = !target.available;
    dispatch(setTotalSeats(totalSeats));
    renderSeats();
  };

  const onFinish = async () => {
    let seats = {
      [area]: {
        body: {},
        meta: {
          totalRows: 0,
          totalColumns: 0,
          type: ticketType,
        },
      },
    };
    let rowObj = {};
    let _ticketList = [];
    for (let row = 1; row <= rows; row++) {
      rowObj[row] = {};
      let columnsObj = {};
      for (let column = 1; column <= columns; column++) {
        let obj = {
          area,
          row,
          column,
          seat: `ROW ${row} - COL ${column}`,
          available: true,
          type: ticketType,
          price: price === null ? 0 : price,
        };
        columnsObj[column] = obj;

        _ticketList.push(JSON.stringify(obj));
      }
      rowObj[row] = columnsObj;
    }

    seats[area].body = rowObj;
    seats[area].meta.totalRows = rows;
    seats[area].meta.totalColumns = columns;
    seats[area].meta.status = "new";
    setSelectedMenuKey([ticketType]);
    resetFormState();
    dispatch(setTotalSeats({ ...totalSeats, ...seats }));
    setTicketList([...ticketList, ..._ticketList]);
  };

  const resetFormState = () => {
    setArea("");
    setPrice(null);
    setRows(null);
    setColumns(null);
    setTicketType(null);
  };

  const renderSeats = () => {
    setSeatElements([]);
    setButtonElements([]);
    if (_.isEmpty(totalSeats)) {
      return;
    }

    let _seatElements = [];
    let _seatElementsTootips = [];
    let columnsElement = [];
    let columnsElementTootips = [];
    let rowsElement = [];
    let rowsElementTootips = [];
    let _seatTables = [];
    let _buttonElements = [];
    let _seatObj = { vip: [], reserved: [], normal: [], free: [], locked: [] };

    _.each(totalSeats, (val, area) => {
      _seatElements = [];
      _seatElementsTootips = [];
      let seats = totalSeats[area];

      let { body, meta } = seats;
      let { totalRows, totalColumns, type, status } = meta;

      for (let row = 1; row <= totalRows; row++) {
        rowsElement = [];
        columnsElement = [];
        rowsElementTootips = [];
        columnsElementTootips = [];
        _buttonElements = [];
        rowsElement.push(
          <span key={`${area}-${row}`}>{String.fromCharCode(row + 64)}</span>
        );
        rowsElementTootips.push(
          <span key={`${area}-${row}-tooltip`}>
            {String.fromCharCode(row + 64)}
          </span>
        );

        for (let column = 1; column <= totalColumns; column++) {
          if (column <= 8) {
            columnsElementTootips.push(
              <Tooltip key={`${area}-${row}-${column}-tooltip`} title={column}>
                <span
                  key={`${area}-${row}-${column}`}
                  className="ticket-col"
                  style={{
                    backgroundColor: Boolean(body[row][column].available)
                      ? "#24a0ed"
                      : "#d3d3d3",
                    borderColor: Boolean(body[row][column].available)
                      ? "#24a0ed"
                      : "#d3d3d3",
                  }}
                >
                  {column}
                </span>
              </Tooltip>
            );
          }
          if (column <= 8 || column >= totalColumns - 7) {
            if (status === "new") {
              columnsElement.push(
                <Tooltip
                  key={`${area}-${row}-${column}-tooltip`}
                  title={
                    body[row][column].available
                      ? "Click to Disable"
                      : "Click to Enable"
                  }
                >
                  <span
                    key={`${area}-${row}-${column}`}
                    className={`ticket-col ${type} disabled-${Boolean(body[row][column].available)}`}
                    onClick={() => onChangeSeat({ area, row, column })}
                  >
                    {column}
                  </span>
                </Tooltip>
              );
            } else {
              columnsElement.push(
                <span
                  key={`${area}-${row}-${column}`}
                  className={`ticket-col ${type} disabled-${body[row][column].available}`}
                >
                  {column}
                </span>
              );
            }
          } else if (column === 9) {
            columnsElement.push(<span className="ticket-col">...</span>);
            columnsElementTootips.push(
              <span className="ticket-col ticket-dots">...</span>
            );
          }
        } // end for loop columns
        _seatElements.push(
          <div
            key={`${area}-${row}`}
            className={`ticket-row ticket-row-${row}`}
          >
            <span className="row-header">{rowsElement}</span>
            <span className="row-body">{columnsElement}</span>
          </div>
        );
        _seatElementsTootips.push(
          <div
            key={`${area}-${row}-tootips`}
            className={`ticket-row ticket-row-${row}`}
          >
            <span className="row-header">{rowsElementTootips}</span>
            <span className="row-body">{columnsElementTootips}</span>
          </div>
        );
      } // end for loop rows

      _seatTables.push(
        <div key={`${area}`} className={`seat-table area-${area}`}>
          {_seatElements}
        </div>
      );

      _buttonElements.push(
        <Menu.Item
          key={`${area}-menu-item`}
          style={{ height: "100%", paddingLeft: 0 }}
        >
          <Tooltip
            placement="right"
            title={
              <Row className="card" justify="center">
                <Col
                  span={12}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {totalRows} X {totalColumns}
                  {status !== "" && (
                    <Tag style={{ marginLeft: 8 }}>{status.toUpperCase()}</Tag>
                  )}
                </Col>
                <Col>{_seatElementsTootips}</Col>
              </Row>
            }
          >
            <Button
              type="primary"
              className={type}
              style={{
                margin: 5,
                height: 50,
                width: "100%",
                borderRadius: 45,
              }}
              onClick={(e) => {
                let areas = document.querySelectorAll(`.seat-table`);
                areas.forEach((item) => {
                  item.style.display = "none";
                });
                document.getElementsByClassName(
                  `area-${area}`
                )[0].style.display = "block";
              }}
            >
              {area}: {totalRows} X {totalColumns}
              {status !== "" && <Tag style={{ marginLeft: 8 }}>{status}</Tag>}
            </Button>
          </Tooltip>
        </Menu.Item>
      );
      _seatObj = {
        ..._seatObj,
        [type]: [..._seatObj[type], ..._buttonElements],
      };
    });

    setButtonElements(_seatObj);
    setSeatElements(_seatTables);
  };

  const renderButtons = () => {
    const buttons = [];

    _.each(buttonElements, (val, key) => {
      let element = (
        <div
          className="scroll-hide"
          span={4}
          style={{
            overflowY: val.length > 2 ? "scroll" : "hidden",
            overflowX: "hidden",
            maxHeight: 200,
            padding: 20,
          }}
        >
          {val}
        </div>
      );
      element = (
        <Menu.SubMenu
          key={key}
          title={key.toUpperCase()}
          style={{ fontWeight: "bold" }}
        >
          {val}
        </Menu.SubMenu>
      );
      buttons.push(element);
    });
    return buttons;
  };

  const getEvent = async () => {
    let eventId = location.state.eventId;
    let element = [];
    let sc_events = await Service.call("get", "/api/sc/event");
    {
      _.map(sc_events, (item, key) => {
        return element.push(
          <Select.Option key={item.eventId} value={item.eventId}>
            {item.name}
          </Select.Option>
        );
      });
    }

    element = (
      <Select value={eventId} disabled style={{ width: "100%" }}>
        {element}
      </Select>
    );
    setEvents(element);
  };

  const onChainProcess = async () => {
    let seats = {};
    _.each(totalSeats, (item, key) => {
      if (item.meta.status === "new") {
        return (seats[key] = item);
      }
    });

    let _ticketList = [];
    _.each(seats, (item) => {
      _.each(item.body, (rows) => {
        _.each(rows, (col) => {
          _ticketList.push(col);
        });
      });
    });

    if (_.isEmpty(ticketList)) return message.warning("please create seats");
    await Service.call("post", "/api/sc/event/ticket", {
      tickets: _ticketList,
      eventId: location.state.eventId
    });
  };

  // if (_.isEmpty(seatElements)) return <LoadingScreen></LoadingScreen>;

  // console.log('seatElements.length', seatElements.length);

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Row gutter={[16, 16]}>
        <Col span={8}>Event: {events}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          AREA:
          <Input
            placeholder="Area"
            value={area}
            onChange={(e) => {
              setArea(_.toString(e.target.value));
            }}
          />
        </Col>
        <Col span={6}>
          Type:
          <Select
            placeholder="Type"
            value={ticketType}
            onChange={(value) => {
              setTicketType(_.toString(value));
            }}
            style={{ width: "100%" }}
          >
            <Option value="vip">VIP</Option>
            <Option value="reserved">Reserved</Option>
            <Option value="normal">Normal</Option>
            <Option value="free">Free</Option>
            <Option value="locked">Locked</Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          Row:
          <InputNumber
            placeholder="Row"
            min={1}
            style={{ width: "100%" }}
            value={rows}
            onChange={(value) => {
              setRows(_.toInteger(value));
            }}
          />
        </Col>
        <Col span={6}>
          Column:
          <InputNumber
            placeholder="Column"
            min={1}
            style={{ width: "100%" }}
            value={columns}
            onChange={(value) => {
              setColumns(_.toInteger(value));
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {ticketType !== "free" && (
          <Col span={6}>
            Price:
            <InputNumber
              placeholder="Price"
              value={price}
              min={0}
              style={{ width: "100%" }}
              onChange={(value) => {
                setPrice(_.toInteger(value));
              }}
            />
          </Col>
        )}
      </Row>
      <Row gutter={[16, 48]}>
        <Col span={8}>
          <Button type="primary" onClick={() => onFinish()}>
            Add to Preview
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 48]}>
        <Col span={6}>
          <Menu
            style={{ width: 256 }}
            defaultOpenKeys={selectedMenuKey}
            onOpenChange={(item, key) => setSelectedMenuKey(item)}
            openKeys={selectedMenuKey}
            mode="inline"
          >
            {renderButtons()}
          </Menu>
        </Col>
        <Col span={18} style={{ paddingTop: 30, paddingLeft: 100 }}>
          <Row align="middle">
            <Col>{seatElements}</Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Popconfirm
          title="Are you sure to submit?"
          onConfirm={async () => {
            dispatch(setLoading(true));
            await onChainProcess();
            await getSeatsFromChain();
            dispatch(setLoading(false));
          }}
        >
          <Button
            type="primary"
            style={{
              backgroundColor: "#fff",
              color: "#000",
              borderColor: "#000",
              fontSize: 16,
              height: 50,
            }}
          >
            Submit on the BlockChain
          </Button>
        </Popconfirm>
      </Row>
    </AppLayout>
  );
};

export default CreateEventForm;
