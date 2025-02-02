const sendSMS = async(req, res) =>{
    try{
        const data = req.body;
        console.log(data);
        console.log(process.env.IPLUM_CONFIG_API_KEY, process.env.IPLUM_CONFIG_SECRET_KEY);
        const response = await fetch(`${process.env.IPLUM_CONFIG_BASE_URL}//usage/getusage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.IPLUM_CONFIG_API_KEY}`,
              'X-Secret-Key':   `${process.env.IPLUM_CONFIG_SECRET_KEY}`,
              'Accept': 'application/json'
            },
            // credentials: 'include',
            body: JSON.stringify({
              to: data.phoneNumber,
              text: data.message,
              from: `${process.env.SENDER_ID}`,
            }),
          });
          console.log(response.statusText);
        //   if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || 'Failed to send SMS');
        //   }

    } catch (error) {
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
