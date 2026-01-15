export function getUserId() {
  let id = localStorage.getItem("dramabox_uid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("dramabox_uid", id);
  }
  return id;
}
