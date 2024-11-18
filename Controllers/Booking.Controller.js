import createError from 'http-errors';
import { sendErrorResponse, sendSuccessResponse } from '../helpers/responseHelper.js';
import StayType from '../Models/StayType.model.js';
import Stay from '../Models/Stay.model.js';
import Foods from '../Models/Food.model.js';
import Facilities from '../Models/Facilities.model.js';
import TripBooking from '../Models/TripBooking.model.js';
import StayBooking from '../Models/StayBooking.model.js';
import ExperienceBooking from '../Models/ExperienceBooking.model.js';
import ConveyenceBooking from '../Models/ConveyenceBooking.js';
import Razorpay from 'razorpay'
import Transaction from '../Models/Transaction.model.js';
import BookingCart from '../Models/BookingCart.model.js';
import Experience from '../Models/Experience.model.js';
import ExperienceInventory from '../Models/ExperienceInventory.model.js';
import DocumentVerification from '../Models/DocumentVerification.model.js';
import { checkAllBookingsStatusNotZero, getBookingDates, getDaysCheckInAndCheckOutDates, isOlderThan48Hours } from '../helpers/common_helpers.js';
import StayInventory from '../Models/StayInventory.model.js';
import moment from 'moment';
import RejectReason from '../Models/RejectBooking.model.js';
import RejectBooking from '../Models/RejectBooking.model.js';
import EventInventory from '../Models/EventInventory.model.js';
import Event from '../Models/Event.model.js';
import EventBooking from '../Models/EventBooking.model.js';
import User from '../Models/User.model.js';
import Property from '../Models/Property.model.js';
import ExperienceBookingTemporary from '../Models/ExperienceBookingTemporary.js';
import EventBookingTemporary from '../Models/EventBookingTemporary.js';
import AddonBooking from '../Models/AddonBooking.model.js';
import Rating from '../Models/Rating.model.js';
import RefundTransaction from '../Models/RefundTransaction.model.js';
import Languages from '../Models/Language.model.js';
import PropertiesCancellationPolicy from '../Models/PropertiesCancellationPolicy.model.js';
import PropertiesCampRules from '../Models/PropertiesCampRules.model.js';
import ExperienceCancellationPolicy from '../Models/ExperienceCancellationPolicy.model.js';

const razorpay = new Razorpay({
  key_id: 'rzp_test_sCsqjUV0yDnb67',
  key_secret: 'ooNZPvemVWsjNO2q6q5pWcLf',
});

