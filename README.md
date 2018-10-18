# VALKYRIE README

Database Access URL's:
  + Production Server URL:   http://team6-productioapp.zet8uiimnv.us-east-2.elasticbeanstalk.com/
  + Test Server URL:         http://team6-testserveapp.im8j6rkm83.us-east-2.elasticbeanstalk.com/


  * Register new user       : server_url/firstTimeRegistration (POST)
  * View entire database    : server_url/selectAll (GET)
  * Query one specific user : server_url/userInfo (GET)
  * Update team number      : server_url/updateTeamNumber (POST)
  * Update skills           : server_url/updateSkills (POST)
  * Update picture          : server_url/updateProfilePic (POST)
  * Update availability     : server_url/updateAvailability (POST)
  * Check-in to area        : server_url/checkIn (GET)
  * Check-out of area       : server_url/checkOut (GET)
  * Get local users         : server_url/getCurrent (GET)

Current Table Schema:
  * first_name VARCHAR(15) not null
  * last_name VARCHAR(25) not null
  * device_address VARCHAR(40)
  * availability BOOLEAN not null      //defaults to 'false'
  * team VARCHAR(25) not null
  * user_skill_package JSON            //defaults to three empty strings
  * profile_picture LONGBLOB
  * PRIMARY KEY (device_address)

Database Expectations:
  * first_name       : Body as "firstName"
  * last_name        : Body as "lastName"
  * device_address   : Header as "deviceaddress"
  * team             : Body as "team"
  * userSkillPackage : Body as "skills", each item MUST be wrapped in double quotes and separated by commas
  * availability     : Body as "availability"
  * profile_picture  : Body as "image"
