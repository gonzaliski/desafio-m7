import {Router} from '@vaadin/router';

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  {path: '/home', component:'home-page'},
  {path: '/checkEmail', component:'check-page'},
  {path: '/myData', component:'user-data'},
  {path: '/password', component:'password-page'},

]);