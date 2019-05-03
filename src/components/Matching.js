import React, {Component} from 'react';
import { connect } from 'react-redux'
import ReactSwipe from 'react-swipe';
import {sendYesUser} from '../store/match'

class Matching extends Component {

    confirmMatch(eachUser) {
      sendYesUser(this.props.user.Id, eachUser.id)
    }

    render() {
      let reactSwipeEl;

    return (
      <div>
        <ReactSwipe
          // className="carousel"
          swipeOptions={{ continuous: true }}
          ref={el => (reactSwipeEl = el)}
        >

          { this.props.allUserList.map((eachUser) => {
            return (
              <div>
                <h1>{eachUser.firstName}</h1>
                <button onClick={(eachUser) => this.confirmMatch(eachUser)}>Yes</button>
                <button onClick={() => reactSwipeEl.next()}>No</button>
              </div>)
          })}

        </ReactSwipe>
        <button onClick={() => reactSwipeEl.next()}>Next</button>
        <button onClick={() => reactSwipeEl.prev()}>Previous</button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    user: state.user,
    preferences: state.preferences,
    allUserList: state.matchlist
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendYesUser: (userId) => dispatch(sendYesUser(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Matching)
