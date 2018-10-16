# VALKYRIE README

Database Access URL's:
  + Production Server URL:   http://ec2-18-218-181-222.us-east-2.compute.amazonaws.com/
  + Test Server URL:         http://ec2-18-218-162-74.us-east-2.compute.amazonaws.com/


  * Register new user       : server_url/firstTimeRegistration (POST)
  * View entire database    : server_url/selectAll (GET)
  * Query one specific user : server_url/userInfo (GET)
  * Update team number      : server_url/updateTeamNumber (POST)
  * Update skills           : server_url/updateSkills (POST)
  * Update picture          : server_url/updateProfilePic (POST)
  * Update availability     : server_url/updateAvailability (POST)

Current Table Schema:
  * first_name VARCHAR(15) not null
  * last_name VARCHAR(25) not null
  * device_address VARCHAR(40)
  * availability BOOLEAN not null      //defaults to 'false'
  * team VARCHAR(25) not null
  * userSkillPackage JSON
  * profile_picture LONGBLOB
  * PRIMARY KEY (device_address)

Database Expectations:
  * first_name       : Body as "firstName"
  * last_name        : Body as "lastName"
  * device_address   : Header as "device_address"
  * team             : Body as "team"
  * userSkillPackage : Body as "skills", each item MUST be wrapped in double quotes and separated by commas
  * availability     : Body as "availability"
  * profile_picture  : Body as "image"
