import React from 'react'
import logo from './image003.png';
import './App.css';
import { OAuth } from 'oauthio-web';
import Gallery from 'react-grid-gallery';

var targetPeopleIDs = []

function onSelectThumbnail() {
  if (!this.props.item.isSelected) {
    const personIDToAdd = this.props.item.tags[0].value
    targetPeopleIDs.push(personIDToAdd)
    alert(this.props.item.caption + ' has been added!')
    this.props.item.isSelected = true
  }
  else {
    const personIDToBeRemoved = this.props.item.tags[0].value
    const index = targetPeopleIDs.indexOf(personIDToBeRemoved)
    if (index !== -1) {
      targetPeopleIDs.splice(index, 1); 
    }
    alert(this.props.item.caption + ' has been removed!')
    this.props.item.isSelected = false
  }
  alert('Current IDs are: ' + JSON.stringify(targetPeopleIDs))
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      people : [],
      peoplethumbnails : [],
      projects : ""    
    }
  }

  componentDidMount = async() => {

    const updatePeopleState = (peopleList, peopleThumbnails) => {
      //alert('people: ' + peopleList)
      var existingpeople = this.state.people
      var existingthumbnails = this.state.peoplethumbnails
      if (peopleList && peopleList.length > 0) {
        
        const newpeople = existingpeople.concat(peopleList) 
        const newimagethumbnails = existingthumbnails.concat(peopleThumbnails)
        alert('Total people count: ' + newpeople.length)
        this.setState({ people : newpeople, peoplethumbnails : newimagethumbnails })
      }
    }
    
    const updateProjectState = (projectsList) => {
      //alert('projects: ' + projectsList)
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

        const getFunc = async(theResult, peoplepage) => {
          theResult.get(`https://3.basecampapi.com/${userId}/people.json?page=${peoplepage}`)
          .done(function(peoplelist) {
            var ids = []
            var thumbnailImages = []
            for (const person of peoplelist) {
              ids.push(person.id)
              const representationalImage = {
                src: person.avatar_url,
                thumbnail: person.avatar_url,
                thumbnailWidth: 64,
                thumbnailHeight: 64,
                isSelected: false,
                caption: person.name,
                tags: [{ value: person.id, title: person.name }]
              }
              thumbnailImages.push(representationalImage)
            }
            if (ids.length === 0) {
              alert('Got zero length of people for page ' + peoplepage + '!!')
            }
            else {
              updatePeopleState(ids, thumbnailImages)
              getFunc(result, peoplepage + 1)
            }
          })
          .fail(function(err) {
            alert('Failure condition was triggered ' + err) 
          })            
        }

        getFunc(result, 1) 

       /*
          result.get(`https://3.basecampapi.com/${userId}/people.json?page=2`)
          .done(function(peoplelist) {
            console.log('People list is: ' + JSON.stringify(peoplelist))
            var ids = [] 
            for (const person of peoplelist) {
              ids.push(person.id)
            }
            updatePeopleState(ids)
          })
          .fail(function (err) {
          });

          result.get(`https://3.basecampapi.com/${userId}/people.json?page=3`)
          .done(function(peoplelist) {
            console.log('People list is: ' + JSON.stringify(peoplelist))
            var ids = [] 
            for (const person of peoplelist) {
              ids.push(person.id)
            }
            updatePeopleState(ids)
          })
          .fail(function (err) {
          });

          result.get(`https://3.basecampapi.com/${userId}/people.json?page=4`)
          .done(function(peoplelist) {
            console.log('People list is: ' + JSON.stringify(peoplelist))
            var ids = [] 
            for (const person of peoplelist) {
              ids.push(person.id)
            }
            updatePeopleState(ids)
          })
          .fail(function (err) {
          });
        */

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
		<div style={{ 'align' : 'left' }}><img src={logo} alt="logo" /> Project Management Tool (<i>invite only</i>)</div>
        <div>
          All People:
          <div>
            <Gallery images={this.state.peoplethumbnails} onClickThumbnail={onSelectThumbnail} style={{ 'width' : '80%' }}/>
          </div>     
        </div>
        <div>
          All Projects: 
        </div>
      </header>
    </div>
    );
  }
}

export default App;
