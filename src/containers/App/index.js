import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import escapeRegExp from 'lodash/escapeRegExp';

// Actions
import { fetchData } from '../../actions/api'

// Components 
import { Scrollbars } from 'react-custom-scrollbars'
import Datum from '../../components/Datum'

// Style
import style from './style'


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      term: ''
    }

    this.onInputChange = this.onInputChange.bind(this)
    this.getFilteredData = this.getFilteredData.bind(this)
  }

  componentWillMount() {
    this.props.fetchData()
  }

  onInputChange(e) {
    const term = e.target.value;
    this.setState({ term })
  }

  getFilteredData(data) {
    if (!data) return null
    const { term } = this.state;
    let regMark = null;
    if(term && term.trim()){
      const reg = new RegExp(escapeRegExp(term), 'i');
      regMark = new RegExp('(' + escapeRegExp(term) + ')','ig');
      data = data.filter( ({ name, email}) =>  reg.test(name) || reg.test(email));
    }

    return data.map( ( { id, name, email } ) => {
      const htmlReplace = '<span style="background-color:yellow;">$1</span>';
      name = regMark ? name.replace(regMark,htmlReplace) : name;
      email = regMark ? email.replace(regMark,htmlReplace) : email;
      return <Datum key={id} name={name} email={email} />
    });
  }

  render() {
    const { data } = this.props
    const filteredList = this.getFilteredData(data)
    const filteredListContainer = !!filteredList ? filteredList : <img src="../../../static/Loading_icon.gif" />

    return (
      <div id='mainContainer' style={style.mainContainer}>
        <div>
          <input
            placeholder="Search for name or email"
            style={style.searchBar}
            className="form-control"
            value={this.state.term}
            onChange={this.onInputChange}
          />
        </div>

        <div id="dataList" style={style.dataList} >
          <Scrollbars style={{ width: '100%', height: '400px' }}>
            {filteredListContainer}
          </Scrollbars>
        </div>

      </div>
    );
  }
}

function mapStateToProps({ api }) {
  const { data } = api

  return { data }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)