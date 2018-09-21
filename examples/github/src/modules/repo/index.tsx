/**
 * repo
 * @author yoyoyohamapi
 * @ignore created 2018-08-08 14:50:22
 */
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import ActionPanel from './ActionPanel'
import Table from './Table'

class Repo extends React.Component<DispatchProp> {
  componentDidMount() {
    this.props.dispatch({
      type: 'repo/fetch'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'repo/stopPolling'
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

export default connect(mapStateToProps)(Repo)
