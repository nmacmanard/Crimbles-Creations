Parse.initialize("Dk7wZnUjEs8i4RmwdZ0YP13DQRU6gShDa3NauSC9", "hpF2KqfxESRdHaEeBkZdYEFGdBLZP1yvvD2PA3IQ");

$(".form-login").submit(function() {
  var formData = $(this).serializeArray();

  var username = formData[0].value;
  var password = formData[1].value;

  console.log("Logging in with username: " + username + " and password: " + password);

  attemptLogin(username, password);

  return false;
})

function attemptSignUp(username, password, email) {
  var user = new Parse.User();

  user.set("username", username);
  user.set("password", password);
  user.set("email", email);

  user.signUp(null, {
    success: function(user) {
      console.log("Successfully signed up user");
    },
    error: function(error) {
      console.log("Something went wrong");
    }
  });
}

function attemptLogin(username, password) {
  Parse.User.logIn(username, password, {
    success: function() {
      redirectPage("../activeSession/");
    },
    error: function() {
      swal("Oh no!", "Your username or password was incorrect", "error");
    }
  })
}

function redirectPage(url) {
  window.location.replace(url);
}

function checkForSession(requiredState) {
  if (requiredState == true) {
    if (Parse.User.current()) {
      console.log("Logged in. Continuing...");
    } else {
      redirectPage("/login/");
    }
  } else if (requiredState == false) {
    if (Parse.User.current()) {
      redirectPage("/activeSession/");
    } else {
      console.log("No current session. Continuing...");
    }
  }
}
