/**
 * Github demo
 * @author yoyoyohamapi
 * @ignore created 2018-07-17 20:24:38
 */
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { ConnectedRouter, RouterState } from 'connected-react-router'
import { Layout, Menu } from 'antd'
import { createHashHistory } from 'history'
import User from '@modules/user'
import Repo from '@modules/repo'

interface Props {
  path: string
}

const history = createHashHistory()

const { Header, Content, Footer } = Layout

class App extends React.Component<Props> {
  render() {
    const { path } = this.props
    return (
      <ConnectedRouter history={history}>
        <Layout>
          <Header>
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={[path]}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key='/users'>
                <Link to='/users'>Users</Link>
              </Menu.Item>
              <Menu.Item key='/repos'>
                <Link to='/repos'>Repos</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px', marginTop: 20 }}>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <Route exact path='/' render={() => <Redirect to='/users' />} />
                <Route path='/users' component={User} />
                <Route path='/repos' component={Repo} />
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Reobservable</Footer>
        </Layout>
      </ConnectedRouter>
    )
  }
}

const mapStateToProps = ({ router }: { router: RouterState }): Props => ({
  path: router.location.pathname
})

export default connect(mapStateToProps)(App)
