"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  $body.removeClass("gradient");
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn = false) {
  const isLoggedIn = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
  <li id="${story.storyId}">
    ${deleteBtn === true ? getDeleteHTML() : ""}
    ${isLoggedIn ? getStarHTML(currentUser, story) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);

}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function getStarHTML(user, story) {
  let isFavorite = "";

  user.favorites.length > 0
    ? (isFavorite = user.favorites.some((val) => val.storyId === story.storyId))
    : (isFavorite = false);

  const starFill = isFavorite ? "fas" : "far";
  return `<span class="star"><i class="${starFill} fa-star"></i></span>`;
}


function getDeleteHTML() {
  return `<span class="delete">
    <i class="fa-solid fa-trash-can"></i>
    </span>`;
}

async function addUserStory(evt) {
  evt.preventDefault();
  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#url-input").val();
  const storyData = { title, author, url };

  const story = await storyList.addStory(currentUser, storyData);

  addMyStoriesToUI(currentUser.ownStories);
  putStoriesOnPage();

  $storyForm.hide();
  $(":input").val("");
}


function addMyStoriesToUI(myStories) {
  $myStories.empty();
  
  if (currentUser.ownStories.length === 0) {
    $myStories.append($("<h5>No stories added by user yet!<h5>"));
  }
  
  for (let story of myStories) {
    const newLI = generateStoryMarkup(story, true);
    $myStories.append(newLI);
  }
}

$($storyForm).on("submit", addUserStory);


async function deleteStory(evt) {
  const id = getId(evt);
  const idx = currentUser.ownStories.findIndex((story) => story.storyId === id);
  const storyListIdx = storyList.stories.findIndex(story => story.storyId === id);

  const response = await axios({
    method: "DELETE",
    url: `${BASE_URL}/stories/${id}`,
    data: {
      token: currentUser.loginToken,
    },
  });

  currentUser.ownStories.splice(idx);
  storyList.stories.splice(storyListIdx, 1)
  addMyStoriesToUI(currentUser.ownStories);
  // putStoriesOnPage();
}

$("#my-stories").on("click", ".fa-trash-can", deleteStory);

function showMyStories() {
  $allStoriesList.hide();
  $favoriteStories.hide();
  addMyStoriesToUI(currentUser.ownStories);
  $myStories.show();
}

$navMyStories.on("click", showMyStories);
