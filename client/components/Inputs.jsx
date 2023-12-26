import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AccountCard from './AccountCard.jsx';
import Cookies from 'js-cookie';


class Inputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        }
        this.handleSubmit = this.handleSubmit.bind(this); // Bind the method
        this.username = 'test1'
    }

    componentDidMount() {        
        fetch(`/feed/${this.username}/`)
            .then(res => res.json())
            .then(user => {
                this.setState({ user });
            })
    }

    // deleteAccount(account_name) {
    //     fetch(`/delete/${username}/${account_name}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then((res) => res.json())
    //     .then(user => {
    //         this.setState({ user });
    //     })
    //     .catch((err) => console.log('App: delete account: ERROR: ', err));

    // }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            monthly_savings: event.target.monthly_savings.value,
            age: event.target.age.value,
            retirement_age: event.target.retirement_age.value,
            retirement_spend: event.target.retirement_spend.value
        };
        fetch(`/update/${this.username}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(user => {
                this.setState({ user });
            })
    }

    render() {
        const accountsElems = this.state.user && this.state.user.accounts
        ? this.state.user.accounts.map((acc, i) => (
            <div key={i}>
                <AccountCard  balance={acc.balance} account_name={acc.account_name} annual_return={acc.annual_return}/>
            </div>
        ))
        : <div>Loading accounts...</div>;

        return (
            <div>
                <form onSubmit={this.handleSubmit}>       
                    
                    <div>Current accounts</div>
                    {accountsElems}

                    <div>Planned monthly savings</div>
                    <input name="monthly_savings" type="text" placeholder={this.state.user.monthly_savings}></input>

                    <div>Current age</div>
                    <input name="age" type="text" placeholder={this.state.user.age}></input>

                    <div>Planned retirement age</div>
                    <input name="retirement_age" type="text" placeholder={this.state.user.retirement_age}></input>

                    <div>Monthly retirement spend</div>
                    <input name="retirement_spend" type="text" placeholder={this.state.user.retirement_spend}></input>

                    <div><input type="submit" value="Calculate"></input></div>
                </form>

                <div>You will have ${Math.round(this.state.user.future_net_worth)}.</div>
                <div>You will need ${Math.round(this.state.user.future_retirement_need)}.</div>

            </div>
        )
    }
}

export default Inputs;
