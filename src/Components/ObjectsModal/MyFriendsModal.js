import DataManager from '../DataManager'
function getFriendsData(data) {
  var friendsArray = [];
  for (let i in data) {
    var object = this.getFriendObject(data[i]);
    friendsArray.push(object);
  }
  return friendsArray;
}

function getFriendObject(data) {
  return {
    id: data.name,
    request_status: data.phone_number,
  };
}

function friendInfo(data) {
  return {
    id: data.id,
    image: data.image,
    name: data.name,
    user_type: data.user_type,
  };
}

function getFriendsSection(data) {
  let array_final = [];
  let my_frnd_object = {
    title: "Friends",
    data: data.friends.friend_list.length > 0 ? myFriends(data.friends.friend_list) : []
  };
  let contact_object = {
    title: "Contacts",
    data: data.friends?data.friends.contacts.length > 0 ? myContacts(data.friends.contacts) : []:[]
  };
  array_final.push(my_frnd_object);
  array_final.push(contact_object);

  return array_final;
}

//ARr of Contacts
function myContacts(data) {
  let frnds = [];
  for (let i in data) {
    var object = getContactsObject(data[i]);
    frnds.push(object);
  }
  return frnds;
}

function getContactsObject(data) {
  return {
    name: data.name,
    isFriend: data.isFriend,
    isRegistered: data.is_registered,
    phoneNumber: data.phone_number,
  };
}

function getPhonesObject(data) {
  let userId=null
  DataManager.getUserDetails().then(response => {
    if (response !== null) {
      let result = JSON.parse(response);
     userId= result.data._id 
    } else {
    }
  });
  
  return {
    name:  data.friendDetails.userName?data.friendDetails.userName:data.friendDetails.name,
    email:data.friendDetails.email,
    id:data.friendDetails._id,
    user_type:data.friendDetails.user_type,
    phoneNumber:data.friendDetails.phone_number,
    isFriend: data.is_friend,
    receiver_id: data.receiver_id,
    profile:data.friendDetails.profile
  };
}

function myFriends(data) {
  let frnds = [];
  for (let i in data) {
    var object = getPhonesObject(data[i]);
    frnds.push(object);
  }
  return frnds;
}

module.exports = {
  getFriendsData,
  getFriendObject,
  friendInfo,
  getFriendsSection,
};
