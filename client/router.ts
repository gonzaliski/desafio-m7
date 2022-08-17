const Router = require("@vaadin/router")
export function initRouter(rootEl:Element){

  const router = new Router(rootEl);
  
  router.setRoutes([
    {path: '/home', component:'home-page'},
    {path: '/checkEmail', component:'check-page'},
    {path: '/myData', component:'user-data'},
    {path: '/password', component:'password-page'},
    {path: '/reportPet', component:'report-pet-page'},
    {path: '/myReportedPets', component:'my-reports'},
    
  ]);
  if (location.pathname === "/") {
    Router.go("/home");
  }
}
