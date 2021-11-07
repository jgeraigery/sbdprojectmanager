import logo from './logo.svg';
import './App.css';
import { OAuth } from 'oauthio-web';

var username = 'dummy'

OAuth.initialize('_kPudQPY3u7LLbJwnCHnB8v8y5M')
OAuth.popup('basecamp').done(function(result) {
    console.log(result)
    // do some stuff with result
    result.me().done(function(data) {
      // do something with `data`, e.g. print data.name
      alert('Hello ' + data.name + '!') 
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
