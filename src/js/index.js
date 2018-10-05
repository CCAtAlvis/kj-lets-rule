// get the graphql module
const { request } = require('graphql-request');
const api = 'https://kjsce-test.herokuapp.com/v1alpha1/graphql';

const $ = require('jquery');
let user;

const loginUser = (e) => {
  e.preventDefault();
  const username = $("#username").val();
  const password = $("#password").val();

  let query = `{
    admin (
      where : {username: {_eq: "${username}"}}
    ) {
      password
      display_name
      ward
      category
    }
  }`

  request(api, query).then(data => {
    user = data.admin[0];
    // console.log(user);

    if (!user)
      return;

    if (password === user.password) {
      console.log('user logged in!');
      loadMainPage();
    } else {
      // show error
    }
  });
}

const loadMainPage = () => {
  console.log('loading main page');
  $('#login-div').fadeOut('slow');
  $('#main-page-div').fadeIn('slow');

  let query = `{
    posts (
      where: {category: {_eq: ${user.category}}},
      order_by: time_des
    ) {

    }
  }`

  // request(api, query).then(data => {
  // });
}

const loadByNearby = () => {

}

const loadByTrending = () => {

}

const loadByRecent = () => {

}

const postNotif = () => {

}
