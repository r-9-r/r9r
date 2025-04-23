// CONFIG
const COMMENT_API_URL = "https://script.google.com/macros/s/AKfycbw7WY-kShuayYLKAv0NfHfjXS4K3_ohZg2pme-ZLit58qGldTYpZ1G1kOCiKoYnjr97/exec";

// 1. Detect Text Selection
let selectedText = "";
document.addEventListener("mouseup", () => {
  const selection = window.getSelection().toString().trim();
  if (selection.length > 0) {
    selectedText = selection;
    showCommentBox(selection);
  }
});

// 2. Show Comment Input
function showCommentBox(text) {
  removeExistingBox();

  const box = document.createElement("div");
  box.id = "comment-box";
  box.innerHTML = `
    <div style="background:#111; color:white; border:1px solid #39ff14; padding:12px; position:fixed; top:20%; left:50%; transform:translateX(-50%); z-index:9999; max-width:400px;">
      <p><strong>comment on:</strong> "${text.slice(0, 80)}${text.length > 80 ? '…' : ''}"</p>
      <textarea id="comment-text" placeholder="your thoughts..." style="width:100%; margin-top:8px;"></textarea>
      <input id="comment-email" type="email" placeholder="optional email" style="width:100%; margin-top:6px;">
      <button onclick="submitComment()" style="margin-top:10px; background:#39ff14; color:black; padding:6px 10px; cursor:pointer;">submit</button>
      <button onclick="removeExistingBox()" style="margin-left:10px;">cancel</button>
    </div>
  `;
  document.body.appendChild(box);
}

function removeExistingBox() {
  const existing = document.getElementById("comment-box");
  if (existing) existing.remove();
}

// 3. Submit Comment to Google Sheets
function submitComment() {
  const comment = document.getElementById("comment-text").value;
  const email = document.getElementById("comment-email").value;
  if (!comment.trim()) return alert("Please enter a comment.");

  fetch(COMMENT_API_URL, {
    method: "POST",
    body: JSON.stringify({
      page: window.location.href,
      selection: selectedText,
      comment,
      email
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    alert("comment submitted!");
    removeExistingBox();
    location.reload();
  }).catch(() => alert("error sending comment"));
}

// 4. Load Comments on Page Load
window.onload = () => {
  fetch(COMMENT_API_URL)
    .then(res => res.json())
    .then(data => {
      const comments = data.filter(c => c.page === window.location.href);
      comments.forEach(c => {
        const block = document.createElement("div");
        block.style = "border-left:2px solid #39ff14; padding-left:10px; margin:20px 0; background:#111; color:#ccc;";
        block.innerHTML = `<p><strong>${c.selection}</strong></p><p>${c.comment}</p><p style="font-size:12px; color:#888;">${c.email || 'anonymous'}</p>`;
        document.body.appendChild(block);
      });
    });
};
