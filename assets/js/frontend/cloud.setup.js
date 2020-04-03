/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {
    //CONTACT
    "sendMessage": {
      "verb": "POST",
      "url": "/api/v1/frontend/contact/sendMessage",
      "args": ["name","email","phone","subject","message",]
    },

    //LOGIN
    "login": {
      "verb": "POST",
      "url": "/api/v1/frontend/user/login",
      "args": ["emailAddress", "password"]
    },
    "editUser": {
      "verb": "PATCH",
      "url": "/api/v1/backend/user/edit/:id",
      "args": ["emailAddress", "phone", "firstName", "lastName", "password", "birthday", "status", "type", "thumbnail"]
    }
  }
  /* eslint-enable */

});
