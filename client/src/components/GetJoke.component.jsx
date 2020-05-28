import React from 'react';

const GetJoke = ({ getJoke, joke }) => (
  <div className='joke-container'>
    <h3>{joke || 'Want to hear a joke?'}</h3>
    <button onClick={getJoke}>Get Joke</button>
  </div>
);

export default GetJoke;
