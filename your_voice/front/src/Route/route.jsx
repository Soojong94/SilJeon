import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPg from './MainPg/MainPg.jsx';
import loading_page from './loading_page/loading_page.jsx';


const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={MainPg} />
                <Route path="/loading_page" component={loading_page} />
            </Switch>
        </Router>
    );
};

export default Routes;