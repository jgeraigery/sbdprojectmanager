import React from 'react'
import logo from './SBD_Yellow_Primary.png';
import './App.css';
import { OAuth } from 'oauthio-web';
import Gallery from 'react-grid-gallery';
import Select from 'react-select';

const VIPs = [
	12921371, 
	12964335, 
	12964336, 
	12998921, 
	13325954, 
	20877820, 
	36329995, 
	36330029, 
	36330129, 
	36331086, 
	36492685, 
	36533990, 
	36540113, 
	36540202
]

const autoSelected = [
	12964335,
	36329995,
	36330129
]

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted yellow',
    color: state.isSelected ? 'blue' : 'yellow',
    padding: 20,
	backgroundColor: '#808080',
	color: '#ffffff'
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: '100%',
	border: '1px dotted yellow'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

var targetPeopleIDs = []
var targetProjectIDs = []

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
	if (targetPeopleIDs.length === 1) {
      targetPeopleIDs = []
	}
    else if (index !== -1) {
      targetPeopleIDs.splice(index, 1) 
    }
    alert(this.props.item.caption + ' has been removed!')
    this.props.item.isSelected = false
  }
}

function handleProjectChange(e, e2) {
  let optionAction = e2.action
  if (optionAction === 'select-option') {
    targetProjectIDs.push(e2.option.value)
  }
  else if (optionAction === 'clear') {
  	targetProjectIDs = []
  }
  else if (optionAction === 'remove-value') {
	const index = targetProjectIDs.indexOf(e2.removedValue.value)
	if (targetProjectIDs.length === 1) {
	  targetProjectIDs = []
	}
	else if (index !== -1) {
	  targetProjectIDs.splice(e2.removedValue.value, index)
	}
  }
  else {
  	alert('Unrecognized action: ' + optionAction + ' sent to handleProjectChange().')
  }	
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peoplethumbnails : [],
      projects : []    
    }
  }

  componentDidMount = async() => {

    const updatePeopleState = (peopleThumbnails) => {
      const existingthumbnails = this.state.peoplethumbnails
      if (peopleThumbnails && peopleThumbnails.length > 0) {
        var newimagethumbnails = existingthumbnails.concat(peopleThumbnails)
		newimagethumbnails.sort((a, b) => (a.tags[0].value > b.tags[0].value) ? 1 : -1)
        this.setState({ peoplethumbnails : newimagethumbnails })
      }
    }
    
    const updateProjectState = (projectsList) => {
      const existingprojects = this.state.projects
	  if (projectsList && projectsList.length > 0) {
	    const newprojects = existingprojects.concat(projectsList)
        this.setState({ projects : newprojects })
	  }
    }

    OAuth.initialize('_kPudQPY3u7LLbJwnCHnB8v8y5M')
    OAuth.popup('basecamp')
	.done(function(result) {
      result.me().done(function(data) {

        var userId = data.id 
        let accounts = data.raw.accounts
		  for (var i=0;i < accounts.length;i++) {
          if (accounts[i].name === "Stanley Black & Decker") {
            userId = accounts[i].id
            break
          }
        }
				
        const getPeopleFunc = async(theResult) => {
		  
		  for (const personId of VIPs) {
            theResult.get(`https://3.basecampapi.com/${userId}/people/${personId}.json`)
            .done(function(person) {
			  const autoSelectIndex = autoSelected.indexOf(person.id)
			  const selectEm = (autoSelectIndex !== -1)
			  if (selectEm) {
				targetPeopleIDs.push(person.id)
			  }
			  const representationalImage = {
                src: person.avatar_url,
                thumbnail: person.avatar_url,
                thumbnailWidth: 64,
                thumbnailHeight: 64,
                isSelected: selectEm,
                caption: person.name,
                tags: [{ value: person.id, title: person.name }]
              }
              updatePeopleState([representationalImage])
            })
            .fail(function(err) {
              alert('Failed to get person: ' + JSON.stringify(err)) 
            })   
		  }         
        }

        getPeopleFunc(result) 

        const getProjectsFunc = async(theResult, projectspage) => {
          theResult.get(`https://3.basecampapi.com/${userId}/projects.json?page=${projectspage}`)
          .done(function(projectslist) {
            var projectsOptions = []
            for (const project of projectslist) {
			  const projectSelectOption = {
				  value: project.id,
				  label: project.name		
			  }	
			  projectsOptions.push(projectSelectOption)
            }
            if (projectsOptions.length > 0) {
              updateProjectState(projectsOptions)
              getProjectsFunc(result, projectspage + 1)
            }
          })
          .fail(function(err) {
            alert('Failed to get projects: ' + JSON.stringify(err)) 
          })            
        }

        getProjectsFunc(result, 1)
    
      })
    })
    .fail(function(err) {
      alert('OAuth failed with err: ' + JSON.stringify(err)) 
    })            
  }

  putPeopleToProject = async() => {
  	if (targetPeopleIDs.length === 0 || targetProjectIDs.length === 0) {
  	  alert('Please select at least one person and one project.')
  	}
  	else {
      OAuth.initialize('_kPudQPY3u7LLbJwnCHnB8v8y5M')
  	  OAuth.popup('basecamp')
  	  .done(function(result) {
  	    result.me().done(function(data) {

          var userId = data.id 
          let accounts = data.raw.accounts
          for (var i=0;i < accounts.length;i++) {
            if (accounts[i].name === "Stanley Black & Decker") {
              userId = accounts[i].id
              break
            }
          }
	    
  		  //console.log('access_token is: ' + result.access_token)
  	      const putData = `{ "grant" : [${targetPeopleIDs}], "revoke" : [] }`
				
          for (const projectId of targetProjectIDs) {
  		    result.put(`https://3.basecampapi.com/${userId}/projects/${projectId}/people/users.json`, {
  			  headers: {
  			    "Content-Type" : "application/json"
  			  },
  		      data: putData
  		    })
  	        .done(function (response) {
  	          //this will display the id of the message in the console
  	          alert('Success granting users: ' + JSON.stringify(response))
  	        })
  	        .fail(function (err) {
  	          //handle error with err
  			  alert('Failed to grant users: ' + JSON.stringify(targetPeopleIDs) + 
  			        ' for project: ' + projectId + ' err: ' + JSON.stringify(err))
  	        });
		  
  		  }
		
  	    })
  	  })
      .fail(function(err) {
        alert('OAuth failed with err: ' + JSON.stringify(err)) 
      })            
  	}
  }

  render() {  
    return (
    <div className="App">
      <body className="App-header">
		<div style={{ 'align' : 'left' }}><img src={logo} alt="logo" width='293.88888888888' height='46'/> Project Management Tool (<i>invite only</i>)</div>
        <div><p/>
          All People:
          <div>
            <Gallery images={this.state.peoplethumbnails} onClickThumbnail={onSelectThumbnail} />
          </div>     
        </div>
		<p/>
        <div>
          All Projects: 
		  <div>
		    <Select id='projectselector' options={this.state.projects} isMulti onChange={handleProjectChange} styles={customStyles} />
		  </div>
        </div><p/>
		<div><button onClick={this.putPeopleToProject} style={{ fontSize : '48px', height : '80px', width : '65%', backgroundColor : '#808080', color : '#ffffff' }}>Add People to Projects</button></div>
        <p/><p/>
	  </body>
    </div>
    );
  }
}

export default App;
