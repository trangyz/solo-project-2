import React, { Component } from 'react';

const AccountCard = (props) => {
    return (
        <div>
            <div>Account name</div>
            <input name="account_name" type="text" placeholder={props.account_name}></input>

            <div>Account balance</div>
            <input name="account_balance" type="text" placeholder={props.balance}></input>

            <div>Annual return</div>
            <input name="annual_return" type="text" placeholder={props.annual_return}></input>
        </div>
    )
}
export default AccountCard;
