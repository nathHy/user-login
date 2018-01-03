$(document).ready(function() {
  request('/api/user', 'get')
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(data => {
      if (data && data.username) {
        displayMessage(`Welcome back ${data.username}`)
        displayGrid();
      }
    })

  $('#loginForm').submit(function(e) {
    e.preventDefault();
    return false;
  });
  $('#login').click(function(e) {
    e.preventDefault();
    clearMessage();
    login();
  });
  $('#create').click(function(e) {
    e.preventDefault();
    clearMessage();
    create();
  });

  $('#logout').click(function(e) {
    e.preventDefault();
    clearMessage();
    logout();
  })

  function login() {
    let data = getFormData()
    if (!data) return false
    request('/login', 'post', data)
      .then((res) => {
        if (res.status === 200) {
          displayGrid()
        } else {
          displayMessage("Invalid log in credentails")
        }
      })
      .catch((err) => {
        console.error(err)
        displayMessage('Failed to log in. Please try again');
      })
  }

  function create() {
    let data = getFormData()
    if (!data) return false;
    request('/api/users', 'post', data)
      .then(res => {
        if (res.status === 200) {
          displayGrid();
        } else if (res.status === 400) {
          displayMessage("Invalid user");
        } else if (res.status === 401) {
          displayMessage("Log in first");
        }
      })
      .catch(console.error)
  }

  function logout() {
    hide('#information')
    request('/logout', 'post', null)
      .then(res => {
        if (res.status === 204) {
          hide('#information')
          $('tr.dataRow').remove();
          displayMessage("Successfully logged out")
        }
      })
      .catch(err => displayMessage('Failed to logout'))
  }

  function getFormData() {
    let username = $('#username').val();
    let password = $('#password').val();
    if (!username || !password) return false;
    return { username, password }
  }

  function displayMessage(msg) {
    clearMessage();
    $('#message').text(msg);
  }

  function clearMessage() {
    $('#message').text('');
  }

  function displayGrid() {

    fetchUsers()
      .then(usersData => {
        if (!usersData) {
          console.log("No users data found");
          return false;
        }
        let table = $('#userList')
        $('tr.dataRow').remove();
        usersData.forEach(user => {
          let tr = `<tr class='dataRow' id='user${user.id}'>`;
          tr += `<td>${user.id}</td>`;
          tr += `<td>${user.username}</td>`;
          tr += `<td>${user.createdAt}</td>`;
          tr += `<td><button class='deleteButton' data-user-id=${user.id}>X</button></td>`;
          tr += `</tr>`;
          table.append(tr);
        })

        $('.deleteButton').click(function(e) {
          deleteUser(e.target.dataset['userId']);
        })
        show('#userList')
      })
      .catch(console.log)
  }

  function fetchUsers() {
    return request('/api/users', 'get', null).then(res => res.json());
  }

  function deleteUser(id) {
    console.log("Deleting user ", id)
    request(`/api/users/${id}`, 'delete', null)
      .then(res => {
        if (res.status === 204) {
          $(`#user${id}`).remove();
        }
      });
  }

  function request(url, method, data) {
    let opts = {
      method,
      credentials: 'same-origin'
    }
    if (data) {
      if (typeof data === 'object') {
        opts.headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        opts.body = JSON.stringify(data);
      }
    }
    return fetch(url, opts);
  }

  function show(selector) {
    $(selector).css('visibility', 'visible')
  }

  function hide(selector) {
    $(selector).css('visibility', 'hidden')
  }
});