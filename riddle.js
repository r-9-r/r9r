function checkRiddle() {
  const answer = document.getElementById("riddle-answer").value.trim().toLowerCase();
  const feedback = document.getElementById("feedback");

  if (answer === "echo") {
    document.getElementById("riddle-gate").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } else {
    feedback.textContent = "Wrong answer. Try again.";
  }
}

// 🔥 Add this to trigger checkRiddle() on Enter
document.getElementById("riddle-answer").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    checkRiddle();
  }
});
