import CryptoJS from "crypto-js";
function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based
    let year = date.getFullYear();
  
    // Add leading zero if needed
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
  
    return `${day}-${month}-${year}`;
  }
  
 export function getBookingDates(startDate, endDate) {
    let dateArray = [];
    let currentDate = new Date(startDate);
  
    // Iterate until the day before the checkout date
    while (currentDate < endDate) {
      dateArray.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateArray;
  }
  
  // Define the check-in and check-out dates
//   let checkInDate = new Date('2024-07-27');
//   let checkOutDate = new Date('2024-07-30');
  
  // Get all booking dates (excluding check-out date)
//   let bookingDates = getBookingDates(checkInDate, checkOutDate);
  
  // Output the booking dates
//   console.log(bookingDates);
  

// export const filterByDay = (data) => {
//   return data.reduce((acc, obj) => {
//       const dayKey = `day${obj.day}`;
//       if (!acc[dayKey]) {
//           acc[dayKey] = [];
//       }
//       acc[dayKey].push(obj);
//       return acc;
//   }, {});
// };


// export const filterByDay = (data) => {
//   const groupedData = data.reduce((acc, obj) => {
//       const dayKey = `day${obj.day}`;
//       // const dayKey = `day`;
//       if (!acc[dayKey]) {
//           acc[dayKey] = [];
//       }
//       // acc[dayKey].push(obj);
      
//       acc[dayKey].push(obj);
//       // acc.day.push(obj.day)
//       return acc;
//   }, {});

//   // return Object.keys(groupedData).map(day => ({ [day]: groupedData[day] }));
//   return Object.keys(groupedData).map(day => ({ "day": groupedData[day] }));
// };


export const filterByDay = (data) => {
  const groupedData = data.reduce((acc, obj) => {
      const dayKey = `day${obj.day}`;
      if (!acc[dayKey]) {
          acc[dayKey] = [];
      }
      acc[dayKey].push(obj);
      return acc;
  }, {});

  return Object.keys(groupedData).map(day => ({
      // [day]: groupedData[day],
      day: parseInt(day.replace('day', ''), 10),
      data: groupedData[day]
  }));
};


export const checkAllBookingsStatusNotZero = (tripBooking) => {
  const { stayBooking, experienceBooking, eventBooking, addonBooking } = tripBooking;

  const checkStatus = (bookings) => {
    return bookings.every(booking => booking.status !== 0);
  };

  const allStayBookingsValid = checkStatus(stayBooking);
  const allExperienceBookingsValid = checkStatus(experienceBooking);
  const allEventBookingsValid = checkStatus(eventBooking);
  const allAddonBookingsValid = checkStatus(addonBooking);

  return allStayBookingsValid && allExperienceBookingsValid && allEventBookingsValid && allAddonBookingsValid;
};


export const isOlderThan48Hours = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInHours = (now - createdDate) / (1000 * 60 * 60);
  return diffInHours > 48;   
};
// const filteredData = filterByDay(data);
// console.log(filteredData);

// const filteredData = filterByDay(data);
// console.log(filteredData);
// const filteredData = filterByDay(data);
// console.log(filteredData);

export const getDaysCheckInAndCheckOutDates = (startDate, endDate) => {
  let weekendCount = 0;
  let regularCount = 0;
  let currentDate = new Date(startDate);
  const checkoutDate = new Date(endDate);

  // Loop through each date from startDate to the day before endDate
  while (currentDate < checkoutDate) {
    const dayOfWeek = currentDate.getDay(); // Get the day of the week (0 for Sunday, 6 for Saturday)

    if (dayOfWeek === 0 || dayOfWeek === 6) { // Check if it's a weekend
      weekendCount++;
    } else {
      regularCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  // Return the counts
  return { weekendCount, regularCount };
}

export const decryptData = async (dataUser) => {
  console.log('dataUser:', dataUser);
  let result = {}; // Initialize result as an empty object
  const secretPass = "XkhZG4fW2t2W0#$";
  
  if (dataUser) {
    try {
      // Decrypting the data
      const bytes = CryptoJS.AES.decrypt(dataUser, secretPass);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      // Check if the decrypted string is valid JSON
      if (isJsonString(decryptedString)) {
        result = JSON.parse(decryptedString);
      }
    } catch (error) {
      console.error("Decryption error:", error);
    }
  }

  return result;
};

// Helper function to validate JSON strings
const isJsonString = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};