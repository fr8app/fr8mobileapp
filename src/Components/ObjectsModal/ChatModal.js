function getChatData(data) {
  var ChatArray = [];
  for (let i in data) {
    var object = this.getChatObject(data[i]);
    ChatArray.push(object);
  }
  return ChatArray;
}

function getChatObject(data) {
  return {
    message: data.message,
    other_user_detail: this.other_user_detail(data.other_user_detail),
    receiver_id: data.receiver_id,
    sender_id: data.sender_id,
    chat_id: data.chat_id,
    created_at: data.created_at,
    unread: data.unread,
  };
}

function other_user_detail(data) {
  return {
    id: data._id,
    image: data.profile,
    name: data.userName,
    userName:data.userName
  };
}

module.exports = { getChatData, getChatObject, other_user_detail };
