
function getFriendsData(data) {
    var friendsArray = []
    for (let i in data) {
        var object = this.getFriendObject(data[i])
        friendsArray.push(object)
    }
    return friendsArray
}

function getFriendObject(data) {
    return {
        blocked: data.blocked,
        country_code: data.country_code,
        created_at: data.created_at,
        date_of_birth: data.date_of_birth,
        deleted_at: data.deleted_at,
        device_token: data.device_token,
        device_type: data.device_type,
        driver_type: data.driver_type,
        email: data.email,
        id: data.id,
        image: data.image,
        lat: data.lat,
        lon: data.lon,
        name: data.name,
        password_token: data.password_token,
        phone_number: data.phone_number,
        refresh_token: data.refresh_token,
        updated_at: data.updated_at,
        user_name: data.user_name,
        user_type: data.user_type,
        verify_email_status: data.verify_email_status,
        visible_pwd: data.visible_pwd,
    }
}
module.exports = { getFriendsData, getFriendObject }