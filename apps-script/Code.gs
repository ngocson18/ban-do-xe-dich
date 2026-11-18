const OWNER_PIN = "182001";
const COMMENT_SHEET = "Comments"; // sheet riêng, tự tạo nếu chưa có
const REACTION_SHEET = "Reactions"; // destId | emoji | clientId | time
const ALLOWED_REACTIONS = ["❤️", "😂", "😮"];

function getReactionSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(REACTION_SHEET);
  if (!sh) {
    sh = ss.insertSheet(REACTION_SHEET);
    sh.appendRow(["destId", "emoji", "clientId", "time"]);
  }
  return sh;
}

function getCommentSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(COMMENT_SHEET);
  if (!sh) {
    sh = ss.insertSheet(COMMENT_SHEET);
    sh.appendRow(["id", "destId", "name", "text", "time"]);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  let data = [];
  try { data = JSON.parse(sheet.getRange("A1").getValue() || "[]"); } catch (err) { data = []; }

  // Gộp bình luận từ sheet "Comments" vào từng địa điểm
  const rows = getCommentSheet_().getDataRange().getValues();
  const byDest = {};
  for (let i = 1; i < rows.length; i++) {
    const [id, destId, name, text, time] = rows[i];
    if (!id || !destId) continue;
    (byDest[destId] = byDest[destId] || []).push({ id: String(id), name: String(name), text: String(text), time: String(time) });
  }
  // Gộp reaction: { emoji: [clientId, ...] }
  const reactRows = getReactionSheet_().getDataRange().getValues();
  const reactByDest = {};
  for (let i = 1; i < reactRows.length; i++) {
    const [destId, emoji, clientId] = reactRows[i];
    if (!destId || !emoji) continue;
    const m = (reactByDest[destId] = reactByDest[destId] || {});
    (m[emoji] = m[emoji] || []).push(String(clientId));
  }
  data.forEach(d => {
    d.reactions = reactByDest[d.id] || {};
    d.comments = (byDest[d.id] || []).sort((a, b) => new Date(a.time) - new Date(b.time));
  });
  return json_(data);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = e.parameter || {};
    const action = p.action || "save";

    // 1) Khách gửi bình luận (không cần PIN)
    if (action === "comment") {
      const destId = String(p.destId || "").slice(0, 100);
      const name = String(p.name || "").trim().slice(0, 40);
      const text = String(p.text || "").trim().slice(0, 500);
      if (!destId || !name || !text) return json_({ status: "error", message: "Thiếu dữ liệu" });
      const id = String(p.id || ("c-" + Date.now()));
      const time = String(p.time || new Date().toISOString());
      getCommentSheet_().appendRow([id, destId, name, text, time]);
      return json_({ status: "success" });
    }

    // 1b) Khách thả/gỡ reaction (bấm lần nữa để gỡ)
    if (action === "react") {
      const destId = String(p.destId || "").slice(0, 100);
      const emoji = String(p.emoji || "");
      const clientId = String(p.clientId || "").slice(0, 60);
      if (!destId || !clientId || ALLOWED_REACTIONS.indexOf(emoji) < 0) return json_({ status: "error", message: "Dữ liệu không hợp lệ" });
      const sh = getReactionSheet_();
      const rows = sh.getDataRange().getValues();
      let removed = false;
      for (let i = rows.length - 1; i >= 1; i--) {
        if (String(rows[i][0]) === destId && String(rows[i][1]) === emoji && String(rows[i][2]) === clientId) {
          sh.deleteRow(i + 1); removed = true;
        }
      }
      if (!removed) sh.appendRow([destId, emoji, clientId, new Date().toISOString()]);
      return json_({ status: "success", toggled: removed ? "off" : "on" });
    }

    // 2) Các thao tác còn lại cần PIN chủ nhân
    const pin = p.pin || (e.postData ? JSON.parse(e.postData.contents).pin : "");
    if (pin !== OWNER_PIN) return json_({ status: "error", message: "Sai PIN" });

    if (action === "deleteComment") {
      const sh = getCommentSheet_();
      const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
      for (let i = ids.length - 1; i >= 1; i--) {
        if (String(ids[i][0]) === String(p.id)) sh.deleteRow(i + 1);
      }
      return json_({ status: "success" });
    }

    // 3) Lưu toàn bộ dữ liệu địa điểm (bỏ comments vì đã lưu ở sheet riêng)
    const rawData = p.data || (e.postData ? JSON.stringify(JSON.parse(e.postData.contents).data) : "");
    let arr = JSON.parse(rawData);
    arr.forEach(d => { delete d.comments; delete d.reactions; });
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getRange("A1").setValue(JSON.stringify(arr));
    return json_({ status: "success" });
  } catch (err) {
    return json_({ status: "error", message: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (x) { }
  }
}
