function timeRefresh(){
  setTimeout(getCurrentUsers, 5000)
}


function getCurrentUsers(){
  fetch('http://team6-testserveapp.im8j6rkm83.us-east-2.elasticbeanstalk.com/getCurrent', {
    method: 'GET',
    headers: {
      "Accept": "application/json, text/plain, */*",
      "deviceaddress": '0000'
    },
  })
  .then((response) => {
    if(response.status === 200) {
      return response.json()
    }
    else if(response.status === 407) {
      //Alert.alert("Proxy Authentication Required","Status Code: " + response.status + ", " + response.statusText, [{text: 'OK'}],{ cancelable: false })
      //ERROR 407 ERROR!!!!!!!!!
    }
  })
  .then((responseJson) => {
    try {
      console.log(responseJson)
      if(responseJson.results) {
        //global.firstName = userDeviceInfo.first_name
        //global.lastName = userDeviceInfo.last_name
        //global.teamNumber = userDeviceInfo.team
        //global.userSkillPackage = userDeviceInfo.user_skill_package
        //global.availability = userDeviceInfo.availability

        if(userDeviceInfo.profile_picture != null) {
          //Save the picture
        }
        else{
          //Use default picture
        }

      }
    }
    catch(e) {
      //Alert.alert("Error","Unable to fetch JSON " + e, [{text: 'OK'}],{ cancelable: false })
      //ERROR
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
