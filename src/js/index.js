const fs = require('fs');
const electron = require('electron');

// get the graphql module
const { request } = require('graphql-request');
const api = 'https://kjsce-test.herokuapp.com/v1alpha1/graphql';

const $ = require('jquery');

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
    let user = data.admin[0];
    // console.log(user);

    if (!user) {
      return;
    }

    if (password === user.password) {
      console.log('user logged in!');
      // load main view
    } else {
      // show error
    }
  });
}
