/**
 * user module
 * @author yoyoyohamapi
 * @ignore created 2018-07-17 21:15:39
 */
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import ActionPanel from './ActionPanel'
import Table from './Table'

class User extends React.Component<DispatchProp> {
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetch'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'user/stopPolling'
    })
  }

  render() {
    return (
      <>
        <ActionPanel />
        <Table />
      </>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(User)
