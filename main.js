const API_URL = "http://localhost:3001";

document.getElementById("uploadForm").onsubmit = async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("gameZip");
  if (!fileInput.files.length) return;
  const formData = new FormData();
  formData.append('game', fileInput.files[0]);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });
  if (res.ok) {
    alert('Game uploaded!');
    fileInput.value = '';
    loadGames();
  } else {
    alert('Failed to upload game');
  }
};

async function loadGames() {
  const res = await fetch(`${API_URL}/api/games`);
  const games = await res.json();
  const list = document.getElementById("gamesList");
  list.innerHTML = '';
  games.forEach((game, i) => {
    const li = document.createElement('li');
    li.style.animationDelay = `${0.07 * i}s`; // Stagger fadeUp
    li.innerHTML = `<button onclick="playGame('${game}')">${game}</button>`;
    list.appendChild(li);
  });
}

window.playGame = function(gameName) {
  const frame = document.getElementById('gameFrame');
  frame.src = `${API_URL}/games/${gameName}`;
  frame.style.display = 'block';
  frame.classList.remove('active');
  setTimeout(() => frame.classList.add('active'), 150); // animate border glow
};

window.onload = loadGames;
