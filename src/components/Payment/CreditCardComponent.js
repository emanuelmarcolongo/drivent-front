import React from 'react';
import Card from 'react-credit-cards';

import { formatCreditCardNumber, formatCVC, formatExpirationDate, formatFormData } from './utils';

import 'react-credit-cards/es/styles-compiled.css';
import styled from 'styled-components';
import axios from 'axios';

export default class App extends React.Component {
  state = {
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    issuer: '',
    focused: '',
    formData: null,
  };

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name,
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = (e) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3Nzc2MTExOH0.caD64_5szst91jOmqNwlEq5H4s-_8puNqm0ZGMPQQa8';

    e.preventDefault();
    const { issuer } = this.state;
    const formData = [...e.target.elements]
      .filter((d) => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    this.setState({ formData });
    this.form.reset();

    const cardData = { ...formData };
    const data = {
      ticketId: 1,
      cardData,
    };

    const promise = axios.post(`${process.env.REACT_APP_API_BASE_URL}/payments/process`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    promise
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
    console.log(formData);
  };

  render() {
    const { name, number, expiry, cvc, focused, issuer, formData } = this.state;

    return (
      <div key="Payment">
        <CardContainer className="App-payment">
          <Card
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focused}
            callback={this.handleCallback}
          />
          <CardForm ref={(c) => (this.form = c)} onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="tel"
                name="number"
                className="form-control"
                placeholder="Card Number"
                pattern="[\d| ]{16,22}"
                maxLength="19"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
              <br />
              <NumberDescription>E.g.: 49..., 51..., 36..., 37...</NumberDescription>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <input
                  type="tel"
                  name="expiry"
                  className="form-control"
                  placeholder="Valid Thru"
                  pattern="\d\d/\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div className="col-6">
                <input
                  type="tel"
                  name="cvc"
                  className="form-control"
                  placeholder="CVC"
                  pattern="\d{3,4}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
            </div>
            <input type="hidden" name="issuer" value={issuer} />
            <div className="form-actions">
              <button className="btn btn-primary btn-block">Realizar Pagamento</button>
            </div>
          </CardForm>
        </CardContainer>
      </div>
    );
  }
}

const CardContainer = styled.div`
  display: flex;
  position: absolute;
  margin-top: 21px;
`;
const CardForm = styled.form`
  margin-left: 20px;
`;
const NumberDescription = styled.small`
  font-size: 15px;
  color: grey;
`;
