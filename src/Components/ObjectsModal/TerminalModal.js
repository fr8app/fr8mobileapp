var routeArray = [];
const TerminalModal = {
  // Method will return array of terminal
  getTerminalData(data) {

    var terminalArray = [];
    for (let i in data) {
      var object = this.getTerminalObject(data[i]);
      terminalArray.push(object);
    }
    return terminalArray;
  },

  // Method will return object for a Terminal
  getTerminalObject(data) {
    return {
      avg_graph:data.avg_graph,
      manual_graph: data.manual_graph,
      updateManually:data.updateManually,
      created_at: data.created_at??"",
      updated_at: data.updated_at,
      id: data._id,
      terminal_name: data.terminal_name,
      terminal_logo: data.terminal_logo,
      terminal_description: data.terminal_description,
      terminal_location: data.terminal_location,
      followers_count: data.followers_count,
      latitude: data.latitude,
      longitude: data.longitude,
      distance: data.distance,
      is_follow: data.is_follow,
      city_id: data.city_id,
      city_name: data.city_name,
      terminal_category: data.terminal_category,
      radius: data.radius,
      map_logo: data.map_logo,
      user_id: data.user_id,
      description: data.description,
      avg_total_stopage_time_in_minutes: data.avg_total_stopage_time_in_minutes,
      open_time: data.open_time,
      close_time: data.close_time,
      polygon_area: data.polygon_area ? data.polygon_area : JSON.stringify([]),
      total_users:data.total_users,
      terminal_id:data.terminal_id,
      terminal_url:data.terminal_url,
      terminal_image_type:data.terminal_image_type,
      is24Available:data.is24Available
    };
  }
};

function getVideoData(data) {
  var videoArray = [];
  for (let i in data) {
    var object = this.getVideoObject(data[i]);
    videoArray.push(object);
  }
  return videoArray;
}

function getVideoObject(data) {

  return {
    created_at: data.created_at,
    deleted_at: data.deleted_at,
    dislike_count: data.dislike_count,
    id: data.id,
    _id: data.id,
    like_count: data.like_count,
    updated_at: data.updated_at,
    video: data.video,
    name: data.name ? data.name : data.created_by,
    image: data.image,
    like_status: data.like_status,
    thumbnail_image: data.thumbnail_image,
    user_id: data.user_id,
    type: data.type,
    profile: data.profile,
    created_by: data.created_by,
    description: data.description
  };
}
function getRouteData(data) {

  for (let i in data) {
    var object = this.getRouteDataObject(data[i]);
    routeArray.push(object);
  }
  return routeArray;
}
function getRouteDataObject(data) {
  return {
    created_at: data.created_at,
    deleted_at: data.deleted_at,
    distance: data.distance,
    end_time: data.end_time,
    id: data.id,
    image: data.image,
    minute: data.minute,
    start_time: data.start_time,
    terminal_id: data.terminal_id,
    updated_at: data.updated_at,
    user_id: data.user_id,
  }
}

module.exports = { TerminalModal, getVideoData, getVideoObject, getRouteData, getRouteDataObject };
