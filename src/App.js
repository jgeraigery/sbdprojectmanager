import React from 'react'
import logo from './logo.svg';
import './App.css';
import { OAuth } from 'oauthio-web';


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      people : "",
      projects : ""    
    }
  }

  componentDidMount = async() => {

    const updatePeopleState = (peopleList) => {
      alert('people: ' + peopleList)
      this.setState({ people : peopleList })
    }
    
    const updateProjectState = (projectsList) => {
      alert('projects: ' + projectsList)
      this.setState({ projects : projectsList})
    }

    OAuth.initialize('_kPudQPY3u7LLbJwnCHnB8v8y5M')
    OAuth.popup('basecamp').done(function(result) {
      console.log(JSON.stringify(result))
      // do some stuff with result


      result.me().done(function(data) {
        // do something with `data`, e.g. print data.name
        var userId = data.id 
        let accounts = data.raw.accounts
        for (var i=0;i < accounts.length;i++) {
          if (accounts[i].name === "Stanley Black & Decker") {
            userId = accounts[i].id
            break
          }
        }

        result.get(`https://3.basecampapi.com/${userId}/people.json`).done(function(peoplelist) {
          console.log('People list is: ' + JSON.stringify(peoplelist))
          updatePeopleState(JSON.stringify(peoplelist))
        })

        result.get(`https://3.basecampapi.com/${userId}/projects.json`).done(function(projectslist) {
          console.log('Project list is: ' + JSON.stringify(projectslist))
          updateProjectState(JSON.stringify(projectslist))
        })
    
     
/*   
      const config = {
        method: 'get',
        withCredentials: true,
        url: `https://3.basecampapi.com/${userId}/people.json`,
        headers: { 'Authorization' : `Bearer ${result.access_token}`, 'Content-Type' : 'application/json' }
      }
      const someFunc = async() => {
          let res = await OAuth.get(`https://3.basecampapi.com/${userId}/people.json`, config) 
          alert("All People: " + JSON.stringify(res));
      }
      someFunc()
 */
      })
    })
  }

  render() { 
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
          Learn React
        </a>
        <div>
          All People: {this.state.people}
        </div>
        <div>
          All Projects: {this.state.projects}
        </div>
      </header>
    </div>
    );
  }
}

export default App;
