const crypto = require('crypto');

const sendSMS = async(req, res) =>{
    // try{
    //     const data = req.body;
    //     console.log(data);
    //     console.log(process.env.IPLUM_CONFIG_API_KEY, process.env.IPLUM_CONFIG_SECRET_KEY);
    //     const response = await fetch(`${process.env.IPLUM_CONFIG_BASE_URL}//usage/getusage`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${process.env.IPLUM_CONFIG_API_KEY}`,
    //           'X-Secret-Key':   `${process.env.IPLUM_CONFIG_SECRET_KEY}`,
    //           'Accept': 'application/json'
    //         },
    //         // credentials: 'include',
    //         body: JSON.stringify({
    //           to: data.phoneNumber,
    //           text: data.message,
    //           from: `Alexis E. Carte`,
    //         }),
    //       });
    //       console.log(response.statusText);
    //     //   if (!response.ok) {
    //     //     const errorData = await response.json();
    //     //     throw new Error(errorData.message || 'Failed to send SMS');
    //     //   }

    // } catch (error) {
    //     console.log(error);
    // }
  
        const accessKey = 'Tf2NLJZq_kaxxTFGsok67w';
        const username = '+15622213408';
        const version = 'v1';
        const epochDateTime = Math.floor(Date.now() / 1000).toString();
        const secretKey = 'N0lLMD31p0ecDiWfAdAuew';
      
        const representation = `post\n${accessKey}\n${username}\n${version}\n${epochDateTime}\n/usage/getusage`;
        const signature = crypto.createHmac('sha256', secretKey).update(representation).digest('base64');
      
        const headers = {
          'X-iPlumAuth-AccessKey': accessKey,
          'X-iPlumAuth-Username': username,
          'X-iPlumAuth-Version': version,
          'X-iPlumAuth-EpochDateTime': epochDateTime,
          'Authorization': `iPlumAuth ${signature}`,
          'Content-Type': 'application/json'
        };
      
        const requestBody = {
          Lang: 'en',
          'To': req.body.phoneNumber,
          'Message': req.body.message,
        };
      
        try {
          const response = await fetch('https://api.iplum.com/usage/sendsaddsfdtext', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
          });
        //   const data = await response.json();
          console.log(response);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          
          res.json(data);
        } catch (error) {
          res.status(500).json({ error: error.message });
          console.log(error);
        }
}

const makeCALL = async(req, res) =>{
    
    try{

        const data = req.body;
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
   sendSMS,
   makeCALL,
};
