// import OtherComponent from '/src/webpack/components/OhterComponent'

const routes = [
  {
    path: '',
    component: {
      template: '<h1>This path is "home"</h1>'
    }
  },
  {
    path: '/page',
    component: {
      template: '<h1>This path is "page"</h1>'
    }
  }
];

export default routes;
