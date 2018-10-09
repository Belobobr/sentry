// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import delay from 'await-delay';
import * as Sentry from '@sentry/browser';
import Select from 'react-select';
import {Typeahead} from 'react-bootstrap-typeahead';
import AsyncTypeahead from './AsyncTypeahead';

import ErrorBoundary from './ErrorBoundary';
import BigComponent from './BigComponent';

// import {getRelease} from '../utils';

//const options = [{name: "1", label: '1'}, {name: "2", label: '2'}, {name: "3", label: '3'}, {name: "4", label: '4'}]

//TODO check issue. If sentry does't configured warning not shown.

//TODO show warning if uncommited changes presents in release build.

if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: 'https://4e5c627b9f474e2a96722252f738bd76@sentry.io/1289527', release: process.env.RELEASE_VERSION });
}

type AppProps = {

}

type AppState = {
    options: Array<string>,
    selectedOption: string,
}

class App extends React.Component<AppProps, AppState> {
    constructor(props) {
        super(props);
        this.state = {
            allowNew: false,
            isLoading: false,
            multiple: false,
            options: [],
            selectedOption: []
        }
        this._onOptionSelected = this._onOptionSelected.bind(this);
        this._renderOptions = this._renderOptions.bind(this);
        this._handleSearch = this._handleSearch.bind(this);
    }

    async componentDidMount() {
        //search with empty string
        this._handleSearch();
    }

    render() {
        const { Body } = this;
        const { options, selectedOption } = this.state;

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
                <BigComponent/>
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
                    <AsyncTypeahead
                        {...this.state}
                        onFocus={this._handleFocus}
                        minLength={0}
                        labelKey="name"
                        onSearch={this._handleSearch}
                        placeholder="Search for a Github user..."
                        renderMenuItemChildren={(option, props) => (
                            <div key={option.name}>{option.label}</div>
                        )}
                        onChange={this._onOptionSelected}
                    />
                    <div>
                        {this._renderOptions()}
                    </div>
                </div>
            </form>
        </div>
    }

    _renderOptions() {
        let options = [];

        if (this.state.selectedOption.length < 1) {
            return
        }

        for (let i = 0; i < this.state.selectedOption[0].name; i++) {
            options.push(<div><button>{i + 1}</button></div>);
        }

        return <div>
            {options}
        </div>
    }

    _onOptionSelected(selectedOption) {
        this.setState({
            selectedOption
        })
    }

    _handleFocus() {
        //TODO lazy load, when focus && nothing in input && no options  - make request

        // if (this.state.options.length !== 0) {
        //     return;
        // }
    }

    _handleSearch(query) {
        this.setState({isLoading: true});
        makeAndHandleRequest(query)
            .then(({options}) => {
                this.setState({
                    isLoading: false,
                    options,
                });
            });
    }
}

// type RowSelectorProps = {
//     options: Array<string>,
//     selectedOption: string,
//     _onOptionSelected: (string) => void
// }
//
// class RowSelector extends React.Component {
//     constructor(props){
//         super(props);
//     }
//
//     render() {
//         const { options, selectedOption, _onOptionSelected} = this.props;
//
//         return <select id="mood" name="mood" onChange={(event) => _onOptionSelected(event.target.value)}>
//             {
//                 options.map((option) => {
//                     return  <option selected={option === selectedOption}>{option}</option>
//                  })
//             }
//         </select>
//     }
// }

const SEARCH_URI = 'https://belobobr.github.io/sentry/numbers.json';

function makeAndHandleRequest(query, page = 1) {
    return fetch(SEARCH_URI)
        .then((resp) => resp.json())
        .then((numbers) => {
            return {options: numbers, total_count: numbers.length};
        });
}

const GithubMenuItem = ({user}) => (
    <div>
        <img
            alt={user.login}
            src={user.avatar_url}
            style={{
                height: '24px',
                marginRight: '10px',
                width: '24px',
            }}
        />
        <span>{user.login}</span>
    </div>
);

GithubMenuItem.propTypes = {
    user: PropTypes.shape({
        avatar_url: PropTypes.string.isRequired,
        login: PropTypes.string.isRequired,
    }).isRequired,
};

export default GithubMenuItem;


const startApp = () => {
    const body = document.getElementById('root');
    if (body) {
        ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, body);
    } else {
        //TODO programmer error
    }
};

if(window.cordova) {
    document.addEventListener('deviceready', startApp, false);
} else {
    startApp();
}

