Parse.initialize("Dk7wZnUjEs8i4RmwdZ0YP13DQRU6gShDa3NauSC9", "hpF2KqfxESRdHaEeBkZdYEFGdBLZP1yvvD2PA3IQ");

$(".form-login").submit(function() {
  var formData = $(this).serializeArray();

  var username = formData[0].value;
  var password = formData[1].value;

  console.log("Logging in with username: " + username + " and password: " + password);

  attemptLogin(username, password);

  return false;
});

$('.recipe-add').submit(function() {
  var formData = $(this).serializeArray();

  var name = formData[0].value;
  var author = formData[1].value;
  var desc = formData[2].value;
  var imageUrl = formData[3].value;
  var content = formData[4].value;

  attemptRecipeUpload(name, author, desc, imageUrl, content);

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

function attemptRecipeUpload(name, author, desc, imageUrl, content) {
  var Recipe = Parse.Object.extend("Recipe");
  var recipe = new Recipe();

  recipe.set("name", name);
  recipe.set("rating", Math.floor(Math.random() * 5));
  recipe.set("author", author);
  recipe.set("description", desc);
  recipe.set("imageUrl", imageUrl);
  recipe.set("content", content);

  recipe.save(null, {
    success: function() {
      swal("Hurray!", "Your recipe has been added to our collection. Thanks for your contribution!", "success");
    },
    error: function() {
      swal("Oh no!", "Something went wrong on our end, try again later!", "error");
    }
  });
}
