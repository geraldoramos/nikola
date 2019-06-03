import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Now we can render our application into it
render( <Home />, document.getElementById('root') );
