Parse.initialize("Dk7wZnUjEs8i4RmwdZ0YP13DQRU6gShDa3NauSC9", "hpF2KqfxESRdHaEeBkZdYEFGdBLZP1yvvD2PA3IQ");

var savedId = "";

$(document).ready(function() {
  if (Parse.User.current()) {
    $("#logInOut").html("<li onclick='attemptLogOut()'>Log Out</li>");
    $("#logInOutNav").html("<li onclick='attemptLogOut()'>Log Out</li>");
    $("#uploadId").html("<a href='activeSession/'>Upload Recipe</a>");
  }
})

$("#main-login-form").submit(function() {
  var formData = $(this).serializeArray();

  var username = formData[0].value;
  var password = formData[1].value;

  console.log("Logging in with username: " + username + " and password: " + password);

  attemptLogin(username, password);

  return false;
});

$('.recipe-add').submit(function(event) {
  event.preventDefault();

  var formData = $(this).serializeArray();

  var name = formData[0].value;
  var author = formData[1].value;
  var desc = formData[2].value;
  var imageUrl = formData[3].value;
  var content = tinymce.activeEditor.getContent();

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
      swal("Congratulations!", "We've signed you up and logged you in! We'll take you to the homepage in about 5 seconds...", "success")

      setTimeout(function() {
        redirectPage("../index.html");
      }, 5000);
    },
    error: function(error) {
      swal("Oh no!", "We couldn't sign you up. Try a different username or email.", "error");
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
  window.location = url;
}

function checkForSession(requiredState) {
  if (requiredState == true) {
    if (Parse.User.current()) {
      console.log("Logged in. Continuing...");
    } else {
      redirectPage("../login/");
    }
  } else if (requiredState == false) {
    if (Parse.User.current()) {
      redirectPage("../activeSession/");
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
  recipe.set("itemWidthInList", 1);

  recipe.save(null, {
    success: function() {
      swal("Hurray!", "Your recipe has been added to our collection. Thanks for your contribution!", "success");
    },
    error: function() {
      swal("Oh no!", "Something went wrong on our end, try again later!", "error");
    }
  });
}

function attemptLogOut() {
  Parse.User.logOut();

  redirectPage("/");
}

function listRecipes(order, searchTerm) {
  var Recipe = Parse.Object.extend("Recipe");
  var query = new Parse.Query(Recipe);

  switch(order) {
    case "top":
      query.descending("rating");
      break;
    case "recent":
      query.descending("createdAt");
      break;
    case "none":
      break;
  }

  if (searchTerm == null) {
    console.log("No search term specified. Continuing...");
  } else {
    query.contains("name", searchTerm);
  }

  query.find({
    success: function(results) {
      console.log("Successfully retrived recipes.");

      output = "";

      for (var i = 0; i < results.length; i++) {
        var name = results[i].get("name");
        var description = results[i].get("description");
        var imageUrl = results[i].get("imageUrl");
        var id = results[i].id;
        var itemWidthInList = results[i].get("itemWidthInList");

        output += "<div onclick='setSingleCookie(&quot " + id + " &quot)' class='col-md-" + (itemWidthInList * 3) + "'>";
        output += "<span class='grid-image'><img src='" + imageUrl + "' alt='" + description + "' /></span>";
        output += "<span class='grid-info'><h4>" + description + "</h4></span>";
        output += "</div>";
      }

      $("#main-repeat-grid").html(output);
    },
    error: function() {
      console.log("An error occurred when retieving recipes.");
    }
  });
}

$('#input-nolog').keypress(function(e) {
  if (e.which == 13) {
    var value = $(this).val();
    listRecipes("none", value);
  }
})

function setSingleCookie(contentId) {
  var processedKey = stripSpaces(contentId);

  document.cookie="itemId=" + processedKey + "; path=/";
  console.log("Cookie set with value " + processedKey);

  redirectPage("single.html");
}

function getSingleCookie() {
  var cookies = document.cookie;
  var cookieArray = cookies.split(";");

  for (var i = 0; i < cookieArray.length; i++) {
    var processor = cookieArray[i].split("=");

    if (processor[0] == "itemId" || processor[0] == " itemId") {
      savedId = processor[1];
    }
  }
}

function stripSpaces(input) {
  var processor = input.split("");

  for(var i = 0; i < processor.length; i++) {
    if (processor[i] == " ") {
      processor.splice(i, 1);
      i--;
    }
  }

  var result = processor.join("");

  return result;
}

function getSingleRecipe() {
  getSingleCookie();

  var Recipe = Parse.Object.extend("Recipe");
  var query = new Parse.Query(Recipe);

  console.log(savedId);

  query.equalTo("objectId", savedId);

  query.find({
    success: function(results) {

      var name = results[0].get("name");
      var author = results[0].get("author");
      var description = results[0].get("description");
      var imageUrl = results[0].get("imageUrl");
      var content = results[0].get("content");


      $("#singleName").text(name);
      $("#singleTitle").text(description);
      $("#mainSingleTitle").text(name + ", Written by " + author);
      $("#singleContent").html(content);
      $("#singleImage").html('<img src="' + imageUrl + '" alt="' + description + '" />');
      $("#main-header").css("background-image", "url(" + imageUrl + ")");
    }
  });
}

$("#main-signup-form").submit(function(event) {
  event.preventDefault();

  var formData = $(this).serializeArray();

  var username = formData[0].value;
  var password = formData[1].value;
  var email = formData[2].value;

  attemptSignUp(username, password, email);
})
