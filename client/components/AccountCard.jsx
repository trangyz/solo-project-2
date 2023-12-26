import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const AccountCard = (props) => {
    return (
        <div className='account-card'>
            <div>Account name</div>
            <input name="account_name" type="text" placeholder={props.account_name}></input>

            <div>Balance</div>
            <input name="balance" type="text" placeholder={props.balance}></input>

            <div>Annual return</div>
            <input name="annual_return" type="text" placeholder={props.annual_return}></input>
            <button onClick={() => {props.updateAccount({account_name}, {annual_return}, {balance})}}>Update account</button>
            <button onClick={() => {props.deleteAccount(props.account_name)}}>Delete account</button>
        </div>
    )
}
export default AccountCard;
