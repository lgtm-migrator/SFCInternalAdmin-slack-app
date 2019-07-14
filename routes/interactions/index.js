const axios = require('axios');
const qs = require('qs');
const express = require('express');
const config = require('../../config/config');
const registrationApproval = require('../../utils/registrationApprovals');
const SearchUtil = require('../../utils/search');

const router = express.Router();
const isVerified = require('../../utils/verifySignature').isVerified;

router.route('/').post(async (req, res) => {
  if(config.get('app.search.verifySignature')) {
    if (!isVerified(req)) return res.status(401).send();
  } else {
    console.log("WARNING - search - VerifySignature disabled");
  }

  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload);

    // console.log("WA DEBUG - payload: ", payload)

    const callbackID = payload.callback_id;
    console.log("CallbackID - ", callbackID);

    switch (callbackID) {
      // on accepting or rejecting a registration
      case "registration":
        return registrationApproval(payload, res);
        break;
      
      // on having entered information in the find (search) dialog
      case "find-callbackid":
        return SearchUtil.interactiveFind(payload, res);
        break;
    }
  
    return res.status(200).json({
        text: 'DOH!',
        style: 'warning',
        username: 'markdownbot',
        markdwn: true,
    });
  
  } else {
    res.status(500).send();
  }

});

module.exports = router;
