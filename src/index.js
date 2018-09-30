// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import delay from 'await-delay';
import BigComponent from './BigComponent';
import * as Sentry from '@sentry/browser';

import ErrorBoundary from './ErrorBoundary';

// import {getRelease} from '../utils';

//TODO check issue. If sentry does't configured warning not shown.
Sentry.init({ dsn: 'https://4e5c627b9f474e2a96722252f738bd76@sentry.io/1289527', release: '12414ff194fc36dc4fa65d8d4ffdd13d1e374115' });

type AppProps = {

}

type AppState = {
    options: Array<number>,
    selectedOption: number,
}

class App extends React.Component<AppProps, AppState> {
    constructor(props) {
        super(props);
        this.state = {
            options: [1,2,3,4],
            selectedOption: 1
        }
        this.onOptionSelected = this.onOptionSelected.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    async componentDidMount() {
        await delay(2000);
    }

    render() {
        const { Body } = this;

        const error = undefined;

        return <div>
            <h1>Links</h1>

            <p>This is a link to <a href="https://www.mozilla.org">Mozilla</a>.</p>

            <p>Another link, to the <a href="https://developer.mozilla.org">Mozilla Developer Network</a>.</p>

            <h2>Buttons</h2>

            <p>
                <button data-message="This is from the first button">Click me!</button>
                <button data-message="This is from the second button">Click me too!</button>
                <button data-message="This is from the third button">And me!</button>
            </p>

            <h2>Form</h2>

            <form>
                <div>
                    <label htmlFor="name">Fill in your name:</label>
                    <input type="text" id="name" name="name"/>
                </div>
                <div>
                    <label htmlFor="age">Enter your age:</label>
                    <input type="text" id="age" name="age"/>
                </div>
                <div>
                    <label htmlFor="mood">Choose your mood:</label>
                    <RowSelector
                        options={this.state.options}
                        selectedOption={this.state.selectedOption}
                        onOptionSelected={this.onOptionSelected}
                    />
                    <div>
                        {this.renderOptions()}
                    </div>
                </div>
            </form>
        </div>
    }

    renderOptions() {
        let options = [];

        for (let i = 0; i < this.state.selectedOption; i++) {
            options.push(<div><button>{i + 1}</button></div>);
        }

        return <div>
            {options}
        </div>


    }

    onOptionSelected(value) {
        this.setState({
            selectedOption: value
        })
    }
}

type RowSelectorProps = {
    options: Array<number>,
    selectedOption: number,
    onOptionSelected: (number) => void
}

class RowSelector extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const { options, selectedOption, onOptionSelected} = this.props;

        return <select id="mood" name="mood" onChange={(event) => onOptionSelected(event.target.value)}>
            {
                options.map((option) => {
                    return  <option selected={option === selectedOption}>{option}</option>
                 })
            }
        </select>
    }
}

const body = document.getElementById('root');
if (body) {
    ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, body);
} else {
    //TODO programmer error
}

