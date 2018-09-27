import React from 'react';
import ReactDOM from 'react-dom';
import delay from 'await-delay';
import * as Sentry from '@sentry/browser';

import ErrorBoundary from './ErrorBoundary';

//TODO is it secure?
const packageInfo = require('./../package.json');

//TODO check issue. If sentry does't configured warning not shown.
Sentry.init({ dsn: 'https://4e5c627b9f474e2a96722252f738bd76@sentry.io/1289527', release: `${packageInfo.name}@${packageInfo.version}` });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    async componentDidMount() {
        await delay(2000);

        const { default: BigComponent } = await import(/* webpackChunkName: "big_component" */ './BigComponent');

        this.Body = BigComponent;

        this.setState({
            loading: false
        })

        await delay(2000);

        this.setState({
            loading: true
        })

        await delay(2000);

        const { default: AnotherBigComponent } = await import(/* webpackChunkName: "big_component" */ './AnotherBigComponent');

        this.Body = AnotherBigComponent;

        this.setState({
            loading: false
        })
    }

    render() {
        const { Body } = this;

        const error = undefined;

        error.something;

        return this.state.loading
            ? <div>Loading</div>
            : <Body/>
    }
}

const body = document.getElementById('root');
if (body) {
    ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, body);
} else {
    //TODO programmer error
}

