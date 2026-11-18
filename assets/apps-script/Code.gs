const DEFAULT_USER_ID = "default";
const DEFAULT_DISPLAY_NAME = "Ngọc Sơn & Huyền Thương";
const DEFAULT_SUBTITLE = "Cùng nhau vẽ kín bản đồ Việt Nam";
const DEFAULT_PIN = "182001";

const USERS_SHEET = "Users";
const COMMENT_SHEET = "Comments";
const REACTION_SHEET = "Reactions";
const ALLOWED_REACTIONS = ["❤️", "😂", "😮"];

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function hashPin_(pin) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "nhat-ky-v1:" + String(pin || ""));
  return bytes.map(b => ("0" + ((b + 256) % 256).toString(16)).slice(-2)).join("");
}

function slugify_(str) {
  const map = {
    "à":"a","á":"a","ạ":"a","ả":"a","ã":"a","â":"a","ầ":"a","ấ":"a","ậ":"a","ẩ":"a","ẫ":"a","ă":"a","ằ":"a","ắ":"a","ặ":"a","ẳ":"a","ẵ":"a",
    "è":"e","é":"e","ẹ":"e","ẻ":"e","ẽ":"e","ê":"e","ề":"e","ế":"e","ệ":"e","ể":"e","ễ":"e",
    "ì":"i","í":"i","ị":"i","ỉ":"i","ĩ":"i",
    "ò":"o","ó":"o","ọ":"o","ỏ":"o","õ":"o","ô":"o","ồ":"o","ố":"o","ộ":"o","ổ":"o","ỗ":"o","ơ":"o","ờ":"o","ớ":"o","ợ":"o","ở":"o","ỡ":"o",
    "ù":"u","ú":"u","ụ":"u","ủ":"u","ũ":"u","ư":"u","ừ":"u","ứ":"u","ự":"u","ử":"u","ữ":"u",
    "ỳ":"y","ý":"y","ỵ":"y","ỷ":"y","ỹ":"y","đ":"d"
  };
  let s = String(str || "").toLowerCase().split("").map(c => map[c] || c).join("");
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  return s || "user";
}

function getUsersSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(USERS_SHEET);
  if (!sh) {
    sh = ss.insertSheet(USERS_SHEET);
    sh.appendRow(["userId", "displayName", "mode", "subtitle", "pinHash", "dataJson", "createdAt"]);
    // Tự động chuyển dữ liệu hiện có ở Sheet đầu tiên vào dòng default
    const legacyRaw = String(ss.getSheets()[0].getRange("A1").getValue() || "[]");
    sh.appendRow([
      DEFAULT_USER_ID,
      DEFAULT_DISPLAY_NAME,
      "couple",
      DEFAULT_SUBTITLE,
      hashPin_(DEFAULT_PIN),
      legacyRaw,
      new Date().toISOString()
    ]);
  }
  return sh;
}

function getCommentSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(COMMENT_SHEET);
  if (!sh) {
    sh = ss.insertSheet(COMMENT_SHEET);
    sh.appendRow(["id", "destId", "name", "text", "time", "userId"]);
  } else if (sh.getLastColumn() < 6 || String(sh.getRange(1, 6).getValue()) !== "userId") {
    sh.getRange(1, 6).setValue("userId");
  }
  return sh;
}

function getReactionSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(REACTION_SHEET);
  if (!sh) {
    sh = ss.insertSheet(REACTION_SHEET);
    sh.appendRow(["destId", "emoji", "clientId", "time", "userId"]);
  } else if (sh.getLastColumn() < 5 || String(sh.getRange(1, 5).getValue()) !== "userId") {
    sh.getRange(1, 5).setValue("userId");
  }
  return sh;
}

function findUserRow_(sh, userId) {
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(userId)) {
      return {
        rowIndex: i + 1,
        userId: String(rows[i][0]),
        displayName: String(rows[i][1] || ""),
        mode: String(rows[i][2] || "solo"),
        subtitle: String(rows[i][3] || ""),
        pinHash: String(rows[i][4] || ""),
        dataJson: String(rows[i][5] || "[]"),
        createdAt: String(rows[i][6] || "")
      };
    }
  }
  return null;
}

