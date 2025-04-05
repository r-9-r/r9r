document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("riddle-answer");
  const button = document.getElementById("submit-button");

  // Function to check the riddle answer
  function checkRiddle() {
    const answer = input.value.trim().toLowerCase();
    const feedback = document.getElementById("feedback");

    if (answer === "echo") {
      document.getElementById("riddle-gate").style.display = "none";
      document.getElementById("main-content").style.display = "block";
    } else {
      feedback.textContent = "Wrong answer. Try again.";
    }
  }

  // Listen for button click
  button.addEventListener("click", checkRiddle);

  // Listen for Enter key press
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      checkRiddle();
    }
  });

  // Auto-focus the input field on page load
  input.focus();
});

// Load blog posts from posts.json
fetch('posts.json')
  .then(response => response.json())
  .then(posts => {
    const container = document.getElementById("blog-posts");
    posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("blog-post");

      postDiv.innerHTML = `
        <h3 class="neon">${post.title}</h3>
        <p><em>${post.date}</em></p>
        <p>${post.body}</p>
        <hr>
      `;

      container.appendChild(postDiv);
    });
  });
