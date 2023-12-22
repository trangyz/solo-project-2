
import React from 'react';

const App = () => {
    return (
        <div>
            <form method="POST" action="/update">
                <div>Current accounts</div>
                <input name="accounts" type="text" placeholder="$3000"></input>

                <div>Planned monhtly savings</div>
                <input name="savings" type="text" placeholder="$200"></input>

                <div>Planned retirement age</div>
                <input name="retirement" type="text" placeholder="60"></input>

                <div><input type="submit" value="Calculate"></input></div>
            </form>
        </div>

    )
}

export default App;
