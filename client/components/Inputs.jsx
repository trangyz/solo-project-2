import React, { useState, Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountCard from './AccountCard.jsx';
import Cookies from 'js-cookie';

const Inputs = () => {
    const [user, setUser] = useState({
        username: '',
        monthly_savings: '',
        age: '',
        retirement_age: '',
        retirement_spend: '',
        future_net_worth: 0,
        future_retirement_need: 0,
        accounts: []
    });

    const [newAccount, setNewAccount] = useState({
        account_name: '',
        balance: '',
        annual_return: ''
    });

    useEffect(() => {
        fetch('/feed/')
            .then(res => res.json())
            .then(userData => setUser(userData));
    }, []);

    const addAccount = (event) => {
        const data = {
            account_name: newAccount.account_name,
            annual_return: newAccount.annual_return,
            balance: newAccount.balance
        };
        fetch(`/update/${user.username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(updatedUser => setUser(updatedUser))
            .then(setNewAccount({
                account_name: '',
                balance: '',
                annual_return: ''
            }))
            .catch((err) => console.log('App: add account: ERROR: ', err))
    }

    const updateAccount = (accountId, account_name, annual_return, balance) => {
        fetch(`/update/${user.username}/${accountId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_name,
                annual_return,
                balance
            })
        })
            .then((res) => res.json())
            .then(updatedUser => {
                setUser(updatedUser);
            })
            .catch((err) => console.log('App: update account: ERROR: ', err))
    }

    const deleteAccount = (accountId) => {
        fetch(`/delete/${user.username}/${accountId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then(updatedUser => {
                setUser(updatedUser);
            })
            .catch((err) => console.log('App: delete account: ERROR: ', err));
    }

    const handleNewAccountChange = (e) => {
        setNewAccount({
            ...newAccount,
            [e.target.name]: e.target.value
        })
    }

    const handleUserChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleUserSubmit = (event) => {
        event.preventDefault();
        const data = {
            monthly_savings: event.target.monthly_savings.value,
            age: event.target.age.value,
            retirement_age: event.target.retirement_age.value,
            retirement_spend: event.target.retirement_spend.value
        };
        fetch(`/update/${user.username}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(updatedUser => {
                setUser(updatedUser);
            })
    }

    const accountsElems = user.accounts.map((acc, i) => (
        <div key={acc._id}>
            <AccountCard
                account_id={acc._id}
                balance={acc.balance}
                account_name={acc.account_name}
                annual_return={acc.annual_return}
                updateAccount={updateAccount}
                deleteAccount={deleteAccount}
            />
        </div>
    ));

    const newAccountForm = () => {
        return (
            <div className='account-card'>
                <div>Account name</div>
                <input
                    name="account_name"
                    id="account_name"
                    type="text"
                    placeholder="e.g. Robinhood"
                    value={newAccount.account_name}
                    onChange={handleNewAccountChange}
                />

                <div>Balance $</div>
                <input
                    name="balance"
                    id="balance"
                    type="text"
                    placeholder="e.g. 1000"
                    value={newAccount.balance}
                    onChange={handleNewAccountChange}
                />

                <div>Annual return %</div>
                <input
                    name="annual_return"
                    type="text"
                    id="return"
                    placeholder="e.g. 10"
                    value={newAccount.annual_return}
                    onChange={handleNewAccountChange}
                />
                <button id="update-add-button" onClick={addAccount}>Add account</button>
            </div>
        )
    }

    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', '');
        data.addColumn('number', '$');
        data.addRows([
            ['You will have', user.future_net_worth],
            ['You will need', user.future_retirement_need],
        ]);

        // Set chart options
        var options = {
            'title': 'Retirement Plan',
            'width': 800,
            'height': 300,
            'hAxis': {
                minValue: 0
            }
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

    const retirementConclusion = () => {
        if (user.future_net_worth > user.future_retirement_need) {
            return (
                <div>You are on track for your retirement goals.</div>
            )
        } else {
            return (
                <div>You may need to adjust your retirement plan.</div>
            )
        }
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome to your dashboard, {user.username}</h1>
            <div class="sign-out">Not {user.username}? <a href="/signout">Sign out</a></div>

            {accountsElems}
            {newAccountForm()}
            <div class="small-container">
                <div class="left">
                    <form onSubmit={handleUserSubmit} class="other-inputs">

                        <div className='heading'>Planned monthly savings ($)</div>
                        <input
                            name="monthly_savings"
                            type="text"
                            value={user.monthly_savings}
                            onChange={handleUserChange}
                        />

                        <div class='heading'>Current age</div>
                        <input
                            name="age"
                            type="text"
                            value={user.age}
                            onChange={handleUserChange}
                        />

                        <div class="heading">Planned retirement age</div>
                        <input
                            name="retirement_age"
                            type="text"
                            value={user.retirement_age}
                            onChange={handleUserChange}
                        />

                        <div class="heading">Monthly retirement spend ($)</div>
                        <input
                            name="retirement_spend"
                            type="text"
                            value={user.retirement_spend}
                            onChange={handleUserChange}
                        />

                        <div><button type="submit" id="submit-button">Calculate</button></div>

                    </form>
                </div>
                <div class="right">
                    <div id="chart_div"></div>

                    <div class="result">
                        <div>At retirement, you will have <b>${Math.round(user.future_net_worth).toLocaleString('en-US')}</b>.</div>
                        <div>At retirement, you will need <b>${Math.round(user.future_retirement_need).toLocaleString('en-US')}</b>.</div>
                        {retirementConclusion()}
                    </div>
                </div>
            </div>
        </div>
    )
}



// class Inputs extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             user: {
//                 username: '',
//                 monthly_savings: '',
//                 age: '',
//                 retirement_age: '',
//                 retirement_spend: '',
//             },
//         }
//         this.handleSubmit = this.handleSubmit.bind(this); // Bind the method
//         this.deleteAccount = this.deleteAccount.bind(this);
//         this.updateAccount = this.updateAccount.bind(this);
//         // this.username = 'test1'
//     }

//     componentDidMount() {
//         fetch(`/feed/`)
//             .then(res => {
//                 return res.json()
//             })
//             .then(user => {
//                 this.setState({ user });
//             })
//     }

//     updateAccount(account_name, annual_return, balance) {
//         fetch(`/update/${this.state.user.username}/${account_name}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 account_name,
//                 annual_return,
//                 balance
//             })
//         })
//             .then((res) => res.json())
//             .then(user => {
//                 this.setState({ user });
//             })
//             .catch((err) => console.log('App: update account: ERROR: ', err))
//     }

//     deleteAccount(account_name) {
//         fetch(`/delete/${this.state.user.username}/${account_name}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then((res) => res.json())
//             .then(user => {
//                 this.setState({ user });
//             })
//             .catch((err) => console.log('App: delete account: ERROR: ', err));
//     }

//     handleSubmit(event) {
//         event.preventDefault();
//         const data = {
//             monthly_savings: event.target.monthly_savings.value,
//             age: event.target.age.value,
//             retirement_age: event.target.retirement_age.value,
//             retirement_spend: event.target.retirement_spend.value
//         };
//         fetch(`/update/${this.state.user.username}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data),
//         })
//             .then(response => response.json())
//             .then(user => {
//                 this.setState({ user });
//             })
//     }

//     render() {
//         const accountsElems = this.state.user && this.state.user.accounts
//             ? this.state.user.accounts.map((acc, i) => (
//                 <div key={i}>
//                     <AccountCard
//                         balance={acc.balance}
//                         account_name={acc.account_name}
//                         annual_return={acc.annual_return}
//                         updateAccount={this.updateAccount}
//                         deleteAccount={this.deleteAccount}
//                     />
//                 </div>
//             ))
//             : <div>Loading accounts...</div>;

//         const newAccountForm = () => {
//             return (
//                 <div className='account-card'>
//                     <div>Account name</div>
//                     <input
//                         name="account_name"
//                         type="text"
//                         // placeholder={props.account_name}
//                         // value={accountName}
//                         // onChange={(e) => setAccountName(e.target.value)}
//                     />

//                     <div>Balance</div>
//                     <input
//                         name="balance"
//                         type="text"
//                         // placeholder={props.balance}
//                         // value={balance}
//                         // onChange={(e) => setBalance(e.target.value)}
//                     />

//                     <div>Annual return</div>
//                     <input
//                         name="annual_return"
//                         type="text"
//                         // placeholder={props.annual_return}
//                         // value={annualReturn}
//                         // onChange={(e) => setAnnualReturn(e.target.value)}
//                     />
//                     <button>Add account</button>
//                 </div>
//             )
//         }

//         if (!this.state.user) {
//             return (
//                 <div>Loading...</div>
//             )
//         } else {

//             return (
//                 <div>
//                     <form onSubmit={this.handleSubmit}>

//                         {accountsElems}
//                         {newAccountForm()}
//                         <div>Planned monthly savings</div>
//                         <input name="monthly_savings" type="text" placeholder={this.state.user.monthly_savings}></input>

//                         <div>Current age</div>
//                         <input name="age" type="text" placeholder={this.state.user.age}></input>

//                         <div>Planned retirement age</div>
//                         <input name="retirement_age" type="text" placeholder={this.state.user.retirement_age}></input>

//                         <div>Monthly retirement spend</div>
//                         <input name="retirement_spend" type="text" placeholder={this.state.user.retirement_spend}></input>

//                         <div><input type="submit" value="Calculate"></input></div>
//                     </form>

//                     <div>You will have ${Math.round(this.state.user.future_net_worth)}.</div>
//                     <div>You will need ${Math.round(this.state.user.future_retirement_need)}.</div>

//                 </div>
//             )
//         }
//     }
// }

export default Inputs;
