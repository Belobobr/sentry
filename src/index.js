// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import delay from 'await-delay';
import * as Sentry from '@sentry/browser';
import Select from 'react-select';
import {Typeahead, AsyncTypeahead} from 'react-bootstrap-typeahead';

import ErrorBoundary from './ErrorBoundary';
import BigComponent from './BigComponent';

// import {getRelease} from '../utils';

//TODO check issue. If sentry does't configured warning not shown.
Sentry.init({ dsn: 'https://4e5c627b9f474e2a96722252f738bd76@sentry.io/1289527', release: '12414ff194fc36dc4fa65d8d4ffdd13d1e374115' });

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
        await delay(2000);
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
                        labelKey="login"
                        minLength={3}
                        onSearch={this._handleSearch}
                        placeholder="Search for a Github user..."
                        renderMenuItemChildren={(option, props) => (
                            <GithubMenuItem key={option.id} user={option} />
                        )}
                    />
                    <div>
                        {this.state.selectedOption !== null && this._renderOptions()}
                    </div>
                </div>
            </form>
        </div>
    }

    _renderOptions() {
        let options = [];

        for (let i = 0; i < this.state.selectedOption.name; i++) {
            options.push(<div><button>{i + 1}</button></div>);
        }

        return <div>
            {options}
        </div>
    }

    _onOptionSelected(selectedOption) {
        this.setState({
            selectedOption: selectedOption.length > 0 ? selectedOption[0] : null
        })
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

const SEARCH_URI = 'https://api.github.com/search/users';

function makeAndHandleRequest(query, page = 1) {
    return fetch(`${SEARCH_URI}?q=${query}+in:login&page=${page}&per_page=50`)
        .then((resp) => resp.json())
        .then(({items, total_count}) => {
            const options = items.map((i) => ({
                avatar_url: i.avatar_url,
                id: i.id,
                login: i.login,
            }));
            return {options, total_count};
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

const body = document.getElementById('root');
if (body) {
    ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, body);
} else {
    //TODO programmer error
}