const BookingController = {
  addBooking: async (req, res, next) => {
    try {
      const reqBody = req.body
      if (reqBody.stayBooking) {
        for (let stay of reqBody.stayBooking) {
          const stayDetail = await Stay.findById(stay.stayId)
          const stayInventory = await StayInventory.findOne({ date: stay.startDate, stayId: stay.stayId })
          const countCapacityTotal = stayDetail.countCapacity * stayDetail.countAvailable
          if (stayInventory?._id) {
            if (stayInventory.booked >= countCapacityTotal) {
              return sendErrorResponse(res, 'stay is not available', 'stay is not available', 404);
            } else {
              let avalableCapicity = countCapacityTotal - stayInventory.booked
              if (stay.adults > avalableCapicity) {
                return sendErrorResponse(res, 'stay is not available', 'stay is not available', 404);
              }
            }
          }

        }
      }
      if (reqBody.experienceBooking) {
        for (let experience of reqBody.experienceBooking) {
          const experienceDetail = await Experience.findById(experience.experienceId)
          const capacity = Number(experienceDetail?.maxPerson) || 0
          const totalGuest = Number(reqBody.adults) + Number(reqBody.children)
          const experienceInventory = await ExperienceInventory.findOne({ experienceId: experience.experienceId, bookingDate: experience.checkInDate })
       
          if (experienceInventory?._id) {
            let totalCapacity = experienceInventory.capacity - experienceInventory.booked
       
            if (totalGuest > totalCapacity) {

              return sendErrorResponse(res, 'Experience Capacity Not avalable', 'Experience Capacity Not avalable', 404);
            }

          } else {
            if (totalGuest > capacity) {
              const errorResult = {
                experienceName: experienceDetail.experienceName,
                availableCapacity: experienceDetail?.maxPerson,
                yourTotalGuest: totalGuest
              }
              return sendErrorResponse(res, errorResult, 'Experience Capacity Not avalable', 404);
            }
          }
        }
      }

      if (reqBody.eventBooking) {
        for (let event of reqBody.eventBooking) {
          const eventDetail = await Event.findById(event.experienceId)
          const capacity = Number(eventDetail?.maxPerson) || 0
          const totalGuest = Number(reqBody.adults) + Number(reqBody.children)
          const experienceInventory = await EventInventory.findOne({ experienceId: event.experienceId, bookingDate: event.checkInDate })

          if (experienceInventory && experienceInventory._id) {
            let totalCapacity = experienceInventory.capacity - experienceInventory.booked;
            if (totalGuest > totalCapacity) {
              return sendErrorResponse(res, 'errorResult', 'Booking Failed', 404);
            }
          } else {
            if (totalGuest < capacity) {

              // return sendErrorResponse(res, errorResult, 'Event capacity not available', 404);
            } else {
              return sendErrorResponse(res, 'errorResult', 'Event capacity not available', 404);
            }
          }

        }
      }


      const tripReqBody = {
        hostId: reqBody.hostId,
        userId: reqBody.userId,
        userName: reqBody.userName,
        propertyId: reqBody.propertyId,
        primaryguestName: reqBody.primaryguestName,
        primaryguestEmail: reqBody.primaryguestEmail,
        primaryguestPhone: reqBody.primaryguestPhone,
        countAdults: reqBody.adults,
        countChildren: reqBody.children,
        countPet: reqBody.pet,
        checkInDate: reqBody.checkInDate,
        checkOutDate: reqBody.checkOutDate,
        totalPrice: reqBody.totalPrice
      }
      const tripBooking = new TripBooking(tripReqBody)
      const saveTripBooking = await tripBooking.save()
      if (saveTripBooking._id) {
        if (reqBody.stayBooking) {
          for (let stay of reqBody.stayBooking) {

            stay.tripBookingId = saveTripBooking._id
            const stayBooking = new StayBooking(stay)
            const saveStayBooking = await stayBooking.save()
            saveTripBooking.stayBooking = saveStayBooking
            let bookingDates = getBookingDates(new Date(stay.checkInDate), new Date(stay.checkOutDate));
            for (let i of bookingDates) {
              let updateDate = moment(i, 'DD-MM-YYYY').format('YYYY-MM-DD');
              const stayInv = await StayInventory.findOne({ date: updateDate, stayId: stay.stayId })
              const countCapacityTotal = stay.countCapacity * stay.countAvailable
              if (stayInv?._id) {
                await StayInventory.findByIdAndUpdate(stayInv._id, { booked: stayInv.booked + stay.adults })
              } else {
                const newStayInventory = new StayInventory({
                  stayId: stay.stayId,
                  date: updateDate,
                  booked: stay.adults < countCapacityTotal ? stay.adults : countCapacityTotal,
                  capacity: countCapacityTotal,
                })
                await newStayInventory.save()
              }
            }
          }
        }
        if (reqBody.experienceBooking) {
          for (let experience of reqBody.experienceBooking) {
            experience.tripBookingId = saveTripBooking._id
            experience.hostId = reqBody.hostId
            const experienceBooking = new ExperienceBooking(experience)
            const saveExperienceBooking = await experienceBooking.save()
            saveTripBooking.experienceBooking = saveExperienceBooking

            const experienceDetail = await Experience.findById(experience.experienceId)
            const capacity = Number(experienceDetail.maxPerson)
            const totalGuest = experience.adults + experience.children
            const experienceInventory = await ExperienceInventory.findOne({ experienceId: experience.experienceId, bookingDate: experience.checkInDate })

            if (experienceInventory?._id) {
              let totalCapacity = experienceInventory.capacity - experienceInventory.booked
              if (totalCapacity > totalGuest) {
                await ExperienceInventory.findByIdAndUpdate(experienceInventory?._id, { booked: totalGuest + experienceInventory.booked })
              }
            } else {
              const newExperienceInventory = new ExperienceInventory({
                experienceId: experience.experienceId,
                bookingDate: experience.checkInDate,
                capacity: Number(experienceDetail.maxPerson) || 0,
                booked: experience.adults + experience.children
              })
              const saveInve = await newExperienceInventory.save()
            }
          }
        }

        if (reqBody.eventBooking) {
          for (let experience of reqBody.eventBooking) {
            experience.tripBookingId = saveTripBooking._id
            experience.hostId = reqBody.hostId
            const experienceBooking = new EventBooking(experience)
            const saveExperienceBooking = await experienceBooking.save()
            saveTripBooking.experienceBooking = saveExperienceBooking

            const experienceDetail = await Event.findById(experience.experienceId)
            const capacity = experienceDetail.capacity
            const totalGuest = experience.adults + experience.children
            const experienceInventory = await EventInventory.findOne({ experienceId: experience.experienceId, bookingDate: experience.checkInDate })

            if (experienceInventory?._id) {
              let totalCapacity = experienceInventory.capacity - experienceInventory.booked
              if (totalCapacity > totalGuest) {
                await EventInventory.findByIdAndUpdate(experienceInventory?._id, { booked: totalGuest + experienceInventory.booked })
              }
            } else {
              const newExperienceInventory = new EventInventory({
                experienceId: experience.experienceId,
                bookingDate: experience.checkInDate,
                capacity: Number(experienceDetail.maxPerson),
                booked: experience.adults + experience.children
              })
              const saveInve = await newExperienceInventory.save()
            }
          }

        }
        if (reqBody?.addonBooking) {
          for (let i of reqBody.addonBooking) {
            i.tripBookingId = saveTripBooking._id
            i.userId = reqBody.userId
            const saveAddonBooking = new AddonBooking(i)
            await saveAddonBooking.save()
          }
        }
      }
      if (saveTripBooking._id) {
        const bookingDetail = await TripBooking.findById(saveTripBooking._id)
        const stayBooking = await StayBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.experienceBooking = experienceBooking
        // const conveyenceBooking = await ConveyenceBooking.find({ tripBookingId: saveTripBooking._id })
        // bookingDetail.conveyenceBooking = conveyenceBooking
        const addonBooking = await AddonBooking.find({ tripBookingId: saveTripBooking._id })
        const eventBooking = await EventBooking.find({ tripBookingId: saveTripBooking._id })

        const result = {
          ...bookingDetail._doc,
          stayBooking: stayBooking,
          experienceBooking: experienceBooking,
          // conveyenceBooking: conveyenceBooking,
          addonBooking: addonBooking,
          eventBooking: eventBooking
        }
        sendSuccessResponse(res, result, 'Booking added successfully');
      } else {
        sendSuccessResponse(res, saveTripBooking, 'Booking added successfully');
      }
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  tripBookingByHostId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const tripBooking = await TripBooking.find({ hostId: reqBody.hostId }).sort({ _id: "desc" });
      if (tripBooking.length > 0) {
        for (let i of tripBooking) {
          const guestUser = await User.findById(i.userId)
          i._doc.profilePhoto = guestUser.profilePhoto
          const stayBooking = await StayBooking.find({ tripBookingId: i._id, status: { $nin: [2] } })
          for (let item of stayBooking) {
            const stayType = await StayType.findById(item.stayTypeId)
            item._doc.stayTypeImg = stayType.stayImg
          }
          i._doc.stayBooking = stayBooking
          const experienceBooking = await ExperienceBooking.find({ tripBookingId: i._id, status: { $nin: [2] } })
          i._doc.experienceBooking = experienceBooking
          const eventBooking = await EventBooking.find({ tripBookingId: i._id, status: { $nin: [2] } })
          i._doc.eventBooking = eventBooking
          const conveyenceBooking = await ConveyenceBooking.find({ tripBookingId: i._id })
          i._doc.conveyenceBooking = conveyenceBooking
          const documentVerification = await DocumentVerification.find({ tripBookingId: i._id })
          i._doc.documentVerification = documentVerification
          const addonBooking = await AddonBooking.find({ tripBookingId: i._id, status: { $nin: [2] } })
          i._doc.addonBooking = addonBooking
        }
      }
      sendSuccessResponse(res, tripBooking, 'Trip Booking list fetched  successfully');
    } catch (error) {
      next(error)
    }
  },

  getAllBookingByHostId: async (req, res, next) => {
    try {
      const hostId = req.body.hostId
      const stayBooking = await StayBooking.find({ hostId: hostId })
      const experienceBooking = await ExperienceBooking.find({ hostId: hostId })
      const eventBooking = await EventBooking.find({ hostId: hostId })
      const addonBooking = await AddonBooking.find({ hostId: hostId })

      const result = {
        stayBooking: stayBooking,
        experienceBooking: experienceBooking,
        eventBooking: eventBooking,
        addonBooking: addonBooking
      }

      sendSuccessResponse(res, result, ' Booking list fetched  successfully');
    } catch (error) {
      next(error)
    }
  },

  tripApprovedAndReject: async (req, res, next) => {
    try {
      const reqBody = req.body
      const tripBooking = await TripBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })   /// 1 - Approved, 2 - Rejected
      sendSuccessResponse(res, tripBooking, 'Trip Booking status updated successfully');
    } catch (error) {
      next(error)
    }
  },

  tripCheckInCheckOut: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingType = reqBody.bookingType
      let result;                ///bookingType: 1 stay, 2 - experience, 3 - event, 4 - addon
      if (bookingType === 1) {
        result = await StayBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })   /// status : 3 - checkIn , 4 - checkOut 
      } else if (bookingType === 2) {
        result = await ExperienceBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })
      } else if (bookingType === 3) {
        result = await EventBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })
      } else {
        result = await AddonBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })
      }
      const tripBooking = await TripBooking.findByIdAndUpdate(result.tripBookingId, { status: Number(reqBody.status) === 3 ? 4 : 6 })   /// 4 - CheckIn, 5 - Check In All , 6 - checkout 
      const tripBookingData = await TripBooking.findById(result.tripBookingId)
      let stayFlag = true
      let experienceFlag = true
      let eventFlag = true

      let stayRejectFlag = true
      let experienceRejectFlag = true
      let eventRejectFlag = true

      const checkStatus = (bookings) => {
        return bookings.every(booking => booking.status === 3);
      };

      const checkOutBookingStatus = (bookings) => {
        return bookings.every(booking => booking.status === 4);
      };

      if (tripBookingData) {
        const stayBooking = await StayBooking.find({ tripBookingId: tripBookingData._id })
        if (stayBooking.length > 0) {
          stayFlag = checkStatus(stayBooking)
          stayRejectFlag = checkOutBookingStatus(stayBooking)
        }
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: tripBookingData._id })
        if (experienceBooking.length > 0) {
          experienceFlag = checkStatus(experienceBooking)
          experienceRejectFlag = checkOutBookingStatus(experienceBooking)
        }
        const addonBooking = await AddonBooking.find({ tripBookingId: tripBookingData._id })
        const eventBooking = await EventBooking.find({ tripBookingId: tripBookingData._id })
        if (eventBooking.length > 0) {
          eventFlag = checkStatus(eventBooking)
          eventRejectFlag = checkOutBookingStatus(eventBooking)
        }
        if (stayFlag === true && experienceFlag === true && eventFlag === true) {
          await TripBooking.findByIdAndUpdate(tripBookingData._id, { status: 5 })
        } else {
          console.log('not true all booking status')
        }
        // if (reqBody.status === 3) {
        //   if (stayRejectFlag === true && experienceRejectFlag === true && eventRejectFlag === true) {
        //     await TripBooking.findByIdAndUpdate(tripBookingData._id, { status: 6 })
        //   }
        // }

      }
      sendSuccessResponse(res, result, 'Booking checkIn checkOut status updated successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  tripBookingById: async (req, res, next) => {
    try {
      const reqBody = req.body
      const tripBooking = await TripBooking.findById(reqBody.id)
      if (tripBooking?._id) {
        let id = tripBooking._id.toString()
        const stayBooking = await StayBooking.find({ tripBookingId: id, status: { $nin: [2] } })
        tripBooking._doc.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: id, status: { $nin: [2] } })
        tripBooking._doc.experienceBooking = experienceBooking
        // const conveyenceBooking = await ConveyenceBooking.find({ tripBookingId: id })
        // tripBooking._doc.conveyenceBooking = conveyenceBooking
        const eventBooking = await EventBooking.find({ tripBookingId: id, status: { $nin: [2] } })
        tripBooking._doc.eventBooking = eventBooking
        const addonBooking = await AddonBooking.find({ tripBookingId: id })
        tripBooking._doc.addonBooking = addonBooking

        let visitingPlace = null
        let visitingPlaceAddress = null
        let lat = null
        let long = null


        if (tripBooking.propertyId != null) {
          const propertyDetail = await Property.findById(tripBooking.propertyId)
          visitingPlace = propertyDetail.propertyName || null
          visitingPlaceAddress = propertyDetail.propertyFullLocation || null
          lat = propertyDetail.propertyLocated.lat
          long = propertyDetail.propertyLocated.long
          let campRules = await PropertiesCampRules.findById(propertyDetail.campRulesId)
          tripBooking._doc.campRules = campRules

          let cancellationPolicy = await PropertiesCancellationPolicy.findById(propertyDetail.cancellationPolicyId)
          tripBooking._doc.cancellationPolicy = cancellationPolicy
        } else {
          if (tripBooking?.eventBooking) {
            if (tripBooking?.eventBooking.length > 0) {
              const eventDetail = await Event.findById(tripBooking.eventBooking[0].experienceId)
              visitingPlace = eventDetail?.experienceName
              visitingPlaceAddress = eventDetail?.location?.address
              lat = eventDetail?.location?.lat
              long = eventDetail?.location?.long
              let campRules = await PropertiesCampRules.findOne()
              tripBooking._doc.campRules = campRules

              let cancellationPolicy = await ExperienceCancellationPolicy.findById(eventDetail.cancellationId)
              tripBooking._doc.cancellationPolicy = cancellationPolicy
            }
          } else {
            if (tripBooking?.experienceBooking) {
              if (tripBooking?.experienceBooking.length > 0) {
                const experienceDetail = await Experience.findById(tripBooking.experienceBooking[0].experienceId)
                visitingPlace = experienceDetail?.experienceName
                visitingPlaceAddress = experienceDetail?.location?.address
                lat = experienceDetail?.location?.lat
                long = experienceDetail?.location?.long
                let campRules = await PropertiesCampRules.findOne()
                tripBooking._doc.campRules = campRules

                let cancellationPolicy = await ExperienceCancellationPolicy.findById(experienceDetail.cancellationId)
                tripBooking._doc.cancellationPolicy = cancellationPolicy
              }
            }
          }
        }
        tripBooking._doc.visitingPlace = visitingPlace
        tripBooking._doc.visitingPlaceAddress = visitingPlaceAddress
        tripBooking._doc.lat = lat
        tripBooking._doc.long = long
        console.log('long', long)
        console.log('lat', lat)
        const hostDetail = await User.findById(tripBooking.hostId, { "_id": 1, "name": 1, "mobileNo": 1, "email": 1, "memberSince": 1, "userDesc": 1, "languages": 1, "replyRate": 1, "profilePhoto": 1 })
        tripBooking._doc.hostDetail = hostDetail
        let language = []
        if (hostDetail?.languages) {
          const langData = await Languages.find({ _id: { $in: hostDetail.languages } }, { "language": 1 })
          if (langData.length > 0) {
            for (let i of langData) {
              language.push(i.language)
            }
          }
          hostDetail._doc.language = language
        }
      }
      sendSuccessResponse(res, tripBooking, 'Trip Booking list fetched  successfully');
    } catch (error) {
      console.log('errro', error)
      next(error)
    }
  },

  createOrder: async (req, res, next) => {
    try {
      const options = {
        amount: req.body.amount * 100, // amount in the smallest currency unit
        // amount: 1 * 100,
        currency: 'INR',
        receipt: 'receipt#1',
      };
      const order = await razorpay.orders.create(options);
      sendSuccessResponse(res, order, 'Order created successfully');
    } catch (error) {
      console.log('errror', error)
      next(error)
    }
  },

  createTransaction: async (req, res, next) => {
    try {
      const reqBody = req.body
      const transaction = new Transaction(reqBody)
      const saveTransaction = await transaction.save()
      if (saveTransaction._id) {
        await TripBooking.findByIdAndUpdate(saveTransaction.tripBookingId, { totalPaidAmount: req.body.amount })
      }
      sendSuccessResponse(res, transaction, 'Transaction created successfully');
    } catch (error) {
      next(error)
      // return sendErrorResponse(res, '', 'Transaction Faild', 404);
    }
  },

  addBookingInCart: async (req, res, next) => {
    try {
      const reqBody = req.body
      reqBody.userId = req.body.booking.userId
      reqBody.propertyId = req.body.booking.propertyId
      const existBookingInCart = await BookingCart.findOne({ userId: reqBody.userId, propertyId: reqBody.propertyId })
      let bookingId
      if (existBookingInCart?._id) {
        await BookingCart.findByIdAndUpdate(existBookingInCart._id, reqBody)
        bookingId = existBookingInCart?._id
      } else {
        const bookingCart = new BookingCart(reqBody)
        const saveBookingCart = await bookingCart.save()
        bookingId = saveBookingCart._id
      }
      const booking = await BookingCart.findById(bookingId)
      sendSuccessResponse(res, booking, 'Booking Added in cart');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  getTemporaryTripByUserAndPropertyId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const existBookingInCart = await BookingCart.findOne({ userId: reqBody.userId, propertyId: reqBody.propertyId })

      sendSuccessResponse(res, existBookingInCart, 'Booking Added in cart');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },
  getTemporaryTripBookingById: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await BookingCart.findById(reqBody.id)
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  getTemporaryTripBookingByUserId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await BookingCart.findOne({ userId: reqBody.userId })
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  getAllTemporaryBookingByUserId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await BookingCart.find({ userId: reqBody.userId })
      for(let i of bookingCart){
        const property = await Property.findById(i.propertyId)
        i._doc.propertyName = property.propertyName
      }
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  // addExperienceBooking: async(req, res, next)=>{
  //   try {
  //     const reqBody = req.body
  //     if(reqBody.experienceBooking.length>0){
  //         for(let i of reqBody.experienceBooking){

  //             i.userId = reqBody.userId,
  //             i.userName = reqBody.userName,
  //             i.primaryguestName = reqBody.primaryguestName,
  //             i.primaryguestEmail = reqBody.primaryguestEmail
  //             i.primaryguestPhone = reqBody.primaryguestPhone,
  //             i.hostId = reqBody.hostId,
  //             console.log('item', i)

  //         }
  //     }
  //     console.log('exp booking', reqBody)
  //     sendSuccessResponse(res, reqBody, 'Experience Booking Added ');

  //   } catch (error) {
  //     next(error)
  //   }
  // }

  addExperienceBooking: async (req, res, next) => {
    try {
      const reqBody = req.body
      if (reqBody.experienceBooking) {
        for (let experience of reqBody.experienceBooking) {
          const experienceDetail = await Experience.findById(experience.experienceId)
          const capacity = Number(experienceDetail.maxPerson)
          const totalGuest = experience.adults + experience.children
          const experienceInventory = await ExperienceInventory.findOne({ experienceId: experience.experienceId, bookingDate: experience.checkInDate })

          if (experienceInventory?._id) {
            let totalCapacity = experienceInventory.capacity - experienceInventory.booked
            if (totalGuest > totalCapacity) {
              const errorResult = {
                experienceName: experience.experienceName,
                availableCapacity: totalCapacity,
                yourTotalGuest: totalGuest
              }
              return sendErrorResponse(res, errorResult, 'Booking Faild', 404);
            } else {
              await ExperienceInventory.findByIdAndUpdate(experienceInventory?._id, { booked: totalGuest + experienceInventory.booked })

            }

          } else {
            if (totalGuest > capacity) {
              const errorResult = {
                experienceName: experience.experienceName,
                availableCapacity: Number(experienceDetail.maxPerson),
                yourTotalGuest: totalGuest
              }
              return sendErrorResponse(res, errorResult, 'Capacity Not avalable', 404);
            } else {
              const newExperienceInventory = new ExperienceInventory({
                experienceId: experience.experienceId,
                bookingDate: experience.checkInDate,
                capacity: Number(experienceDetail.maxPerson),
                booked: experience.adults + experience.children
              })
              const saveInve = await newExperienceInventory.save()
            }
          }

        }
      }
      const tripReqBody = {
        hostId: reqBody.hostId,
        userId: reqBody.userId,
        userName: reqBody.userName,
        propertyId: null,
        primaryguestName: reqBody.primaryguestName,
        primaryguestEmail: reqBody.primaryguestEmail,
        primaryguestPhone: reqBody.primaryguestPhone,
        countAdults: reqBody.adults,
        countChildren: reqBody?.children || 0,
        countPet: 0,
        checkInDate: reqBody?.checkInDate || null,
        checkOutDate: reqBody?.checkOutDate || null,
        totalPrice: reqBody?.totalPrice
      }
      const tripBooking = new TripBooking(tripReqBody)
      const saveTripBooking = await tripBooking.save()
      if (saveTripBooking._id) {

        if (reqBody.experienceBooking) {
          for (let experience of reqBody.experienceBooking) {

            experience.tripBookingId = saveTripBooking._id
            const experienceBooking = new ExperienceBooking(experience)
            const saveExperienceBooking = await experienceBooking.save()
            saveTripBooking.experienceBooking = saveExperienceBooking
          }
        }
      }
      if (saveTripBooking._id) {
        const bookingDetail = await TripBooking.findById(saveTripBooking._id)
        const stayBooking = await StayBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.experienceBooking = experienceBooking
        const conveyenceBooking = await ConveyenceBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.conveyenceBooking = conveyenceBooking
        const result = {
          ...bookingDetail._doc,
          stayBooking: stayBooking,
          experienceBooking: experienceBooking,
          conveyenceBooking: conveyenceBooking
        }
        sendSuccessResponse(res, result, 'Booking added successfully');
      } else {
        sendSuccessResponse(res, saveTripBooking, 'Booking added successfully');
      }
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  checkExperienceAvalability: async (req, res, next) => {
    try {
      const reqBody = req.body
      const experienceDetail = await Experience.findById(reqBody.experienceId)
      const capacity = Number(experienceDetail.maxPerson)
      const totalGuest = Number(reqBody.adults) + Number(reqBody.children)
      const experienceInventory = await ExperienceInventory.findOne({ experienceId: reqBody.experienceId, bookingDate: reqBody.checkInDate })

      if (experienceInventory?._id) {
        let totalCapacity = experienceInventory.capacity - experienceInventory.booked
        if (totalGuest > totalCapacity) {
          return sendErrorResponse(res, 'faild', 'experience is not available', 404);
        }
        else {
          // await ExperienceInventory.findByIdAndUpdate(experienceInventory?._id, { booked: totalGuest + experienceInventory.booked })
          sendSuccessResponse(res, 'sucess', 'Avalable Booking');
        }

      } else {
        if (totalGuest > capacity) {
          const errorResult = {
            experienceName: experienceDetail.experienceName,
            availableCapacity: experienceDetail.maxPerson,
            yourTotalGuest: totalGuest
          }
          return sendErrorResponse(res, errorResult, 'experience is not available', 404);
        } else {
          sendSuccessResponse(res, 'sucess', 'Avalable Booking');
        }
      }
      // sendSuccessResponse(res, 'sucess', 'Avalable Booking');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  docuemntVerification: async (req, res, next) => {
    try {
      const reqBody = req.body

      if (req.files) {
        reqBody.documentFrontPhoto = `uploads/${req.files.documentFrontPhoto[0].filename}`;
        reqBody.documentBackPhoto = `uploads/${req.files.documentBackPhoto[0].filename}`;
      }
      const documentUpload = new DocumentVerification(reqBody)
      const documentSave = await documentUpload.save()
      sendSuccessResponse(res, documentSave, 'Document uploaded successfully');
    } catch (error) {
      next(error)
    }
  },

  checkStayAvalablity: async (req, res, next) => {
    try {
      // const reqBody = req.body
      // const stayDetail = await Stay.findById(reqBody.stayId)
      // let bookingDates = getBookingDates(new Date(reqBody.startDate), new Date(reqBody.endDate));
      // for (let i of bookingDates) {
      //   let updateDate = moment(i, 'DD-MM-YYYY').format('YYYY-MM-DD');
      //   const stayInventory = await StayInventory.findOne({ date: updateDate, stayId: stayDetail._id })
      //   const countCapacityTotal = stayDetail.countCapacity * stayDetail.countAvailable
      //   console.log('countCapacityTotal', countCapacityTotal)
      //   console.log('reqBody.adults', Number(reqBody.adults))
      //   if (countCapacityTotal >= Number(reqBody.adults)) {
      //     console.log('in')
      //     sendSuccessResponse(res, 'stay is  available', 'stay is available')
      //   } else {
      //     return sendErrorResponse(res, 'stay is not available', 'stay is not available', 404);
      //   }

      //   if (stayInventory) {
      //     let avalableCapicity = countCapacityTotal - stayInventory.booked
      //     if (Number(reqBody.adults) > avalableCapicity) {
      //       return sendErrorResponse(res, 'stay is not available', 'stay is not available', 404);
      //     } else {
      //       console.log('avalable')
      //       sendSuccessResponse(res, 'stay is  available', 'stay is available')
      //     }
      //   }
      // }
      // sendSuccessResponse(res, 'stay is  available', 'stay is available')

      const reqBody = req.body;
      const stayDetail = await Stay.findById(reqBody.stayId);
      if (!stayDetail) {
        return sendErrorResponse(res, 'Stay not found', 'Stay not found', 404);
      }

      let bookingDates = getBookingDates(new Date(reqBody.startDate), new Date(reqBody.endDate));

      for (let date of bookingDates) {
        let updateDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const stayInventory = await StayInventory.findOne({ date: updateDate, stayId: stayDetail._id });

        const totalCapacity = stayDetail.countCapacity * stayDetail.countAvailable;
        const requestedAdults = Number(reqBody.adults);



        if (totalCapacity < requestedAdults) {
          return sendErrorResponse(res, 'Stay is not available', 'Stay is not available', 404);
        }

        if (stayInventory) {
          let availableCapacity = totalCapacity - stayInventory.booked;
          if (requestedAdults > availableCapacity) {
            return sendErrorResponse(res, 'Stay is not available', 'Stay is not available', 404);
          }
        }

        return sendSuccessResponse(res, 'Stay is available', 'Stay is available');
      }


    } catch (error) {
      console.log('err', error)
      next(error)
    }
  },

  checkStayAvalablityNEw: async (req, res, next) => {
    try {
      const reqBody = req.body
      const stayDetail = await Stay.findById(reqBody.stayId)
      const stayInventory = await StayInventory.findOne({ date: reqBody.startDate, stayId: reqBody.stayId })
      const countCapacityTotal = stayDetail.countCapacity * stayDetail.countAvailable
      if (stayInventory?._id) {
        if (stayInventory.booked >= countCapacityTotal) {
          // sendSuccessResponse(res, 'stay is not available', 'stay is not available')
        } else {
          let avalableCapicity = countCapacityTotal - stayInventory.booked
          if (reqBody.adults < avalableCapicity) {
            let bookingDates = getBookingDates(new Date(reqBody.startDate), new Date(reqBody.endDate));
            for (let i of bookingDates) {
              let updateDate = moment(i, 'DD-MM-YYYY').format('YYYY-MM-DD');
              const stayInv = await StayInventory.findOne({ date: updateDate, stayId: reqBody.stayId })
              if (stayInv?._id) {
                await StayInventory.findByIdAndUpdate(stayInv._id, { booked: stayInv.booked + reqBody.adults })
              } else {
                const newStayInventory = new StayInventory({
                  stayId: reqBody.stayId,
                  date: updateDate,
                  booked: reqBody.adults < countCapacityTotal ? reqBody.adults : countCapacityTotal,
                  capacity: countCapacityTotal,
                })
                await newStayInventory.save()
              }
            }
          }


        }
      } else {
        let bookingDates = getBookingDates(new Date(reqBody.startDate), new Date(reqBody.endDate));
        for (let i of bookingDates) {
          let updateDate = moment(i, 'DD-MM-YYYY').format('YYYY-MM-DD');
          const reqData = {
            stayId: reqBody.stayId,
            date: updateDate,
            booked: reqBody.adults < countCapacityTotal ? reqBody.adults : countCapacityTotal,
            capacity: countCapacityTotal,
          }
          const newStayInventory = new StayInventory(reqData)
          await newStayInventory.save()
        }

      }

      sendSuccessResponse(res, 'documentSave', 'Check Successfully stay avalablity');

    } catch (error) {
      console.log('err', error)
      next(error)
    }
  },

  approveRejectBooking: async (req, res, next) => {
    try {
      const reqBody = req.body;   /// 1 stay, 2 - experience, 3 = event  

      let result
      if (reqBody.bookingType === 1) {
        result = await StayBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })
        const statyDetail = await StayBooking.findById(reqBody.id)
        if (statyDetail) {

          let tripBooking = await TripBooking.findByIdAndUpdate(statyDetail.tripBookingId, { status: 1 })
          if (reqBody.status === 2) {
            let totalPriceStay = 0;
            if (statyDetail.weekendDays > 0) {
              let p =
                statyDetail.perPerson === true
                  ? statyDetail.adults * statyDetail.priceWeekend * statyDetail.weekendDays
                  : statyDetail.priceWeekend * statyDetail.stayCount * statyDetail.weekendDays;
              totalPriceStay = totalPriceStay + p;
            }
            if (statyDetail.regularDays > 0) {
              let p =
                statyDetail.perPerson === true
                  ? statyDetail.adults * statyDetail.priceRegular * statyDetail.regularDays
                  : statyDetail.priceRegular * statyDetail.stayCount * statyDetail.regularDays;
              totalPriceStay = totalPriceStay + p;
            }
            const finalPrice = Number(tripBooking.totalPrice) - Number(totalPriceStay)
            await TripBooking.findByIdAndUpdate(result.tripBookingId, { totalPrice: finalPrice })
          }
        }
      } else if (reqBody.bookingType === 2) {
        result = await ExperienceBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })
        let tripBooking = await TripBooking.findByIdAndUpdate(result.tripBookingId, { status: 1 })
        if (reqBody.status === 2) {
          let totalPriceExperience = 0;
          if (result.isWeekendPrice === true) {
            let p =
              result.perPerson === true
                ? (result.adults + result.children) * result.priceWeekend
                : result.priceWeekend * result.experienceCount;
            totalPriceExperience = totalPriceExperience + p;
          } else {
            let p =
              result.perPerson === true
                ? (result.adults + result.children) * result.priceRegular
                : result.priceRegular * result.experienceCount;
            totalPriceExperience = totalPriceExperience + p;
          }

          const finalPrice = Number(tripBooking.totalPrice) - Number(totalPriceExperience)
          await TripBooking.findByIdAndUpdate(result.tripBookingId, { totalPrice: finalPrice })
        }
        // await TripBooking.findByIdAndUpdate(result.tripBookingId, { status: 1 })
      } else if (reqBody.bookingType === 3) {
        result = await EventBooking.findByIdAndUpdate(reqBody.id, { status: reqBody.status })
        let tripBooking = await TripBooking.findByIdAndUpdate(result.tripBookingId, { status: 1 })
        if (reqBody.status === 2) {
          let totalPriceExperience = 0;
          if (result.isWeekendPrice === true) {
            let p =
              result.perPerson === true
                ? (result.adults + result.children) * result.priceWeekend
                : result.priceWeekend * result.experienceCount;
            totalPriceExperience = totalPriceExperience + p;
          } else {
            let p =
              result.perPerson === true
                ? (result.adults + result.children) * result.priceRegular
                : result.priceRegular * result.experienceCount;
            totalPriceExperience = totalPriceExperience + p;
          }

          const finalPrice = Number(tripBooking.totalPrice) - Number(totalPriceExperience)
          await TripBooking.findByIdAndUpdate(result.tripBookingId, { totalPrice: finalPrice })
        }
      }
      if (reqBody.status === 2) {
        const rejectbooking = new RejectBooking({
          bookingId: reqBody.id,
          rejectReason: reqBody.reason,
          rejectMsg: reqBody.msg
        })
        await rejectbooking.save()
      }  /// status : 0 - pending, 1 - approved, 2 - reject,  3 - checkin, 4 - checkout
      const tripBookingData = await TripBooking.findById(result.tripBookingId)
      let stayFlag = true
      let experienceFlag = true
      let eventFlag = true

      let stayRejectFlag = true
      let experienceRejectFlag = true
      let eventRejectFlag = true

      const checkStatus = (bookings) => {
        return bookings.every(booking => booking.status !== 0);
      };

      const checkRejectedBookingStatus = (bookings) => {
        return bookings.every(booking => booking.status === 2);
      };

      if (tripBookingData) {
        const stayBooking = await StayBooking.find({ tripBookingId: tripBookingData._id })
        if (stayBooking.length > 0) {
          stayFlag = checkStatus(stayBooking)
          stayRejectFlag = checkRejectedBookingStatus(stayBooking)
        }
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: tripBookingData._id })
        if (experienceBooking.length > 0) {
          experienceFlag = checkStatus(experienceBooking)
          experienceRejectFlag = checkRejectedBookingStatus(experienceBooking)
        }
        const addonBooking = await AddonBooking.find({ tripBookingId: tripBookingData._id })
        const eventBooking = await EventBooking.find({ tripBookingId: tripBookingData._id })
        if (eventBooking.length > 0) {
          eventFlag = checkStatus(eventBooking)
          eventRejectFlag = checkRejectedBookingStatus(eventBooking)
        }
        if (stayFlag === true && experienceFlag === true && eventFlag === true) {
          await TripBooking.findByIdAndUpdate(tripBookingData._id, { status: 2 })
        } else {
          console.log('not true all booking status')
        }
        if (reqBody.status === 2) {
          if (stayRejectFlag === true && experienceRejectFlag === true && eventRejectFlag === true) {
            await TripBooking.findByIdAndUpdate(tripBookingData._id, { status: 3 })
          }
        }

      }
      sendSuccessResponse(res, 'success', 'status updated successfully');
    } catch (error) {
      console.log('eeee', error)
      next(error)
    }
  },

  checkEventAvalability: async (req, res, next) => {
    try {
      const reqBody = req.body
      const experienceDetail = await Event.findById(reqBody.experienceId)
      const capacity = Number(experienceDetail?.maxPerson) || 0
      const totalGuest = Number(reqBody.adults) + Number(reqBody.children)
      const experienceInventory = await EventInventory.findOne({ experienceId: reqBody.experienceId, bookingDate: reqBody.checkInDate })
     
      if (experienceInventory?._id) {
        let totalCapacity = experienceInventory.capacity - experienceInventory.booked
        if (totalGuest > totalCapacity) {
          return sendErrorResponse(res, 'faild', 'event is not available', 404);
        }
        else {
          // await ExperienceInventory.findByIdAndUpdate(experienceInventory?._id, { booked: totalGuest + experienceInventory.booked })
          sendSuccessResponse(res, 'sucess', 'event is available');
        }
      } else {

        sendSuccessResponse(res, 'sucess', 'event is available');
      }
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  addEventBooking: async (req, res, next) => {
    try {
      const reqBody = req.body
      if (reqBody.eventBooking) {
        for (let experience of reqBody.eventBooking) {
          const experienceDetail = await Event.findById(experience.experienceId)
          const capacity = Number(experienceDetail?.maxPerson)
          const totalGuest = experience.adults + experience.children
          const experienceInventory = await EventInventory.findOne({ experienceId: experience.experienceId, bookingDate: experience.checkInDate })

          if (experienceInventory?._id) {
            let totalCapacity = experienceInventory.capacity - experienceInventory.booked
            if (totalGuest > totalCapacity) {
              const errorResult = {
                experienceName: experience.experienceName,
                availableCapacity: totalCapacity,
                yourTotalGuest: totalGuest
              }
              return sendErrorResponse(res, errorResult, 'Booking Faild', 404);
            } else {
              await EventInventory.findByIdAndUpdate(experienceInventory?._id, { booked: totalGuest + experienceInventory.booked })

            }

          } else {
            if (totalGuest > capacity) {
              const errorResult = {
                experienceName: experience.experienceName,
                availableCapacity: Number(experienceDetail?.maxPerson),
                yourTotalGuest: totalGuest
              }
              return sendErrorResponse(res, errorResult, 'Capacity Not avalable', 404);
            } else {
              const newExperienceInventory = new EventInventory({
                experienceId: experience.experienceId,
                bookingDate: experience.checkInDate,
                capacity: Number(experienceDetail?.maxPerson),
                booked: experience.adults + experience.children
              })
              const saveInve = await newExperienceInventory.save()
            }
          }

        }
      }
      const tripReqBody = {
        hostId: reqBody.hostId,
        userId: reqBody.userId,
        userName: reqBody.userName,
        propertyId: null,
        primaryguestName: reqBody.primaryguestName,
        primaryguestEmail: reqBody.primaryguestEmail,
        primaryguestPhone: reqBody.primaryguestPhone,
        countAdults: reqBody.adults,
        countChildren: reqBody?.children || 0,
        countPet: 0,
        checkInDate: reqBody?.checkInDate || null,
        checkOutDate: reqBody?.checkOutDate || null,
        totalPrice: reqBody?.totalPrice
      }
      const tripBooking = new TripBooking(tripReqBody)
      const saveTripBooking = await tripBooking.save()
      if (saveTripBooking._id) {

        if (reqBody.eventBooking) {
          for (let experience of reqBody.eventBooking) {
            experience.tripBookingId = saveTripBooking._id
            const experienceBooking = new EventBooking(experience)
            const saveExperienceBooking = await experienceBooking.save()
            saveTripBooking.experienceBooking = saveExperienceBooking
          }
        }
      }
      if (saveTripBooking._id) {
        const bookingDetail = await TripBooking.findById(saveTripBooking._id)
        const stayBooking = await StayBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.experienceBooking = experienceBooking
        const conveyenceBooking = await ConveyenceBooking.find({ tripBookingId: saveTripBooking._id })
        bookingDetail.conveyenceBooking = conveyenceBooking
        const result = {
          ...bookingDetail._doc,
          stayBooking: stayBooking,
          experienceBooking: experienceBooking,
          conveyenceBooking: conveyenceBooking
        }
        sendSuccessResponse(res, result, 'Booking added successfully');
      } else {
        sendSuccessResponse(res, saveTripBooking, 'Booking added successfully');
      }
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },


  getAllTripBookings: async (req, res, next) => {
    try {
      const bookingDetail = await TripBooking.find({ status: 2 }).sort({ _id: "desc" });
      let srNo = 1
      for (let i of bookingDetail) {
        let id = i._id.toString()
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        const host = await User.findById(i.hostId)

        i._doc.hostName = host.name
        i._doc.hostEmail = host.email
        i._doc.hostPhone = host.phone
        i._doc.propertyFullLocation = null
        if (i.propertyId != null) {
          const property = await Property.findById(i.propertyId)
          i._doc.propertyName = property?.propertyName || ''
          i._doc.propertyFullLocation = property?.propertyFullLocation || ''
        }
        const stayBooking = await StayBooking.find({ tripBookingId: id })
        i._doc.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
        i._doc.experienceBooking = experienceBooking
        const eventBooking = await Event.find({ tripBooking: id })
        i._doc.eventBooking = eventBooking
      }
      sendSuccessResponse(res, bookingDetail, 'Booking details fetched successfully');
    } catch (error) {
      console.log('trip-booking-list', error)
      next(error)
    }
  },

  bookingListByForAdmin: async (req, res, next) => {
    try {
      const bookingDetail = await TripBooking.find().sort({ _id: "desc" });
      let srNo = 1
      for (let i of bookingDetail) {
        let id = i._id.toString()
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        const host = await User.findById(i.hostId)

        i._doc.hostName = host.name
        i._doc.hostEmail = host.email
        i._doc.hostPhone = host.phone
        i._doc.propertyFullLocation = null
        i._doc.pendingAmount = i.totalPrice - i.totalPaidAmount
        if (i.propertyId != null) {
          const property = await Property.findById(i.propertyId)
          i._doc.propertyName = property?.propertyName || ''
          i._doc.propertyFullLocation = property?.propertyFullLocation || ''
        }
        const stayBooking = await StayBooking.find({ tripBookingId: id })
        i._doc.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
        i._doc.experienceBooking = experienceBooking
        const eventBooking = await Event.find({ tripBooking: id })
        i._doc.eventBooking = eventBooking
      }
      sendSuccessResponse(res, bookingDetail, 'Booking details fetched successfully');
    } catch (error) {
      console.log('trip-booking-list', error)
      next(error)
    }
  },
  deleteTemporaryTripBookingById: async (req, res, next) => {
    try {
      const deleteTemBooking = await BookingCart.findByIdAndDelete(req.body.id)
      sendSuccessResponse(res, deleteTemBooking, 'Temporary booking deleted successfully');
    } catch (error) {
      next(error)
    }
  },

  addExperienceBookingInTemporary: async (req, res, next) => {
    try {
      const reqBody = req.body
      reqBody.userId = req.body.booking.userId
      reqBody.hostId = req.body.booking.hostId
      const existBookingInCart = await ExperienceBookingTemporary.findOne({ userId: reqBody.userId, hostId: reqBody.hostId })
      let bookingId
      if (existBookingInCart?._id) {
        await ExperienceBookingTemporary.findByIdAndUpdate(existBookingInCart._id, reqBody)
        bookingId = existBookingInCart?._id
      } else {
        const bookingCart = new ExperienceBookingTemporary(reqBody)
        const saveBookingCart = await bookingCart.save()
        bookingId = saveBookingCart._id
      }
      const booking = await ExperienceBookingTemporary.findById(bookingId)
      sendSuccessResponse(res, booking, 'Booking Added in cart');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  getTemporaryExperienceBookingByUserAndHostId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const existBookingInCart = await ExperienceBookingTemporary.findOne({ userId: reqBody.userId, hostId: reqBody.hostId })

      sendSuccessResponse(res, existBookingInCart, 'Temporary Booking Fetched');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  getTemporaryExperienceBookingById: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await ExperienceBookingTemporary.findById(reqBody.id)
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  deleteExperienceBookingById: async (req, res, next) => {
    try {
      const deleteTemBooking = await ExperienceBookingTemporary.findByIdAndDelete(req.body.id)
      sendSuccessResponse(res, deleteTemBooking, 'Temporary booking deleted successfully');
    } catch (error) {
      next(error)
    }
  },


  addEventBookingInTemporary: async (req, res, next) => {
    try {
      const reqBody = req.body
      reqBody.userId = req.body.booking.userId
      reqBody.hostId = req.body.booking.hostId
      const existBookingInCart = await EventBookingTemporary.findOne({ userId: reqBody.userId, hostId: reqBody.hostId })
      let bookingId
      if (existBookingInCart?._id) {
        await EventBookingTemporary.findByIdAndUpdate(existBookingInCart._id, reqBody)
        bookingId = existBookingInCart?._id
      } else {
        const bookingCart = new EventBookingTemporary(reqBody)
        const saveBookingCart = await bookingCart.save()
        bookingId = saveBookingCart._id
      }
      const booking = await EventBookingTemporary.findById(bookingId)
      sendSuccessResponse(res, booking, 'Booking Added in cart');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },
  getTemporaryEventBookingByUserAndHostId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const existBookingInCart = await EventBookingTemporary.findOne({ userId: reqBody.userId, hostId: reqBody.hostId })

      sendSuccessResponse(res, existBookingInCart, 'Temporary Booking Fetched');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  getTemporaryEventBookingById: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await EventBookingTemporary.findById(reqBody.id)
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  deleteEventBookingById: async (req, res, next) => {
    try {
      const deleteTemBooking = await EventBookingTemporary.findByIdAndDelete(req.body.id)
      sendSuccessResponse(res, deleteTemBooking, 'Temporary booking deleted successfully');
    } catch (error) {
      next(error)
    }
  },

  getAllTemporaryExperienceBookingByUserId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await ExperienceBookingTemporary.find({ userId: reqBody.userId })
      for(let i of bookingCart){
        const experience = await Experience.findById(i.booking.experienceBooking[0].experienceId)
        i._doc.experienceName = experience.experienceName
      }
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  getAllTemporaryEventBookingByUserId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const bookingCart = await EventBookingTemporary.find({ userId: reqBody.userId })
      const data = bookingCart.eventBooking
      for(let i of bookingCart){
        const experience = await Event.findById(i.booking.eventBooking[0].experienceId)
        i._doc.experienceName = experience.experienceName
      }
      sendSuccessResponse(res, bookingCart, 'Temporary Trip Booking Fetched');
    } catch (error) {
      next(error)
    }
  },

  getAllTripBookingsByUserID: async (req, res, next) => {
    try {
      const bookingDetail = await TripBooking.find({ userId: req.body.userId }).sort({ _id: "desc" });
      let srNo = 1
      for (let i of bookingDetail) {
        let id = i._id.toString()
        i._doc.srNo = srNo;
        srNo++;
        i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
        const host = await User.findById(i.hostId)

        i._doc.hostName = host.name
        i._doc.hostEmail = host.email
        i._doc.hostPhone = host.phone
        i._doc.propertyFullLocation = null
        if (i.propertyId != null) {
          const property = await Property.findById(i.propertyId)
          i._doc.propertyName = property.propertyName
          i._doc.propertyFullLocation = property.propertyFullLocation
        }
        const stayBooking = await StayBooking.find({ tripBookingId: id })
        i._doc.stayBooking = stayBooking
        const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
        i._doc.experienceBooking = experienceBooking
        const eventBooking = await Event.find({ tripBooking: id })
        i._doc.eventBooking = eventBooking
      }
      sendSuccessResponse(res, bookingDetail, 'Booking details fetched successfully');
    } catch (error) {
      next(error)
    }
  },

  upcomingTripBookingByUserID: async (req, res, next) => {
    try {
      const bookingDetail = await TripBooking.find({ userId: req.body.userId }).sort({ _id: "desc" });
      const currentDate = new Date();
      // const bookingDetail = await TripBooking.find({userId: req.body.userId, checkInDate: { $gte: currentDate } }).sort('checkInDate');
      if (bookingDetail.length > 0) {
        let srNo = 1
        for (let i of bookingDetail) {
          let id = i._id.toString()
          i._doc.srNo = srNo;
          srNo++;
          i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
          const host = await User.findById(i.hostId)

          i._doc.hostName = host.name
          i._doc.hostEmail = host.email
          i._doc.hostPhone = host.phone
          i._doc.propertyFullLocation = null
          if (i.propertyId != null) {
            const property = await Property.findById(i.propertyId)
            i._doc.propertyName = property.propertyName
            i._doc.propertyFullLocation = property.propertyFullLocation
          }
          const stayBooking = await StayBooking.find({ tripBookingId: id })
          i._doc.stayBooking = stayBooking
          const allDates = []
          for (let i of stayBooking) {
            if (i.checkInDate) {
              allDates.push(i.checkInDate)
            }
          }
          const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
          for (let i of experienceBooking) {
            if (i.checkInDate) {
              allDates.push(i.checkInDate)
            }
          }
          i._doc.experienceBooking = experienceBooking

          const eventBooking = await EventBooking.find({ tripBookingId: id })
          for (let i of eventBooking) {
            if (i.checkInDate) {
              allDates.push(i.checkInDate)
            }
          }

          const validDates = allDates
            .filter(date => date !== null)          // Remove null values
            .map(date => new Date(date));
          const earliestDate = new Date(Math.min(...validDates));

          i._doc.eventBooking = eventBooking
          i._doc.allDates = allDates
          i._doc.earliestDate = earliestDate
          const today = new Date()
          const timeDifference = earliestDate - today;
          const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          i._doc.remainingDays = remainingDays
        }
      }

      
      // const filteredBookings = bookingDetail.filter(booking => new Date(booking.earliestDate) >= currentDate);
      sendSuccessResponse(res, bookingDetail, 'Booking details fetched successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  pastTripByUserID: async (req, res, next) => {
    try {
      const bookingDetail = await TripBooking.find({ userId: req.body.userId }).sort({ _id: "desc" });
      const currentDate = new Date();
      // const bookingDetail = await TripBooking.find({userId: req.body.userId, checkInDate: { $gte: currentDate } }).sort('checkInDate');
      if (bookingDetail.length > 0) {
        let srNo = 1
        for (let i of bookingDetail) {
          let id = i._id.toString()
          i._doc.srNo = srNo;
          srNo++;
          i._doc.createdAt = moment(i.createdAt).format('DD-MM-YYYY');
          const host = await User.findById(i.hostId)

          i._doc.hostName = host.name
          i._doc.hostEmail = host.email
          i._doc.hostPhone = host.phone
          i._doc.propertyFullLocation = null
          if (i.propertyId != null) {
            const property = await Property.findById(i.propertyId)
            i._doc.propertyName = property.propertyName
            i._doc.propertyFullLocation = property.propertyFullLocation
          }
          const stayBooking = await StayBooking.find({ tripBookingId: id })
          i._doc.stayBooking = stayBooking
          const allDates = []
          for (let i of stayBooking) {
            if (i.checkInDate) {
              allDates.push(i.checkInDate)
            }
          }
          const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
          for (let i of experienceBooking) {
            if (i.checkInDate) {
              allDates.push(i.checkInDate)
            }
          }
          i._doc.experienceBooking = experienceBooking

          const eventBooking = await EventBooking.find({ tripBookingId: id })
          for (let i of eventBooking) {
            if (i.checkInDate) {
              allDates.push(i.checkInDate)
            }
          }

          const validDates = allDates
            .filter(date => date !== null)          // Remove null values
            .map(date => new Date(date));
          const earliestDate = new Date(Math.min(...validDates));

          i._doc.eventBooking = eventBooking
          i._doc.allDates = allDates
          i._doc.earliestDate = earliestDate
          const today = new Date()
          const timeDifference = earliestDate - today;
          const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          i._doc.remainingDays = remainingDays
        }
      }

      // const filteredBookings = bookingDetail.filter(booking => new Date(booking.earliestDate) >= currentDate);
      sendSuccessResponse(res, bookingDetail, 'Booking details fetched successfully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },
  // autoRejectedTripBooking: async(req, res, next)=>{
  //   try {
  //       const tripBookings = await TripBooking.find({status: 0})

  //       if(tripBookings.length>0){
  //         for(let trip of tripBookings){
  //             // console.log('trip', trip)
  //             let id = trip._id.toString()
  //             const stayBooking = await StayBooking.find({ tripBookingId: id })
  //             if(stayBooking.length>0){
  //               for(let item of stayBooking){
  //                 if(item.status===0){
  //                   let isOlder = isOlderThan48Hours(item.createdAt)
  //                   console.log('isOlder', isOlder)
  //                   if(isOlder===true){
  //                     console.log('item', item)
  //                   }
  //                 }
  //               }
  //             }
  //             const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
  //             const eventBooking = await EventBooking.find({ tripBookingId: id })
  //             const addonBooking = await AddonBooking.find({tripBookingId: id})
  //         }
  //       }

  //       sendSuccessResponse(res, tripBookings, 'Booking details fetched successfully');
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  autoRejectedTripBooking: async (req, res, next) => {
    try {
      const tripBookings = await TripBooking.find({ status: 0 })

      if (tripBookings.length > 0) {
        for (let trip of tripBookings) {
          let id = trip._id.toString()
          const stayBooking = await StayBooking.find({ tripBookingId: id })
          if (stayBooking.length > 0) {
            for (let statyDetail of stayBooking) {
              if (statyDetail.status === 0) {
                let isOlder = isOlderThan48Hours(statyDetail.createdAt)
                if (isOlder === true) {
                  let totalPriceStay = 0;
                  if (statyDetail.weekendDays > 0) {
                    let p =
                      statyDetail.perPerson === true
                        ? statyDetail.adults * statyDetail.priceWeekend * statyDetail.weekendDays
                        : statyDetail.priceWeekend * statyDetail.stayCount * statyDetail.weekendDays;
                    totalPriceStay = totalPriceStay + p;
                  }
                  if (statyDetail.regularDays > 0) {
                    let p =
                      statyDetail.perPerson === true
                        ? statyDetail.adults * statyDetail.priceRegular * statyDetail.regularDays
                        : statyDetail.priceRegular * statyDetail.stayCount * statyDetail.regularDays;
                    totalPriceStay = totalPriceStay + p;
                  }
                  await StayBooking.findByIdAndUpdate(statyDetail._id, { isAutoRejected: true, status: 2 })
                  const finalPrice = Number(trip.totalPrice) - Number(totalPriceStay)
                  await TripBooking.findByIdAndUpdate(trip._id, { totalPrice: finalPrice })
                }
              }
            }
          }
          const experienceBooking = await ExperienceBooking.find({ tripBookingId: id })
          if (experienceBooking.length > 0) {
            for (let item of experienceBooking) {
              if (item.status === 0) {
                let isOlder = isOlderThan48Hours(item.createdAt)
                if (isOlder === true) {
                  let totalPriceExperience = 0;
                  if (item.isWeekendPrice === true) {
                    let p =
                      item.perPerson === true
                        ? (item.adults + item.children) * item.priceWeekend
                        : item.priceWeekend * item.experienceCount;
                    totalPriceExperience = totalPrice + p;
                  } else {
                    let p =
                      item.perPerson === true
                        ? (item.adults + item.children) * item.priceRegular
                        : item.priceRegular * item.experienceCount;
                    totalPriceExperience = totalPrice + p;
                  }
                  await ExperienceBooking.findByIdAndUpdate(item._id, { isAutoRejected: true, status: 2 })
                  const finalPrice = Number(trip.totalPrice) - Number(totalPriceExperience)
                  await TripBooking.findByIdAndUpdate(trip._id, { totalPrice: finalPrice })
                }
              }
            }
          }
          const eventBooking = await EventBooking.find({ tripBookingId: id })
          if (eventBooking.length > 0) {
            for (let item of eventBooking) {
              if (item.status === 0) {
                let isOlder = isOlderThan48Hours(item.createdAt)
                if (isOlder === true) {
                  let totalPriceEvent = 0;
                  if (item.isWeekendPrice === true) {
                    let p =
                      item.perPerson === true
                        ? (item.adults + item.children) * item.priceWeekend
                        : item.priceWeekend * item.experienceCount;
                    totalPriceEvent = totalPrice + p;
                  } else {
                    let p =
                      item.perPerson === true
                        ? (item.adults + item.children) * item.priceRegular
                        : item.priceRegular * item.experienceCount;
                    totalPriceEvent = totalPrice + p;
                  }
                  await EventBooking.findByIdAndUpdate(item._id, { isAutoRejected: true, status: 2 })
                  const finalPrice = Number(trip.totalPrice) - Number(totalPriceEvent)
                  await TripBooking.findByIdAndUpdate(trip._id, { totalPrice: finalPrice })
                }
              }
            }
          }
          const addonBooking = await AddonBooking.find({ tripBookingId: id })
        }
      }

      sendSuccessResponse(res, tripBookings, 'Booking Status Updated Auto Reject successfully');
    } catch (error) {
      next(error)
    }
  },
  rating: async (req, res, next) => {
    try {
      const reqBody = req.body
      const rating = new Rating(reqBody)
      await rating.save()
      sendSuccessResponse(res, rating, 'Rating Added sussefully');
    } catch (error) {
      next(error)
    }
  },

  refundPayment: async (req, res, next) => {
    try {
      const reqBody = req.body
      const tripBooking = await TripBooking.findById(reqBody.tripBookingId)
      if (tripBooking?._id) {
        const transaction = await Transaction.findOne({ tripBookingId: tripBooking._id })
        if (transaction?._id) {
          let paymentId = transaction.razorpay_payment_id
          let amount = reqBody.refundAmount
          const timestamp = new Date().valueOf();
          const refund = await razorpay.payments.refund(paymentId, {
            // razorpay.payments.refund(paymentId,{
            "amount": amount,
            "speed": "normal",
            "notes": {
              "notes_key_1": "Beam me up Scotty.",
              "notes_key_2": "Engage"
            },
            "receipt": `Receipt No. ${timestamp}`

          })
          if (refund?.id) {
            refund.tripBookingId = reqBody.tripBookingId
            refund.refund_id = refund.id
            const refundTransaction = new RefundTransaction(refund)
            await refundTransaction.save()
            sendSuccessResponse(res, refund, 'Refund Amount Added sussefully');
          } else {
            sendErrorResponse(res, refund, 'Refund Amount Added sussefully');
          }


        }
      }

      // sendSuccessResponse(res, refund, 'Refund Amount Added sussefully');
    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  extendStay: async (req, res, next) => {
    try {
      const reqBody = req.body

      const stayBooking = await StayBooking.findById(reqBody.id)

      if (stayBooking?._id) {
        const stayDetail = await Stay.findById(stayBooking.stayId)
        const tripBooking = await TripBooking.findById(stayBooking.tripBookingId)

        let bookingDates = getBookingDates(new Date(stayBooking.checkOutDate), new Date(reqBody.extendDate));
    
        if (bookingDates.length > 0) {
          for (let i of bookingDates) {
            let bookingDate = moment(i, 'DD-MM-YYYY').format('YYYY-MM-DD');
            const stayInventory = await StayInventory.findOne({ date: bookingDate, stayId: stayDetail._id })
            if (stayInventory?._id) {
              const avalableCapicity = stayInventory.capacity - stayInventory.booked
           
              if (avalableCapicity === 0) {
                return sendErrorResponse(res, 'No more rooms available for the selected date')
              }
              if (stayBooking.adults > avalableCapicity) {
                return sendErrorResponse(res, 'No more rooms available for the selected date')
              }
            }
          }

          const checkInCheckOutDays = getDaysCheckInAndCheckOutDates(stayBooking.checkInDate, reqBody.extendDate)
          const extendedCheckInCheckOutDays = getDaysCheckInAndCheckOutDates(stayBooking.checkOutDate, reqBody.extendDate)

          let weekendDays = checkInCheckOutDays.weekendCount
          let regularDays = checkInCheckOutDays.regularCount
          let extendStayBooking = await StayBooking.findByIdAndUpdate(stayBooking._id, {
            checkOutDate: new Date(reqBody.extendDate),
            regularDays: regularDays,
            weekendDays: weekendDays,
            stayDay: regularDays + weekendDays
          })
          if (extendStayBooking?._id) {
            let totalPriceStay = 0;
            if (extendedCheckInCheckOutDays.weekendDays > 0) {
              let p =
                extendStayBooking.perPerson === true
                  ? extendStayBooking.adults * extendStayBooking.priceWeekend * extendStayBooking.weekendDays
                  : extendStayBooking.priceWeekend * extendStayBooking.stayCount * extendStayBooking.weekendDays;
              totalPriceStay = totalPriceStay + p;
            }
            if (extendedCheckInCheckOutDays.regularDays > 0) {
              let p =
                extendStayBooking.perPerson === true
                  ? extendStayBooking.adults * extendStayBooking.priceRegular * extendStayBooking.regularDays
                  : extendStayBooking.priceRegular * extendStayBooking.stayCount * extendStayBooking.regularDays;
              totalPriceStay = totalPriceStay + p;
            }
            const finalPrice = Number(tripBooking.totalPrice) - Number(totalPriceStay)
            await TripBooking.findByIdAndUpdate(extendStayBooking.tripBookingId, { totalPrice: finalPrice })
            for (let bookingDate of bookingDates) {
              let date = moment(bookingDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
              const stayInventory = await StayInventory.findOne({ date: date, stayId: stayBooking.stayId })
              if (stayInventory) {
                await StayInventory.findByIdAndUpdate(stayInventory._id, { booked: stayInventory.booked + stayBooking.adults })
              } else {
                const countCapacityTotal = stayDetail.countCapacity * stayDetail.countAvailable
                const newStayInventory = new StayInventory({
                  stayId: stayBooking.stayId,
                  date: date,
                  booked: stayBooking.adults < countCapacityTotal ? stayBooking.adults : countCapacityTotal,
                  capacity: countCapacityTotal,
                })
                await newStayInventory.save()
              }
            }
            return sendSuccessResponse(res, extendStayBooking, 'Stay Booking Extended Successfully')
          }
        } else {
          return sendSuccessResponse(res, 'extendStayBooking', 'Stay Booking Extended Successfully')
        }

      }

    } catch (error) {
      console.log('error', error)
      next(error)
    }
  },

  verifyDocumentListByTripId: async (req, res, next) => {
    try {
      const reqBody = req.body
      const documentVerification = await DocumentVerification.find({ tripBookingId: reqBody.tripId })
      return sendSuccessResponse(res, documentVerification, 'Document Verification List')
    } catch (error) {
      next(error)
    }
  },

  collectBookingAmount: async (req, res, next) => {
    try {
      const reqBody = req.body
      const transaction = new Transaction({ tripBookingId: reqBody.tripBookingId, amount: reqBody.payingAmount, paymentBy: 'Host App' })
      await transaction.save()
      if (transaction._id) {
        await TripBooking.findByIdAndUpdate(reqBody.tripBookingId, { isCollectAmount: true, totalPaidAmount: reqBody.totalPaidAmount })
      }
      return sendSuccessResponse(res, transaction, 'Transaction Created Successfully')
    } catch (error) {
      next(error)
    }
  }
}



export default BookingController;


