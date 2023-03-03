import { useState, useEffect } from 'react';
import checkbox from '../../../../assets/images/Vector.svg';
import CreditCardComponent from './CreditCardComponent';
import 'react-credit-cards/es/styles-compiled.css';
import { PaymentConfirmedContainer, Subtitle, TicketInfoContainer } from '../PaymentStyledComponents';
import axios from 'axios';

export default function PaymentWithCard() {
  const [ticket, setTicket] = useState({});
  const [paid, setPaid] = useState(false);
  const token = JSON.parse(localStorage.getItem('userData')).token;

  useEffect(() => {
    const promise = axios.get(`${process.env.REACT_APP_API_BASE_URL}/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    promise
      .then((res) => {
        setTicket(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  return (
    <>
      <Subtitle>Ingresso Escolhido</Subtitle>
      <TicketInfoContainer>
        <p>{ticket.TicketType?.isRemote ? 'Remoto' : ticket.TicketType?.containsHotel ? 'Presencial + Com Hotel' : 'Presencial + Sem Hotel'}</p>
        <h3>R$ {ticket.TicketType?.price}</h3>
      </TicketInfoContainer>
      <Subtitle>Pagamento</Subtitle>
      <CreditCardComponent setPaid={setPaid} />
      {paid ? <PaymentConfirmed /> : ''}
    </>
  );
}

function PaymentConfirmed() {
  return (
    <PaymentConfirmedContainer>
      <img src={checkbox} alt="checked checkbox" />
      <div>
        <p>Pagamento Confirmado</p>
        <p>Prossiga para escolha de hospedagem e atividades</p>
      </div>
    </PaymentConfirmedContainer>
  );
}
