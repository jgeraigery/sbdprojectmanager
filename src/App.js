import logo from './logo.svg';
import './App.css';
import { OAuth } from 'oauthio-web';

const axios = require('axios');

var username = ''

OAuth.initialize('_kPudQPY3u7LLbJwnCHnB8v8y5M')
OAuth.popup('basecamp').done(function(result) {
    console.log(result)
    // do some stuff with result
    result.me().done(function(data) {
      // do something with `data`, e.g. print data.name
      alert('Hello ' + data.name + '! ' + data.id + ' ' + result.access_token) 
      console.log('id:' + data.id)
      console.log('token:' + result.access_token)
      const config = {
        method: 'get',
        url: `https://3.basecampapi.com/${data.id}/people.json`,
        headers: { Authorization: `Bearer ${result.access_token}`, 'User-Agent' : 'SBDProjectManager (adamgf@gmail.com)', 'Content-Type' : 'application/json' }
      };
      const someFunc = async() => {
          alert('Entered someFunc')
          let res = await axios(config)
          alert("All People: " + res);
      }
      someFunc()
    })
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {username}!!
        </a>
      </header>
    </div>
  );
}

export default App;
