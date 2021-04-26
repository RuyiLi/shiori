import React from 'react';     
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import './App.scss';
import { HomeView, ChapterView } from './views/';

export default function App () {
    // const body = await fetch('https://ibb.co/album/cDsYKF').then(r => r.text());
    return (
        <>
            <Router>
                <Switch>
                    <Route path='/chapter/:albumID' children={ <ChapterView/> }></Route>
                    <Route path='/'><HomeView/></Route>
                </Switch>
            </Router>
        </>
    )
}