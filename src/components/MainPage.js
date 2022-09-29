import React from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import * as _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Table from './Table';
import styled from 'styled-components';

import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  height: 100%;
  
  @media (max-width: 576px) {
    width: 100%;
  }

  @media (min-width: 576px) {
    width: 540px;
  }

  @media (min-width: 768px) {
    width: 720px;
  }

  @media (min-width: 992px) {
    width: 960px;
  }
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(0deg, rgba(187,187,187,1) 0%, rgba(255,255,255,1) 2%, rgba(255,255,255,1) 98%, rgba(238,238,238,1) 100%);
  padding: 2.5rem 1.5rem;
  flex-grow: 1;
  align-items: center;
`

const Autocomplete = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;

  .wrapper:focus-within{
    z-index: 1;
  }
`

const DateArea = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  justify-content: stretch;
  gap: 1rem;

  .react-datepicker-wrapper {
    height: 44px;
    background-color: white;
    color: #212121;
    font-size: 16px;
    margin-top: 1rem;
    display: block;
  }

  .react-datepicker-wrapper > :first-child {
    display: flex;
    align-items: center;
    height: 100%;
  }

  input {
    height: 100%;
    width: 100%;
    border: 1px solid #dfe1e5;
    border-radius: 24px;
    font-size: 16px;
    font-family: inherit;
    font-size: inherit;
    background-color: inherit;
    padding-left: 1rem;
  }
`

const Date = styled.div`
  min-width: none;
  flex-grow: 1;
`

const Scroller = styled.div`
  width: 100%;
  overflow-x: auto;
`

const SearchButton = styled.button`
  border: 1px solid #dfe1e5;
  border-radius: 12px;
  background-color: #eee;
  padding: 0.75rem;
  padding-right: 2rem;
  padding-left: 2rem;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: 1rem;
`

const BestOptionToggle = styled.input`
  margin-right: 1rem;
  margin-bottom: 1.5rem;
