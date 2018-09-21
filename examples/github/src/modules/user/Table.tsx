/**
 * user list
 * @author yoyoyohamapi
 * @ignore created 2018-07-17 21:18:38
 */
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Table as AntTable } from 'antd'
import { PaginationProps } from 'antd/lib/pagination'
import { TableProps, ColumnProps } from 'antd/lib/table'
import { LoadingState, getSelectors, Symbols } from '@reobservable/core'
import { User, UserState } from '@models/user'

interface StateMapper {
  user: UserState,
  loading: LoadingState
}

const columns: ColumnProps<User>[] = [{
  key: '_rank',
  title: '排名',
  width: 150,
  render: (text: string, record: User, index: number) => index + 1
}, {
  key: 'username',
  dataIndex: 'login',
  title: '用户',
  render: (text: string, record: User) => {
    return (
      <a href={record.html_url} target='_blank'>{text}</a>
    )
  }
}]

const Table: React.SFC<TableProps<User> & DispatchProp> = props => {
  const { dataSource, pagination, loading, dispatch } = props

  const handleChange = (pagination: PaginationProps) => {
    dispatch({
      type: 'user/patch',
      [Symbols.ALIAS]: 'user/changePagination',
      payload: {
        pagination: {
          page: pagination.current,
          pageSize: pagination.pageSize
        }
      }
    })
  }

  return (
    <AntTable
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      onChange={handleChange}
      loading={loading}
      size='small'
      rowKey='id'
      bordered
    />
  )
}

const mapStateToProps = (state: StateMapper): TableProps<User> => {
  const { user, loading } = state
  return  {
    dataSource: user.list,
    pagination: getSelectors('user').pagination(state),
    loading: user.isSilentLoading ? false : loading.services['user/fetch']
  }
}

export default connect(mapStateToProps)(Table)
