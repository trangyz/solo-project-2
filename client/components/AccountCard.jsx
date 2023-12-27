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
                id="account_name"
                type="text"
                placeholder={"e.g. Robinhood"}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
            />

            <div>Balance</div>
            <input
                name="balance"
                type="text"
                id="balance"
                placeholder={"e.g. 1000"}
                value={balance.toLocaleString('en-US', { style: 'currency', currency: "USD" })}
                onChange={(e) => setBalance(e.target.value)}
            />

            <div>Annual return %</div>
            <input
                name="annual_return"
                type="text"
                id="return"
                placeholder={"e.g. 10"}
                value={annualReturn.toLocaleString('en-US')}
                onChange={(e) => setAnnualReturn(e.target.value)}
            />
            <button id="update-add-button" onClick={handleUpdate}>Update account</button>
            <button id="delete-button" onClick={() => {
                const confirmDelete = window.confirm("Are you sure you want to delete this account?");
                if (confirmDelete) {
                    props.deleteAccount(props.account_name);
                    { handleUpdate };
                }
            }}>Delete account</button>
        </div>
    )
}
export default AccountCard;
