import React from 'react';
import { Link } from 'react-router-dom';
import Profile from '../profile/Profile';

const Home = (props) => {
    return props.authenticated ?
        <Profile
            fbStorage={props.fbStorage}
            getStorage={props.getStorage}
            authenticated={props.authenticated}
            user={props.user}
            bathers={props.bathers}
            picture={props.picture}
        />
        :
        (<div style={{ minHeight: '150px' }}>
            Please {` `}
            <Link to="/signin">Sign in</Link>
            {` `} or {` `}
            <Link to="/register">Register</Link>
        </div>)
}

export default Home;