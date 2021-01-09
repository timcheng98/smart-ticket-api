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
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setTotalSeats } from "../../../redux/actions/common";
import _ from "lodash";
import AppLayout from "../../../components/AppLayout";
import { DownCircleOutlined } from "@ant-design/icons";
import { EventAPI } from '../../../smart-contract/api/Event'
const title = "Event Ticket";
const selectedKey = "event_ticket";
const { Option } = Select;

const eventAPI = new EventAPI();

const buttonStyles = {
  vip: {
    color: "#ffd700",
    border: "1px sold #e6f7ff !important",
    backgroundColor: "#e6f7ff",
  },
  normal: {
    color: "#1890ff",
    border: "1px sold #e6f7ff",
    backgroundColor: "#e6f7ff",
  },
  free: {
    color: "#e6f7ff",
    border: "1px sold #e6f7ff",
    backgroundColor: "#e6f7ff",
  },
  locked: {
    color: "#ff0000",
    border: "1px sold #e6f7ff",
    backgroundColor: "#e6f7ff",
  },
  reserved: {
    color: "#c0c0c0",
    border: "1px sold #e6f7ff",
    backgroundColor: "#e6f7ff",
  },
};

let totalTotalSeatsObj = {};
const CreateEventForm = () => {
  // const [eventAPI, setEventAPI] = useState({});
  const [area, setArea] = useState("");
  const [ticketType, setTicketType] = useState(null);
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [price, setPrice] = useState(0);
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
  const [loading ,setLoading] = useState(true)

  useEffect(() => {
    // init();
    getEvent()
    setLoading(false)
    console.log("test", totalSeats);
  }, []);

  useEffect(() => {
    renderSeats(totalTotalSeatsObj);
  }, [totalTotalSeatsObj]);

  // const init = async () => {
  //   let eventAPI = new EventAPI();
  //   setEventAPI(eventAPI);
  //   await eventAPI.init();
  //   console.log("hi");

  //   let detailObj = {
  //     name: "張敬軒盛樂演唱會",
  //     venu: "紅磡體育館",
  //     contact: "+852-56281088",
  //     email: "timchengy@gmail.com",
  //     startDate: 1607701444,
  //     endDate: 1607701444,
  //     need_kyc: true,
  //     country: "HK",
  //     district: "Hung Hom",
  //     fullAddress: "Hong Kong Coliseum",
  //     company: "XXX Company",
  //     description: "XXXX Description",
  //     totalSupply: 5000,
  //     performer: "張敬軒",
  //     category: "sing",
  //     startDateSell: 1607701444,
  //     endDateSell: 1607701444,
  //   };

  //   // await eventAPI.createEvent(detailObj);
  //   let ticket = await eventAPI.getTicketAll();
  //   let result = await eventAPI.getEvent(0);
  //   console.log(ticket);
  //   console.log(result);
  //   // let test =  await eventAPI.testMint();
  //   // console.log(id)
  // };

  const onChangeSeat = ({ area, row, column }) => {
    let target = totalTotalSeatsObj[area]["body"][row][column];
    totalTotalSeatsObj[area]["body"][row][column].available = !target.available;
    setTotalSeats(totalTotalSeatsObj);
    dispatch(setTotalSeats(totalTotalSeatsObj));
    renderSeats(totalTotalSeatsObj);
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
    let ticketList = [];
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
          price,
        };
        columnsObj[column] = obj;

        ticketList.push(JSON.stringify(obj));
      }
      rowObj[row] = columnsObj;
    }

    seats[area].body = rowObj;
    seats[area].meta.totalRows = rows;
    seats[area].meta.totalColumns = columns;

    dispatch(setTotalSeats({ ...totalSeats, ...seats }));
    totalTotalSeatsObj = { ...totalTotalSeatsObj, ...seats };
    setTicketList(ticketList);
  };
  console.log();

  const renderSeats = (totalTotalSeatsObj) => {
    if (_.isEmpty(totalTotalSeatsObj)) return;
    let _seatElements = [];
    let _seatElementsTootips = [];
    let columnsElement = [];
    let columnsElementTootips = [];
    let rowsElement = [];
    let rowsElementTootips = [];
    let _seatTables = [];
    let _buttonElements = [];
    let _seatObj = { vip: [], reserved: [], normal: [], free: [], locked: [] };

    _.each(totalTotalSeatsObj, (val, area) => {
      _seatElements = [];
      _seatElementsTootips = [];
      let seats = totalTotalSeatsObj[area];
      let { body, meta } = seats;
      let { totalRows, totalColumns, type } = meta;
      for (let row = 1; row <= totalRows; row++) {
        rowsElement = [];
        columnsElement = [];
        rowsElementTootips = [];
        columnsElementTootips = [];
        _buttonElements = [];
        // if (totalRows >= 11) {
        // if (row <= 26 || row >= totalRows - 4) {
        rowsElement.push(<span>{String.fromCharCode(row + 64)}</span>);
        rowsElementTootips.push(<span>{String.fromCharCode(row + 64)}</span>);
        //   } else if (row === 27){
        //     rowsElement.push((<span></span>))
        //   }
        // } else {
        //   rowsElement.push((<span>{row}</span>))
        // }
        for (let column = 1; column <= totalColumns; column++) {
          // if (row <= 26 || row >= totalRows - 4) {
          if (column <= 8) {
            columnsElementTootips.push(
              <Tooltip title={column}>
                <span
                  className="ticket-col"
                  style={{
                    backgroundColor: body[row][column].available
                      ? "#24a0ed"
                      : "#d3d3d3",
                    borderColor: body[row][column].available
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
            columnsElement.push(
              <Tooltip
                title={
                  body[row][column].available
                    ? "Click to Disable"
                    : "Click to Enable"
                }
              >
                <span
                  className={`ticket-col ${type} disabled-${body[row][column].available}`}
                  // style={{
                  //   backgroundColor: body[row][column].available
                  //     ? "#24a0ed"
                  //     : "#d3d3d3",
                  //   borderColor: body[row][column].available
                  //     ? "#24a0ed"
                  //     : "#d3d3d3",
                  // }}
                  onClick={() => onChangeSeat({ area, row, column })}
                >
                  {column}
                </span>
              </Tooltip>
            );
          } else if (column === 9) {
            columnsElement.push(<span className="ticket-col">...</span>);
            columnsElementTootips.push(
              <span className="ticket-col ticket-dots">...</span>
            );
          }
          // } else if (row === 27) {
          //   if (column <= 27 || column >= totalColumns - 4) {
          //     columnsElement.push((<span  className="ticket-col ticket-dot">...</span>))
          //   }
          // }
        } // end for loop columns
        _seatElements.push(
          <div className={`ticket-row ticket-row-${row}`}>
            <span className="row-header">{rowsElement}</span>
            <span className="row-body">{columnsElement}</span>
          </div>
        );
        _seatElementsTootips.push(
          <div className={`ticket-row ticket-row-${row}`}>
            <span className="row-header">{rowsElementTootips}</span>
            <span className="row-body">{columnsElementTootips}</span>
          </div>
        );
      } // end for loop rows

      _seatTables.push(
        <div className={`seat-table area-${area}`}>{_seatElements}</div>
      );

      _buttonElements.push(
        <Menu.Item style={{ height: "100%", paddingLeft: 0 }}>
          <Tooltip
            placement="right"
            title={
              <Row className="card" justify="center">
                <Col
                  span={12}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {totalRows} X {totalColumns}
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
            </Button>
          </Tooltip>
        </Menu.Item>
      );
      _seatObj = {
        ..._seatObj,
        [type]: [..._seatObj[type], ..._buttonElements],
      };
    });


    // let buttonElements = [];
    // _.each(totalTotalSeatsObj, (val, area) => {
    //   buttonElements.push((
    //     <Col span={6}>
    //     <Card onClick={(e) => {
    //           let areas = document.querySelectorAll(`.seat-table`);
    //           areas.forEach(item => {
    //             item.style.display = 'none';
    //           });
    //           document.getElementsByClassName(`area-${area}`)[0].style.display = 'block';
    //         }}>
    //       {/* <Button
    //         type="primary"
    //         style={{margin: 5, padding: 10, height: 50}}

    //       > */}
    //         {_seatTables}
    //       {/* </Button> */}
    //       </Card>
    //       </Col>
    //   ))
    // })
    // console.log(buttonElements)
    setButtonElements(_seatObj);
    setSeatElements([...seatElements, ..._seatTables]);
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
        <Menu.SubMenu key={key} title={key.toUpperCase()} style={{fontWeight: 'bold'}}>
          {val}
        </Menu.SubMenu>
      );
      buttons.push(element);
    });
    return buttons;
  };

  const getEvent = async () => {
    await eventAPI.init();
    let element = [];
    let events = await eventAPI.getEvent(0);
    
    events = [events];
    {events.map(item => {
      return element.push((<Select.Option key={item.eventId} value={item.eventId}>{item.name}</Select.Option>))
    })}

    element = (<Select style={{width: "100%"}}>{element}</Select>);
    setEvents(element)
  }

  if (loading) return (<AppLayout>Wait</AppLayout>)

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          Event:{" "}
          {events}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          AREA:{" "}
          <Input
            onChange={(e) => {
              setArea(_.toString(e.target.value));
            }}
          />
        </Col>
        <Col span={6}>
          Type:{" "}
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
          Row:{" "}
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            onChange={(value) => {
              setRows(_.toInteger(value));
            }}
          />
        </Col>
        <Col span={6}>
          Col:{" "}
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            onChange={(value) => {
              setColumns(_.toInteger(value));
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {ticketType !== "free" && (
          <Col span={6}>
            Price:{" "}
            <InputNumber
              min={1}
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
            Submit
          </Button>
        </Col>
        {/* <Row><Col><Button onClick={async () =>  eventAPI.createSeats(ticketList)}>Submit</Button></Col></Row> */}
      </Row>

      <Row  gutter={[16, 48]}>
        <Col span={4}>
          <Menu
            // onClick={this.handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
          >
            {renderButtons()}
          </Menu>

          {/* </Col> */}
          {/* {buttonElements.length > 5 && (
            <Row justify="center" style={{ textAlign: "center" }}>
              <Col span={24}>Scroll Down </Col>
              <Col span={24}>
                <DownCircleOutlined
                  style={{
                    fontSize: 24,
                    color: "#1890ff",
                    marginTop: 10,
                    fontWeight: "bold",
                  }}
                />
              </Col>
            </Row>
          )} */}
        </Col>
        <Col span={20} style={{ paddingTop: 30, paddingLeft: 100 }}>
          <Row align="middle">
            <Col>{seatElements}</Col>
          </Row>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default CreateEventForm;
