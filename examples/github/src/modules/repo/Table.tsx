/**
 * repo list
 * @author yoyoyohamapi
 * @ignore 2018-08-08 14:51:42
 */
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Table as AntTable } from 'antd'
import { PaginationProps } from 'antd/lib/pagination'
import { TableProps, ColumnProps } from 'antd/lib/table'
import { LoadingState, getSelectors, Symbols } from '@reobservable/core'
import { Repo, RepoState } from '@models/repo'

interface StateMapper {
  repo: RepoState
  loading: LoadingState
}

const columns: ColumnProps<Repo>[] = [
  {
    key: '_rank',
    title: '排名',
    width: 150,
    render: (text: string, record, index: number) => index + 1
  },
  {
    key: 'name',
    title: 'Repo',
    dataIndex: 'name',
    render: (text: string, record) => {
      return (
        <a href={record.homepage || record.html_url} target='_blank'>
          {text}
        </a>
      )
    }
  }
]

const Table: React.SFC<TableProps<Repo> & DispatchProp> = props => {
  const { dataSource, pagination, loading, dispatch } = props
  const handleChange = (pagination: PaginationProps) => {
    dispatch({
      type: 'repo/patch',
      [Symbols.ALIAS]: 'repo/changePagination',
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

const mapStateToProps = (state: StateMapper): TableProps<Repo> => {
  const { repo, loading } = state
  return {
    dataSource: repo.list,
    pagination: getSelectors('repo').pagination(state),
    loading: repo.isSilentLoading ? false : loading.services['repo/fetch']
  }
}

export default connect(mapStateToProps)(Table)
