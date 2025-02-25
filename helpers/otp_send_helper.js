import axios from "axios";
const sendOTP = async (number, otp) => {

  const reqBody = {
    "route": "otp",
    "variables_values": otp,
    "schedule_time": '',
    "numbers": number,
  }

  axios.post('https://www.fast2sms.com/dev/bulkV2', reqBody, {
    headers: {

      "authorization": "a7ZIot2WUq4NvpKrEzPeLfAFykQlTMd5inOgHDR39Yu1JmSwc6A9IRlorOnwuqCvVhM2Q8E6zemLpJyb",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      console.log('ResponseOnWhatsapp:', response.data);
    })
    .catch(error => {
      console.error('ErrorOnWhatsapp:', error);
    });
};

export {
  sendOTP
}