function listUsersPublic_(sh) {
  const rows = sh.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < rows.length; i++) {
    const uid = String(rows[i][0] || "");
    if (!uid) continue;
    let placesCount = 0;
    try {
      const arr = JSON.parse(String(rows[i][5] || "[]"));
      if (Array.isArray(arr)) placesCount = arr.length;
    } catch (e) { }
    list.push({
      id: uid,
      name: String(rows[i][1] || uid),
      mode: String(rows[i][2] || "solo"),
      subtitle: String(rows[i][3] || ""),
      placesCount: placesCount,
      createdAt: String(rows[i][6] || "")
    });
  }
  return list;
}

function parsePayload_(e) {
  const p = Object.assign({}, (e && e.parameter) || {});
  if (e && e.postData && e.postData.contents) {
    const raw = String(e.postData.contents).trim();
    if (raw.startsWith("{")) {
      try {
        const obj = JSON.parse(raw);
        Object.keys(obj).forEach(k => { p[k] = obj[k]; });
      } catch (err) { }
    }
  }
  return p;
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = p.action || "read";
  const usersSh = getUsersSheet_();

  if (action === "users") {
    return json_({ status: "success", users: listUsersPublic_(usersSh) });
  }

  const userId = String(p.user || DEFAULT_USER_ID);
  const userRow = findUserRow_(usersSh, userId) || findUserRow_(usersSh, DEFAULT_USER_ID);
  const resolvedId = userRow ? userRow.userId : DEFAULT_USER_ID;

  let data = [];
  try {
    data = JSON.parse((userRow && userRow.dataJson) || "[]");
    if (!Array.isArray(data)) data = [];
  } catch (err) {
    data = [];
  }

  // Gộp bình luận theo userId (dòng cũ chưa có cột userId mặc định thuộc default)
  const cmtRows = getCommentSheet_().getDataRange().getValues();
  const cmtByDest = {};
  for (let i = 1; i < cmtRows.length; i++) {
    const [id, destId, name, text, time, rowUid] = cmtRows[i];
    const uid = String(rowUid || DEFAULT_USER_ID);
    if (!id || !destId || uid !== resolvedId) continue;
    (cmtByDest[destId] = cmtByDest[destId] || []).push({
      id: String(id), name: String(name), text: String(text), time: String(time)
    });
  }

  // Gộp reaction theo userId
  const reactRows = getReactionSheet_().getDataRange().getValues();
  const reactByDest = {};
  for (let i = 1; i < reactRows.length; i++) {
    const [destId, emoji, clientId, , rowUid] = reactRows[i];
    const uid = String(rowUid || DEFAULT_USER_ID);
    if (!destId || !emoji || uid !== resolvedId) continue;
    const m = (reactByDest[destId] = reactByDest[destId] || {});
    (m[emoji] = m[emoji] || []).push(String(clientId));
  }

  data.forEach(d => {
    d.reactions = reactByDest[d.id] || {};
    d.comments = (cmtByDest[d.id] || []).sort((a, b) => new Date(a.time) - new Date(b.time));
  });

  if (String(p.v) === "2") {
    return json_({
      status: "success",
      user: userRow ? { id: userRow.userId, name: userRow.displayName, mode: userRow.mode, subtitle: userRow.subtitle } : null,
      users: listUsersPublic_(usersSh),
      destinations: data
    });
  }
  return json_(data);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(12000);
    const p = parsePayload_(e);
    const action = String(p.action || "save");
    const usersSh = getUsersSheet_();

    // 1) Tạo nhật ký cá nhân mới ("Tạo của riêng tôi")
    if (action === "createUser") {
      const displayName = String(p.name || "").trim().slice(0, 40);
      const pin = String(p.pin || "").trim();
      const subtitle = String(p.subtitle || "").trim().slice(0, 70) || ("Nhật ký xê dịch của " + displayName);
      const mode = p.mode === "couple" ? "couple" : "solo";
      if (displayName.length < 2) return json_({ status: "error", message: "Tên cần ít nhất 2 ký tự." });
      if (pin.length < 4 || pin.length > 20) return json_({ status: "error", message: "Mã PIN cần từ 4 đến 20 ký tự." });

      const baseSlug = slugify_(displayName);
      let userId = baseSlug === DEFAULT_USER_ID ? baseSlug + "-1" : baseSlug;
      let suffix = 2;
      while (findUserRow_(usersSh, userId)) {
        userId = baseSlug + "-" + suffix;
        suffix++;
      }

      const now = new Date().toISOString();
      usersSh.appendRow([userId, displayName, mode, subtitle, hashPin_(pin), "[]", now]);
      return json_({
        status: "success",
        user: { id: userId, name: displayName, mode: mode, subtitle: subtitle, placesCount: 0, createdAt: now },
        users: listUsersPublic_(usersSh)
      });
    }

    const userId = String(p.user || DEFAULT_USER_ID);
    const userRow = findUserRow_(usersSh, userId);
    if (!userRow) return json_({ status: "error", message: "Không tìm thấy nhật ký này." });

    // 2) Xác thực PIN phía server (không lộ PIN ở frontend)
    if (action === "verifyPin") {
      const ok = hashPin_(p.pin) === userRow.pinHash;
      return ok
        ? json_({ status: "success" })
        : json_({ status: "error", message: "Mã PIN không chính xác!" });
    }

    // 3) Khách gửi bình luận (không cần PIN)
    if (action === "comment") {
      const destId = String(p.destId || "").slice(0, 100);
      const name = String(p.name || "").trim().slice(0, 40);
      const text = String(p.text || "").trim().slice(0, 500);
      if (!destId || !name || !text) return json_({ status: "error", message: "Thiếu dữ liệu" });
      const id = String(p.id || ("c-" + Date.now()));
      const time = String(p.time || new Date().toISOString());
      getCommentSheet_().appendRow([id, destId, name, text, time, userId]);
      return json_({ status: "success" });
    }

    // 4) Khách thả/gỡ reaction (không cần PIN)
    if (action === "react") {
      const destId = String(p.destId || "").slice(0, 100);
      const emoji = String(p.emoji || "");
      const clientId = String(p.clientId || "").slice(0, 60);
      if (!destId || !clientId || ALLOWED_REACTIONS.indexOf(emoji) < 0) {
        return json_({ status: "error", message: "Dữ liệu không hợp lệ" });
      }
      const sh = getReactionSheet_();
      const rows = sh.getDataRange().getValues();
      let removed = false;
      for (let i = rows.length - 1; i >= 1; i--) {
        const rowUid = String(rows[i][4] || DEFAULT_USER_ID);
        if (String(rows[i][0]) === destId && String(rows[i][1]) === emoji && String(rows[i][2]) === clientId && rowUid === userId) {
          sh.deleteRow(i + 1);
          removed = true;
        }
      }
      if (!removed) sh.appendRow([destId, emoji, clientId, new Date().toISOString(), userId]);
      return json_({ status: "success", toggled: removed ? "off" : "on" });
    }

    // 5) Các thao tác chỉnh sửa: bắt buộc đúng PIN của đúng userId
    if (hashPin_(p.pin) !== userRow.pinHash) {
      return json_({ status: "error", message: "Sai PIN" });
    }

    if (action === "deleteComment") {
      const sh = getCommentSheet_();
      const rows = sh.getDataRange().getValues();
      for (let i = rows.length - 1; i >= 1; i--) {
        const rowUid = String(rows[i][5] || DEFAULT_USER_ID);
        if (String(rows[i][0]) === String(p.id) && rowUid === userId) {
          sh.deleteRow(i + 1);
        }
      }
      return json_({ status: "success" });
    }

    // 6) Lưu dữ liệu địa điểm của userId
    const rawData = typeof p.data === "string" ? p.data : JSON.stringify(p.data || []);
    const arr = JSON.parse(rawData);
    if (!Array.isArray(arr)) return json_({ status: "error", message: "Dữ liệu không hợp lệ" });
    arr.forEach(d => { delete d.comments; delete d.reactions; });
    const serialized = JSON.stringify(arr);
    usersSh.getRange(userRow.rowIndex, 6).setValue(serialized);

    // Đồng bộ dự phòng về Sheet đầu tiên cho user mặc định
    if (userId === DEFAULT_USER_ID) {
      const firstSh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      if (firstSh && firstSh.getName() !== USERS_SHEET) {
        firstSh.getRange("A1").setValue(serialized);
      }
    }
    return json_({ status: "success" });
  } catch (err) {
    return json_({ status: "error", message: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (x) { }
  }
}
