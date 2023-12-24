import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Inputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        fetch('/feed/test1/')
            .then(res => res.json())
            .then(user => {
                this.setState({
                    user
                });
            })
    }

    render() {
        return (
            <div>
                <form method="POST" action="/update">                    
                    <div>Current accounts</div>
                    <input name="accounts" type="text" placeholder={this.state.user.monthly_savings}></input>

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
