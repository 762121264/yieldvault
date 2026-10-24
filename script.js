(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const STORAGE_KEY = "yieldvault-demo-v1";
  const money = (amount) => new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(Number(amount) || 0);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  let state = { goals: [], investments: [], activity: [] };
  let toastTimeout;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.goals) && Array.isArray(saved.investments) && Array.isArray(saved.activity)) state = saved;
  } catch (_) { /* Ignore invalid local demo data. */ }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { showToast("Browser storage is unavailable. Your changes may not persist."); }
  }
  function showToast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove("show"), 3200);
  }
  function logActivity(title, detail) {
    state.activity.unshift({ title, detail, at: new Date().toISOString() });
    state.activity = state.activity.slice(0, 20);
  }
  function render() {
    const total = state.goals.reduce((sum, goal) => sum + goal.saved, 0);
    $("#total-balance").textContent = money(total);
    $("#goal-count").textContent = state.goals.length;
    $("#investment-count").textContent = state.investments.length;

    $("#goal-list").innerHTML = state.goals.map((goal) => {
      const pct = goal.target > 0 ? Math.min(100, Math.round(goal.saved / goal.target * 100)) : 0;
      return '<article class="goal-card"><div class="goal-card-top"><span class="goal-icon">◎</span><span class="goal-tag">' + pct + '% complete</span></div><h3>' + escapeHTML(goal.name) + '</h3><p class="goal-amount">' + money(goal.saved) + '</p><span class="goal-target">of ' + money(goal.target) + '</span><div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div><div class="progress-label"><span>Progress</span><span>' + money(Math.max(0, goal.target - goal.saved)) + ' to go</span></div><div class="goal-actions"><button class="small-button" data-add-saved="' + goal.id + '">＋ Add saved amount</button><button class="small-button delete" data-delete-goal="' + goal.id + '">Remove</button></div></article>';
    }).join("");
    $("#goal-empty").hidden = state.goals.length > 0;

    $("#investment-list").innerHTML = state.investments.map((item) => {
      const change = item.value - item.cost;
      const pct = item.cost > 0 ? (change / item.cost) * 100 : 0;
      const cls = change > 0 ? "change-positive" : change < 0 ? "change-negative" : "";
      const sign = change > 0 ? "+" : "";
      return '<tr><td>' + escapeHTML(item.name) + '</td><td>' + money(item.cost) + '</td><td>' + money(item.value) + '</td><td class="' + cls + '">' + sign + money(change) + ' (' + (item.cost > 0 ? sign + pct.toFixed(1) + "%" : "—") + ')</td></tr>';
    }).join("");
    $("#investment-empty").hidden = state.investments.length > 0;

    $("#activity-list").innerHTML = state.activity.map((item) => {
      const date = new Date(item.at);
      return '<div class="activity-item"><span class="activity-icon">↻</span><div class="activity-text"><strong>' + escapeHTML(item.title) + '</strong><span>' + escapeHTML(item.detail) + '</span></div><span class="activity-time">' + (Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString()) + '</span></div>';
    }).join("");
    $("#activity-empty").hidden = state.activity.length > 0;
  }
  function openDialog(id) { const dialog = $("#" + id); if (dialog && typeof dialog.showModal === "function") dialog.showModal(); else showToast("Dialogs are not supported in this browser."); }
  function closeDialog(id) { const dialog = $("#" + id); if (dialog) dialog.close(); }

  $("#add-goal-open").addEventListener("click", () => openDialog("goal-dialog"));
  $("#empty-add-goal").addEventListener("click", () => openDialog("goal-dialog"));
  $("#add-investment-open").addEventListener("click", () => openDialog("investment-dialog"));
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => closeDialog(button.dataset.close)));

  $("#goal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#goal-name").value.trim();
    const target = Number($("#goal-target").value);
    const saved = Number($("#goal-saved").value);
    if (!name || !Number.isFinite(target) || target <= 0 || !Number.isFinite(saved) || saved < 0) return showToast("Enter a goal name and valid amounts.");
    const goal = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name, target: Math.round(target), saved: Math.round(saved) };
    state.goals.push(goal); logActivity("Savings goal created", name + " · " + money(target) + " target");
    persist(); render(); $("#goal-form").reset(); $("#goal-saved").value = "0"; closeDialog("goal-dialog"); showToast("Goal saved in this browser.");
  });
  $("#goal-list").addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-saved]");
    const remove = event.target.closest("[data-delete-goal]");
    if (add) {
      const goal = state.goals.find((item) => item.id === add.dataset.addSaved);
      if (!goal) return;
      const raw = prompt("Amount to record as saved (UGX). This only updates your tracker; it will not move money.");
      if (raw === null) return;
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0) return showToast("Enter a valid amount greater than zero.");
      goal.saved += Math.round(amount); logActivity("Savings amount recorded", goal.name + " · " + money(amount) + " (manual entry)");
      persist(); render(); showToast("Manual savings entry recorded.");
    }
    if (remove && confirm("Remove this savings goal from your local tracker?")) {
      const goal = state.goals.find((item) => item.id === remove.dataset.deleteGoal);
      state.goals = state.goals.filter((item) => item.id !== remove.dataset.deleteGoal);
      if (goal) logActivity("Savings goal removed", goal.name);
      persist(); render(); showToast("Goal removed.");
    }
  });
  $("#investment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#investment-name").value.trim();
    const cost = Number($("#investment-cost").value);
    const value = Number($("#investment-value").value);
    if (!name || !Number.isFinite(cost) || cost < 0 || !Number.isFinite(value) || value < 0) return showToast("Enter a name and valid investment values.");
    state.investments.unshift({ id: Date.now().toString(36), name, cost: Math.round(cost), value: Math.round(value) });
    logActivity("Investment watchlist updated", name + " · manual values");
    persist(); render(); $("#investment-form").reset(); closeDialog("investment-dialog"); showToast("Investment added to your watchlist.");
  });
  $("#clear-activity").addEventListener("click", () => {
    if (!state.activity.length) return showToast("There are no activity records to clear.");
    if (confirm("Clear all activity records? Goals and investments will remain.")) { state.activity = []; persist(); render(); showToast("Activity records cleared."); }
  });
  render();
})();