import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';

const AccountCard = (props) => {
    const [accountName, setAccountName] = useState(props.account_name);
    const [balance, setBalance] = useState(props.balance);
    const [annualReturn, setAnnualReturn] = useState(props.annual_return);

    const handleUpdate = () => {
        props.updateAccount(accountName, annualReturn, balance);
    };

    return (
        <div className='account-card'>
            <div>Account name</div>
            <input
                name="account_name"
                type="text"
                placeholder={props.account_name}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
            />

            <div>Balance</div>
            <input
                name="balance"
                type="text"
                placeholder={props.balance}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
            />

            <div>Annual return</div>
            <input
                name="annual_return"
                type="text"
                placeholder={props.annual_return}
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
            />
            <button onClick={handleUpdate}>Update account</button>
            <button onClick={() => { props.deleteAccount(props.account_name) }}>Delete account</button>
        </div>
    )
}
export default AccountCard;