`

export class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.originAutocomplete = React.createRef();
    this.state = {
      origin: null,
      destination: null,
      departureDate: null,
      returnDate: null,
      service: false,
      airports: [],
      flights: null,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/airports", {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "fairestdb.p.rapidapi.com",
        "x-rapidapi-key": "apikey"
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        ...this.state,
        airports: response,
      })
    })
    .catch(err => { console.log(err); 
    });
  }

  handleSetOrigin(origin) {
    const state = _.cloneDeep(this.state);
    state.origin = origin.iata;
    state.flights = null;
    this.setState(state);
  }

  handleClearOrigin() {
    const state = _.cloneDeep(this.state);
    state.origin = null;
    state.flights = null;
    this.setState(state);
  }
  
  handleSetDestination(destination) {
    const state = _.cloneDeep(this.state);
    state.destination = destination.iata;
    state.flights = null;
    this.setState(state);
  }

  handleClearDestination() {
    const state = _.cloneDeep(this.state);
    state.destination = null;
    state.flights = null;
    this.setState(state);
  }

  handleSetDepartureDate(date) {
    const state = _.cloneDeep(this.state);
    state.departureDate = date;
    state.flights = null;
    this.setState(state);
  }

  handleSetReturnDate(date) {
    const state = _.cloneDeep(this.state);
    state.returnDate = date;
    state.flights = null;
    this.setState(state);
  }

  handleSetService() {
    const state = _.cloneDeep(this.state);
    state.service = !state.service;
    state.flights = null;
    this.setState(state);
  }

  searchForResults() {
    let additionalOptions;

    if (this.state.departureDate && this.state.returnDate) {
      additionalOptions = `?departureDate=${moment(this.state.departureDate).format('YYYY-MM-DD')}&returnDate=${moment(this.state.returnDate).format('YYYY-MM-DD')}`;
      if (this.state.service) {
        additionalOptions = additionalOptions + '&service=amadeusBestPrice'
      }
    }

    fetch(`http://localhost:3000/offers/${this.state.origin}/${this.state.destination}${additionalOptions}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "fairestdb.p.rapidapi.com",
        "x-rapidapi-key": "apikey"
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
       ...this.state,
       flights: response instanceof Array ? response : [response],
      })
    })
    .catch(err => { console.log(err); 
    });
  }
  
  searchForAllResults() {
    fetch(`http://localhost:3000/offers/${this.state.origin}/${this.state.destination}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "fairestdb.p.rapidapi.com",
        "x-rapidapi-key": "apikey"
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
       ...this.state,
       flights: response,
      })
    })
    .catch(err => { console.log(err); 
    });
  }

  formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </>
    )
  }

  render() {
    const options = Object.keys(this.state.airports).map((key) => this.state.airports[key]);

    const airports = options.map((airport, index) => {
      return ({
          id: index, 
          name: airport.name,
          iata: airport.iata,
        });
    });

    let destinationArea = (<div></div>);
    if (this.state.origin) {
      destinationArea = (
        <div>
          <span className="infoText">Destination airport:</span>
          <Autocomplete>
            <ReactSearchAutocomplete
              items={airports}
              disabled
              onSelect={this.handleSetDestination.bind(this)}
              onClear={this.handleClearDestination.bind(this)}
              autoFocus
              formatResult={this.formatResult}
              maxResults={5}
            />
          </Autocomplete>
        </div>
      )
    }

    
    let dateArea = (<div></div>);
    let bestOptionArea;
    let searchButtonArea;
    let searchAllButtonArea = (<div></div>);
    let dataTable;

    if (this.state.origin && this.state.destination) {
      const departureDate = this.state.departureDate;
      const returnDate = this.state.returnDate;
      const service = this.state.service;

      dateArea = (
        <DateArea>
          <Date>
            <span className="infoText">Departure date:</span>
            <DatePicker isClearable={true} dateFormat="yyyy-MM-dd" selected={departureDate} onChange={this.handleSetDepartureDate.bind(this)} />
          </Date>
          <Date>
            <span className="infoText">Return date:</span>
            <DatePicker isClearable={true} dateFormat="yyyy-MM-dd" selected={returnDate} onChange={this.handleSetReturnDate.bind(this)} />
          </Date>
        </DateArea>
      );
    

      if (this.state.departureDate && this.state.returnDate) {
        bestOptionArea = (
          <div>
            <BestOptionToggle checked={service} id="best-offer" type="checkbox" onChange={this.handleSetService.bind(this)}/>
            <label htmlFor="best-offer" className="infoText">Find the best option for a trip with this duration</label>
          </div>
        );

        searchButtonArea = (
          <div>
            <SearchButton onClick={this.searchForResults.bind(this)}>Search</SearchButton>
          </div>
        );
      } else if (this.state.origin && this.state.destination && !(this.state.departureDate || this.state.returnDate)) {
        searchAllButtonArea = (
          <div>
            <SearchButton onClick={this.searchForAllResults.bind(this)}>Explore offers</SearchButton>
          </div>
        )
      }

      if (this.state.flights?.length > 0) {
        const columns = [
            {
              Header: 'Origin',
              accessor: 'origin',
            },
            {
              Header: 'Destination',
              accessor: 'destination',
            },
            {
              Header: 'Departure date',
              accessor: 'departureDate',
            },
            {
              Header: 'Return date',
              accessor: 'returnDate',
            },
            {
              Header: 'Seat availability',
              accessor: 'seatAvailability',
            },
            {
              Header: 'Price',
              accessor: 'price',
            },
          ]
        const data = _.cloneDeep(this.state.flights).map((row) => ({
          origin: row.origin,
          destination: row.destination,
          departureDate: row.departureDate,
          returnDate: row.returnDate,
          seatAvailability: row.seatAvailability,
          price: `${row.price.amount} ${row.price.currency}`
        }));
        dataTable = (<Table columns={columns} data={data} />)
      } else if (this.state.flights?.length === 0) {
        dataTable = (<span className="infoText">No flights available</span>)
      }
    }

    return (
      <MainContent>
        <Container>
          <div className="options">
            <span className="infoText">Origin airport:</span>
            <div>
              <Autocomplete>
                <ReactSearchAutocomplete
                  items={airports}
                  disabled
                  onSelect={this.handleSetOrigin.bind(this)}
                  onClear={this.handleClearOrigin.bind(this)}
                  autoFocus
                  formatResult={this.formatResult}
                  maxResults={5}
                />
              </Autocomplete>
            </div>
            { destinationArea }
            { searchAllButtonArea }
            { dateArea }
            { bestOptionArea }
            { searchButtonArea }
          </div>
          <Scroller>
            <div className="data-area">
              { dataTable }
            </div>
          </Scroller>
        </Container>
      </MainContent>
    );
  }
}