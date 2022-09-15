import React from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import * as _ from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Table from './Table';

import "react-datepicker/dist/react-datepicker.css";

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
          <div className="autocomplete">
            <ReactSearchAutocomplete
              items={airports}
              disabled
              onSelect={this.handleSetDestination.bind(this)}
              onClear={this.handleClearDestination.bind(this)}
              autoFocus
              formatResult={this.formatResult}
              maxResults={5}
            />
          </div>
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
        <div className="date-area">
          <div className="date">
            <span className="infoText">Departure date:</span>
            <DatePicker isClearable={true} dateFormat="yyyy-MM-dd" selected={departureDate} onChange={this.handleSetDepartureDate.bind(this)} />
          </div>
          <div className="date">
            <span className="infoText">Return date:</span>
            <DatePicker isClearable={true} dateFormat="yyyy-MM-dd" selected={returnDate} onChange={this.handleSetReturnDate.bind(this)} />
          </div>
        </div>
      );
    

      if (this.state.departureDate && this.state.returnDate) {
        bestOptionArea = (
          <div>
            <input checked={service} id="best-offer" type="checkbox" onChange={this.handleSetService.bind(this)} className="best-option-toggle"/>
            <label htmlFor="best-offer" className="infoText">Find the best option for a trip with this duration</label>
          </div>
        );

        searchButtonArea = (
          <div>
            <button onClick={this.searchForResults.bind(this)} className="search-button">Search</button>
          </div>
        );
      } else if (this.state.origin && this.state.destination && !(this.state.departureDate || this.state.returnDate)) {
        searchAllButtonArea = (
          <div>
            <button onClick={this.searchForAllResults.bind(this)} className="search-button">Explore offers</button>
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
      <div className="main-content">
        <div className="container">
          <div className="options">
            <span className="infoText">Origin airport:</span>
            <div>
              <div className="autocomplete">
                <ReactSearchAutocomplete
                  items={airports}
                  disabled
                  onSelect={this.handleSetOrigin.bind(this)}
                  onClear={this.handleClearOrigin.bind(this)}
                  autoFocus
                  formatResult={this.formatResult}
                  maxResults={5}
                />
              </div>
            </div>
            { destinationArea }
            { searchAllButtonArea }
            { dateArea }
            { bestOptionArea }
            { searchButtonArea }
          </div>
          <div className="scroller">
            <div className="data-area">
              { dataTable }
            </div>
          </div>
        </div>
      </div>
    );
  }
}