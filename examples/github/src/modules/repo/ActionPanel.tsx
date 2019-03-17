/**
 * repo action panel
 * @author yoyoyohamapi
 * @ignore created 2018-07-18 19:07:25
 */
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Row, Col, Select, Input } from 'antd'
import { LoadingState } from '@reobservable/core'
import { RepoState } from '@models/repo'

interface StateMapper {
  repo: RepoState
  loading: LoadingState
}

const Option = Select.Option
const Search = Input.Search

const ORDER_LIST = [
  {
    text: '按 star 数目排序',
    value: 'stars'
  },
  {
    text: '按 fork 数目排序',
    value: 'forks'
  }
]

interface Props {
  sort: string
  query: string
  disabledSearch: boolean
}

const ActionPanel: React.SFC<Props & DispatchProp> = props => {
  const { dispatch, sort, disabledSearch } = props

  const handleSearch = (query: string) => {
    if (query === props.query) {
      dispatch({ type: 'repo/fetch' })
    } else {
      dispatch({
        type: 'repo/change',
        payload: {
          query
        }
      })
    }
    dispatch({
      type: 'repo/patch',
      payload: {
        pagination: {
          page: 1
        }
      }
    })
  }

  const handleSortChange = (sort: string) => {
    dispatch({
      type: 'repo/change',
      payload: { sort }
    })
  }

  return (
    <Row
      gutter={20}
      type='flex'
      align='middle'
      justify='end'
      style={{ marginBottom: 24 }}
    >
      <Col>
        <Select value={sort} onChange={handleSortChange}>
          {ORDER_LIST.map(option => (
            <Option key={option.value} value={option.value}>
              {option.text}
            </Option>
          ))}
        </Select>
      </Col>
      <Col>
        <Search
          placeholder='search user...'
          onSearch={handleSearch}
          disabled={disabledSearch}
          style={{ height: 32 }}
          enterButton
        />
      </Col>
    </Row>
  )
}

const mapStateToProps = ({ repo, loading }: StateMapper): Props => ({
  sort: repo.sort,
  query: repo.query,
  disabledSearch: loading.services['repo/fetch']
})

export default connect(mapStateToProps)(ActionPanel)
