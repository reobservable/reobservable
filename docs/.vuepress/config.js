module.exports = {
  title: 'Reobservable',
  description: 'Redux + rxjs + redux-obersvable best practice. Inspired by dva, rematch.',
  base: '/reobservable/',
  themeConfig: {
    repo: 'reobservable/reobservable',
    docsDir: 'docs',
    locales: {
      '/': {
        nav: [
          { text: 'Introduction', link: '/introduction/' },
          { text: 'Basics', link: '/basics/'},
          { test: 'Advanced', link: '/advanced/'},
          { text: 'API Reference', link: '/api/'}
        ],
        sidebar: {
          '/introduction/': [{
            title: 'Introduction',
            collapsable: false,
            children: [
              '',
              'concepts',
              'get-started',
            ]
          }],
          '/basics/': [{
            title: 'Basics',
            collapsable: false,
            children: [
              'custom-service',
              'change-and-patch',
              'loading-state',
              'error-state'
            ]
          }],
          '/advanced/': [{
            title: 'Advanced',
            collapsable: false,
            children: [
            ]
          }]
        }
      }
    }
  }
}