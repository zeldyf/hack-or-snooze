"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  putStoriesOnPage();
  $favoriteStories.hide();
  $myStories.hide();
  $storyForm.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $allStoriesList.hide();
  $loginForm.show();
  $signupForm.show();
  $body.addClass("gradient")
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt) {
  $storyForm.is(":visible") ? $storyForm.hide() : $storyForm.show();
  $allStoriesList.show();
  $favoriteStories.hide();
  $myStories.hide();
}

$navSubmit.on("click", navSubmitClick);

