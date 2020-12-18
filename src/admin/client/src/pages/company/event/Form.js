import React, { useState, useEffect } from 'react';
import { EventAPI } from '../../../../../../smart-contract/api/Event';
import { Input, Button, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setTotalSeats } from '../../../redux/actions/common'
import _ from 'lodash';

let totalTotalSeatsObj = {};
const CreateEventForm = () => {
  const [eventAPI, setEventAPI] = useState({});
  const [area, setArea] = useState('');
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [seatElements, setSeatElements] = useState([]);
  const [buttonElements, setButtonElements] = useState([]);
  const [ticketList, setTicketList] = useState([]);

  const app = useSelector((state) => state.app);
  const totalSeats = useSelector((state) => state.app.totalSeats);
  const dispatch = useDispatch();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    renderSeats(totalTotalSeatsObj);
  }, [totalTotalSeatsObj])

  const init = async () => {

    let eventAPI = new EventAPI();
    setEventAPI(eventAPI)
    await eventAPI.init();
    console.log('hi')

    let detailObj = {
      name: '張敬軒盛樂演唱會',
      venu: '紅磡體育館',
      contact: '+852-56281088',
      email: 'timchengy@gmail.com',
      startDate: 1607701444,
      endDate: 1607701444,
      need_kyc: true,
      country: 'HK',
      district: 'Hung Hom',
      fullAddress: 'Hong Kong Coliseum',
      company: 'XXX Company',
      description: 'XXXX Description',
      totalSupply: 5000,
      performer: '張敬軒',
      category: 'sing',
      startDateSell: 1607701444,
      endDateSell: 1607701444
    };


    // await eventAPI.createEvent(detailObj);
    let ticket = await eventAPI.getTicketAll();
    let result =  await eventAPI.getEvent(0);
    console.log(ticket)
    console.log(result)
    // let test =  await eventAPI.testMint();
    // console.log(id)  
  }

  const onChangeSeat = ({ area, row, column }) => {
    let target = totalTotalSeatsObj[area]['body'][row][column];
    totalTotalSeatsObj[area]['body'][row][column].available = !target.available;
    setTotalSeats(totalTotalSeatsObj);
    dispatch(setTotalSeats(totalTotalSeatsObj));
    renderSeats(totalTotalSeatsObj);
  }

  const onFinish = async () => {
    let seats = {
      [area]: {
        body: {},
        meta: {
          totalRows: 0,
          totalColumns: 0
        }
      }
    };
    let rowObj = {};
    let ticketList = [];
    for(let row = 1; row <= rows; row++) {
      rowObj[row] = {}
      let columnsObj = {};
      for(let column = 1; column <= columns; column++) {
        let obj = {
          area,
          row,
          column,
          seat: `ROW ${row} - COL ${column}`,
          available: true
        }
        columnsObj[column] = obj;

        ticketList.push(JSON.stringify(obj));
      }
      rowObj[row] = columnsObj;
    }

    seats[area].body = rowObj;
    seats[area].meta.totalRows = rows;
    seats[area].meta.totalColumns = columns;

    dispatch(setTotalSeats({...totalSeats, ...seats}))
    totalTotalSeatsObj = {...totalTotalSeatsObj, ...seats}    
    setTicketList(ticketList);
  }


  const renderSeats = (totalTotalSeatsObj) => {
    if (_.isEmpty(totalTotalSeatsObj)) return;
    let _seatElements = [];
    let columnsElement = [];
    let rowsElement = [];
    let _seatTables = [];

    _.each(totalTotalSeatsObj, (val, area) => {
      _seatElements = [];
      let seats = totalTotalSeatsObj[area];
      let {body, meta} = seats;
      let {totalRows, totalColumns} = meta;
      for(let row = 1; row <= totalRows; row++) {
        rowsElement = [];
        columnsElement = [];
        if (totalRows >= 11) {
          if (row <= 5 || row >= totalRows - 4) {
            rowsElement.push((<span>R {row} | </span>))
          } else if (row === 6){
            rowsElement.push((<span></span>))
          }
        } else {
          rowsElement.push((<span>R {row} | </span>))
        }
        for(let column = 1; column <= totalColumns; column++) {
          if (row <= 5 || row >= totalRows - 4) {
              if (column <= 5 || column >= totalColumns - 4) {
                columnsElement.push(
                  <span
                    className="ticket-col"
                    style={{
                      backgroundColor: body[row][column].available ? '#24a0ed': '#d3d3d3',
                      borderColor: body[row][column].available ? '#24a0ed': '#d3d3d3'
                    }}
                    onClick={() => onChangeSeat({ area, row, column })}
                  >
                    {column}
                  </span>
                )
              } else if (column === 6) {
                columnsElement.push((<span className="ticket-col">...</span>))
              }
          } else if (row === 6) {
            if (column <= 6 || column >= totalColumns - 4) {
              columnsElement.push((<span  className="ticket-col ticket-dot">...</span>))
            }
          }

        } // end for loop columns
        _seatElements.push((
          <div className={`ticket-row ticket-row-${row}`}><span className="row-header">{rowsElement}</span><span className="row-body">{columnsElement}</span></div>
        ))
      } // end for loop rows

        _seatTables.push((
          <div className={`seat-table area-${area}`}>{_seatElements}</div>
        ));
      })

    let buttonElements = [];
    _.each(totalTotalSeatsObj, (val, area) => {
      buttonElements.push((
          <Button
            type="primary"
            style={{margin: 5, padding: 10, height: 50}}
            onClick={(e) => {
              let areas = document.querySelectorAll(`.seat-table`);
              areas.forEach(item => {
                item.style.display = 'none';
              });
              document.getElementsByClassName(`area-${area}`)[0].style.display = 'block';
            }}
          >
            {area}
          </Button>
      ))
    })

    setButtonElements(buttonElements);
    setSeatElements([...seatElements, ..._seatTables]);
  }

  return (
    <Row justify="center">
      <Col>
        AREA: <Input onChange={(e) => {setArea(_.toString(e.target.value))}}/>
        Row: <Input onChange={(e) => {setRows(_.toInteger(e.target.value))}}/>
        Col: <Input onChange={(e) => {setColumns(_.toInteger(e.target.value))}}/>
        <Button type="primary" onClick={() => onFinish()}>Submit</Button>
      </Col>
      <Col span={18}>{buttonElements}</Col>
      <Col span={18}>{seatElements}</Col>
      <Row><Col><Button onClick={async () =>  eventAPI.createSeats(ticketList)}>Submit</Button></Col></Row>
    </Row>
  )
}

export default CreateEventForm;

