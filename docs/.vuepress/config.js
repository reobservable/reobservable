module.exports = {
  title: 'Reobservable',
  description: 'Redux + rxjs + redux-obersvable best practice. Inspired by dva, rematch.',
  themeConfig: {
    repo: 'reobservable/reobservable',
    docsDir: 'docs',
    locales: {
      '/': {
        nav: [
          { text: 'Introduction', link: '/introduction/' },
          { text: 'Basics', link: '/basics/'},
          { text: 'Recipes', link: '/recipes/' },
          { text: 'API Reference', link: '/api/'}
        ],
        sidebar: {
          '/introduction/': [{
            title: 'Introduction',
            collapsable: false,
            children: [
              '',
              'get-started',
              'architecture'
            ]
          }],
          '/basics/': [{
            title: 'Basics',
            collapsable: false,
            children: [
              '',
              'service',
              'error',
              'loading'
            ]
          }]
        }
      }
    }
  }
}