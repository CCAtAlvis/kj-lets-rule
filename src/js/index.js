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
      location_lat
      location_log
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
      alert('Authentication error');
    }
  });
}

const loadMainPage = () => {
  console.log('loading main page');
  $('#login-div').fadeOut('slow');
  $('#main-page-div').fadeIn('slow');

  loadByRecent();
}

const loadByTrending = () => {
  $('.container').html('');

  let query = `query {
    post (
      limit: 20,
      where: {score: {_gte: 25}},
      order_by: score_desc
    ) {
      id
      title
      content
      content_type
      category
      ward
      location_lat
      location_long
      status
      status_note
      user_id
      user_name
      time
      score
      }
  }`;

  request(api, query).then(data=> {
    // console.log(data);
    data.post.forEach(e => {
      // console.log(e);

      var html = `
      <div class="card">
      <div class="image-box"></div>
    
      <div class="text">
        <div class="top">
          <div class="left">
            <div class="title">${e.title}</div>
            <div class="description">${e.description}</div>
          </div>
          
          <div class="right">
            <div class="upvotes">Score:${e.score}</div>
            <div class="time">Time stamp:${e.time}</div>
            <div class="location"> Location:${e.ward} </div>  
          </div>
        </div>

        <div class="middle">
          <div class="status-bar">
            <button type="button" class="btn btn-warning">Registered</button>
            <button type="button" class="btn btn-success" style="float:right;">Solved</button>
            <div class="progress-bar-my">
              <div class="progress progress-0"></div>
            </div>
          </div>
        </div>

        <!-- <div class="bottom">
          <div class="delete">
            <button type="button" class="btn btn-danger">Delete</button>
          </div>
        </div> -->

      </div>
    </div>`

    $('.container').append(html);
    });
  });
}

const loadByRecent = () => {
  $('.container').html('');

  let query = `query {
    post (
      where: {
        _or: [
          {category: {_eq: "${user.category}"}},
          {category: {_eq: "SOS"}},
        ]
      },
      order_by: time_desc
    ) {
      id
      title
      content
      content_type
      category
      ward
      location_lat
      location_long
      status
      status_note
      user_id
      user_name
      time
      score
      }
  }`

  request(api, query).then(data => {
    // console.log(data);
    data.post.forEach(e => {
      // console.log(e);

      var pro = "progress";
      switch (e.status) {
        case "0":
        pro += "-0";
        break;

        case "1":
        pro += "-33";
        break;

        case "2":
        pro += "-66";
        break;

        case "3":
        pro += "-100";
        break;
      }

      var html = `
      <div class="card">
      <div class="image-box"></div>
    
      <div class="text">
        <div class="top">
          <div class="left">
            <div class="title">${e.title}</div>
            <div class="description">${e.description}</div>
          </div>
          
          <div class="right">
            <div class="upvotes">Score:${e.score}</div>
            <div class="time">Time stamp:${e.time}</div>
            <div class="location"> Location:${e.ward} </div>  
          </div>
        </div>

        <div class="middle">
          <div class="status-bar">
            <button type="button" class="btn btn-warning">Registered</button>
            <button type="button" class="btn btn-success" style="float:right;">Solved</button>
            <div class="progress-bar-my">
              <div class="progress ${pro}"></div>
            </div>
          </div>
        </div>

        <!-- <div class="bottom">
          <div class="delete">
            <button type="button" class="btn btn-danger">Delete</button>
          </div>
        </div> -->

      </div>
    </div>`

    $('.container').append(html);
    });
  });
}


const createNewPost = (e) => {
  e.preventDefault();
  title = $("#title").val();
  content = $("#content").val();
  category = $('#category').val();

  let query = `mutation {
    insert_post (
      objects: [
        {
          title : "${title}",
          content : "${content}",
          content_type : "text",
          ward : "${user.ward}",
          category : "${category}",
          location_lat : ${user.location_lat},
          location_long : ${user.location_log},
          user_name : "${user.display_name}",
          user_id : 0,
          score: 30,
          status: "3"
        }
      ]
    ) {
      affected_rows
    }
  }`

  request(api, query).then(data => {
    console.log(data);
  })
}


const create = () => {
  var html = `<div class="container"><center><br><br><br><br><br><form onsubmit="createNewPost(event)">
  <input type="text" id="title" placeholder="Title"><br>
  <input type="text" id="content" placeholder="Content"><br>
  <select id="category">
    <option value="SOS">Emergency services</option>
    <option value="electricity">electricity</option>
    <option value="education">education</option>
    <option value="water supply">water supply</option>
    <option value="infrastructure">infrastructure</option>
  </select><br>

  <input type="submit" value="Create post">
</form></center></div>`;

  $('.container').html(html);
}

$('#create').click(function(event) {
  console.log(event);
  $('#create').addClass('active').siblings().removeClass('active');
  create();
});

$('#recent').click(function(event) {
  console.log(event);
  $('#recent').addClass('active').siblings().removeClass('active');
  loadByRecent();
});

$('#trending').click(function(event) {
  console.log(event);
  $('#trending').addClass('active').siblings().removeClass('active');
  loadByTrending();
});
