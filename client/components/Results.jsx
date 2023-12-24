import React, { Component } from 'react';

const Results = () => {

    return (
        <div>
                <div>Net worth at retirement</div>
                <input name="accounts" type="text" placeholder="$3000"></input>

                <div>Retirement needs</div>
                <input name="savings" type="text" placeholder="$200"></input>

        </div>
    )
}

export default Results;
