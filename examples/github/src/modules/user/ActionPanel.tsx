/**
 * user action panel
 * @author yoyoyohamapi
 * @ignore created 2018-07-17 21:18:38
 */
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Row, Col, Select, Input } from 'antd'
import { LoadingState } from '@reobservable/core'
import { UserState } from '@models/user'

interface StateMapper {
  user: UserState
  loading: LoadingState
}

const Option = Select.Option
const Search = Input.Search

const ORDER_LIST = [
  {
    text: '按 followers 数目排序',
    value: 'followers'
  },
  {
    text: '按 repos 数目排序',
    value: 'repositories'
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
    dispatch({
      type: 'user/patch',
      payload: {
        pagination: {
          page: 1
        }
      }
    })
    if (query === props.query) {
      dispatch({ type: 'user/fetch' })
    } else {
      dispatch({
        type: 'user/change',
        payload: {
          query
        }
      })
    }
  }

  const handleSortChange = (sort: string) => {
    dispatch({
      type: 'user/change',
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

const mapStateToProps = ({ user, loading }: StateMapper): Props => ({
  sort: user.sort,
  query: user.query,
  disabledSearch: loading.services['user/fetch']
})

export default connect(mapStateToProps)(ActionPanel)
