import firebase from 'firebase';
import { AppointmentStatusToastify } from '../components/CommonModule/toastNotification';
import { commonUtilFunction } from './commonUtilFunction';
import {
  LOCALFIRESTORECONFIG,
  PRODFIRESTORECONFIG,
} from '../util/configurations';

export const firestoreService = {
  signIn,
  makeChatGroupList,
  makeUnReadMessageList,
  updateConversation,
  sendMessageToFirestore,
  newAppointmentBookingMessageToFirestore,
  sendCancelAppointmentToFirestoreMessage,
  updateDataOnGroup,
  createNewUser,
  logOutFirestoreUser,
};
function initializeFirestore() {
  if (!firebase.apps.length) {
    console.log('NODE_ENV', process.env, process.env.NODE_ENV);
    console.log(
      'window.location',
      window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('dev')
    );
    let configSetting =
      window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('dev')
        ? LOCALFIRESTORECONFIG
        : PRODFIRESTORECONFIG;
    firebase.initializeApp(configSetting);
  }
}

function createNewUser(email, password) {
  initializeFirestore();
  return firebase.auth().createUserWithEmailAndPassword(email, password);
  // .then((userRecord) => {

  //   var uid = userRecord.uid;
  //   let loginUser =firebase.auth().currentUser;
  //   console.log('user Created',email,password,loginUser.uid)

  // })
  // .catch((error) => {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   console.log('user Created failed',errorCode,errorMessage)
  // });
}

function logOutFirestoreUser() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('firestore Sign-out successful.');
    })
    .catch((error) => {
      console.log(' firestore An error happened. while logout');
    });
}

function signIn(email, password) {
  initializeFirestore();
  if (!password) {
    password = commonUtilFunction.dummyEncrypt(email);
  }
  return firebase.auth().signInWithEmailAndPassword(email, password);
  // .then((userCredential) => {
  //   // Signed in
  //   var user = userCredential.user;

  //   // const messageBody = {
  //   //   fromUser: "lagamad323@omibrown.com",
  //   //   message: 'newMessage',
  //   //   toUser: 'genkanri@mayimed.com',
  //   //   isToast: true,
  //   //   appointmentStatus: "booked",
  //   // };

  //   // sendMessageToFirestore('P212_D84', messageBody);
  //   // ...
  // })
  // .catch((error) => {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   if(errorCode="auth/wrong-password"){

  //   }
  // });
}

function makeChatGroupList(
  identifier,
  moduleId,
  setChatGroupList,
  setUpdateChatGroupListTrigger,
  setAddedNewUpdateChatGroupListTrigger
) {
  let temp = {};
  // for creating all groups where moduleId = doctor id / patient id, identifier = patientId / doctorId
  let initialRender = false; // for stopping first time render for onSnapshot evert triggering
  let db = firebase.firestore();
  db.collection('groups')
    .where(identifier, '==', moduleId)
    .onSnapshot((snapshot) => {
      initialRender &&
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            // temp[change.doc.id]={lastMessageTimeStamp:"change.doc._document.proto.updateTime"}
            //     setChatGroupList(temp);
          }
          if (change.type === 'modified') {
            const {
              // patientEmailId,
              // doctorEmailId,
              lastMessageContent,
              // lastMessageDocID,
              lastMessageFromUserId,
              lastMessageIsRead,
              lastMessageTimeStamp,
              lastMessageToUserId,
            } = change.doc.data();
            let isNewlyAdded = !temp[change.doc.id];
            temp[change.doc.id] = {
              lastMessageContent,
              lastMessageToUserId,
              lastMessageIsRead,
              lastMessageTimeStamp: lastMessageTimeStamp
                .toDate()
                .toLocaleString(),
            };
            setChatGroupList(temp);
            isNewlyAdded &&
              setAddedNewUpdateChatGroupListTrigger((preValue) => preValue + 1);
            if (
              (!lastMessageIsRead && lastMessageFromUserId === moduleId) ||
              lastMessageIsRead
            )
              setUpdateChatGroupListTrigger((preValue) => preValue + 1);
          }
        });
    });

  db.collection('groups') // getting all message for firtst time at one hit
    .where(identifier, '==', moduleId)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((current) => {
        const { id } = current;
        const {
          // patientEmailId,
          // doctorEmailId,
          lastMessageContent,
          // lastMessageDocID,
          // lastMessageFromUserId,
          lastMessageIsRead,
          lastMessageTimeStamp,
          lastMessageToUserId,
        } = current.data();
        temp[id] = {
          lastMessageContent,
          lastMessageToUserId,
          lastMessageIsRead,
          lastMessageTimeStamp: lastMessageTimeStamp.toDate().toLocaleString(),
        };
      });
      setChatGroupList(temp);
      setAddedNewUpdateChatGroupListTrigger((preValue) => preValue + 1);
      initialRender = true;
    });
}

function makeUnReadMessageList(
  chatGroupList,
  currentModuleId,
  setUnReadMessageList,
  setTrigger
) {
  let temp = {};
  let isChange = false;
  Object.keys(chatGroupList).forEach((currentGroup) => {
    firebase
      .firestore()
      .collection('groups')
      .doc(currentGroup)
      .collection('messages')
      .where('isRead', '==', false)
      .where('toUser', '==', currentModuleId)
      .onSnapshot((snapshot) => {
        // var source = snapshot.metadata.hasPendingWrites ? 'Local' : 'Server';
        snapshot.docChanges().forEach((change) => {
          const { offset, segments } = change.doc._key.path;
          let groupId = segments[offset + 1];
          if (change.type === 'added') {
            !temp[groupId] && (temp[groupId] = []);
            const {
              // appointmentStartTime,
              // firebaseTimeStamp,
              // fromUser,
              // isRead,
              isToast,
              message,
              appointmentStatus,
            } = change.doc.data();
            if (isToast) {
              AppointmentStatusToastify(message, appointmentStatus); // to show new notification messages
              change.doc.ref.update({
                isToast: false,
              });
            }
            temp[groupId].push(message);
            isChange = true;
          }
          if (change.type === 'modified') {
            console.log(change.doc.data());
          }
          if (change.type === 'removed') {
            delete temp[groupId];
            isChange = true;
          }
        });
        if (isChange) {
          setUnReadMessageList(temp);
          setTrigger((prev) => prev + 1);
          isChange = false;
        }
      });
  });
}

function updateConversation(
  currentSelectedGroup,
  currentModuleId,
  setChatMessages
) {
  initializeFirestore();
  let initialRender = false; // for stoping first time render with onSnapshot event

  let unsubscribe = firebase
    .firestore()
    .collection('groups')
    .doc(currentSelectedGroup)
    .collection('messages')
    .onSnapshot((snapshot) => {
      // var source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
      initialRender &&
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            setChatMessages((preMessages) => [
              ...preMessages,
              change.doc.data(),
            ]);
            commonUtilFunction.smoothScroll('chat-list');
            const { isRead, toUser } = change.doc.data();
            if (!isRead && toUser === currentModuleId) {
              change.doc.ref.update({
                // for changing isRead :true in message collection
                isRead: true,
              });
              updateDataOnGroup(currentSelectedGroup, {
                // for chanding lastMessageIsRead:true in group collection
                lastMessageIsRead: true,
              });
            }
          }
          if (change.type === 'modified') {
            const { isRead, fromUser, firebaseTimeStamp } = change.doc.data();
            let tempMilisecond = firebaseTimeStamp.toMillis();
            if (isRead && fromUser === currentModuleId) {
              setChatMessages((preState) => {
                // logic is for setting blue checked for read messages suggestion : to isRead : true to all without checking index
                let tempState = Object.assign([], preState);
                let tempIndex = tempState.findIndex(
                  (c) => c.firebaseTimeStamp.toMillis() === tempMilisecond
                );
                tempIndex > -1 && (tempState[tempIndex].isRead = true);
                return tempState;
              });
            }
          }
          if (change.type === 'removed') {
          }
        });
    });

  firebase
    .firestore()
    .collection('groups')
    .doc(currentSelectedGroup)
    .collection('messages')
    .orderBy('firebaseTimeStamp')
    .get()
    .then((querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((doc) => {
        const { isRead, toUser } = doc.data();
        if (!isRead && toUser === currentModuleId) {
          doc.ref.update({
            isRead: true,
          });
          updateDataOnGroup(currentSelectedGroup, {
            // for chanding lastMessageIsRead:true in group collection
            lastMessageIsRead: true,
          });
          let tempData = doc.data();
          tempData.isRead = true;
          temp.push(tempData);
        } else temp.push(doc.data());
      });
      setChatMessages(temp);
      commonUtilFunction.smoothScroll('chat-list');
      initialRender = true;
    });

  return unsubscribe;
}

function newAppointmentBookingMessageToFirestore(
  appointmentDetails,
  tempSlotConsultationId,
  doctor,
  props
) {
  // sending new appoinment booking creation message
  const { chatGroupList, currentPatient } = props;
  const {
    // appointmentMode,
    doctorId,
    // endTime,
    // id = tempSlotConsultationId,
    patientId,
    remarks,
    startTime,
    // status,
    // type,
    // urgency,
  } = appointmentDetails;
  let chatGroupId = `P${patientId}_D${doctorId}`;
  let groupExist = Object.keys(chatGroupList).includes(chatGroupId);
  const patientFullName = commonUtilFunction.getFullName(currentPatient);
  const doctorFullName = commonUtilFunction.getFullName(doctor);
  const newMessage = `Patient ${patientFullName} booked appointment with Doctor ${doctorFullName} on ${new Date(
    startTime
  ).toDateString()} at ${new Date(
    startTime
  ).toLocaleTimeString()} \n chat message 2h prior of the beginning of appointment and up to 2 days later ${remarks}`.trim();

  const { email: doctorEmailId } = doctor;
  const { email: patientEmailId } = currentPatient;

  const messageBody = {
    fromUser: patientEmailId,
    message: newMessage,
    toUser: doctorEmailId,
    isToast: true,
    appointmentStatus: 'booked',
  };

  sendMessageToFirestore(chatGroupId, messageBody);

  !groupExist && // checking for already present group or create new group
    firebase
      .firestore()
      .collection('groups')
      .doc(chatGroupId)
      .set({
        patientEmailId,
        doctorEmailId,
      });
}

function sendCancelAppointmentToFirestoreMessage(
  appointmentDetails,
  cancelledByModule,
  currentModuleDetails
) {
  const { patientId, doctorId } = appointmentDetails;
  let chatGroupId = `P${patientId}_D${doctorId}`;
  let cancelledMessage = `The appointment was cancelled by ${cancelledByModule}, ${commonUtilFunction.getFullName(
    currentModuleDetails
  )}`;
  // const {email:doctorEmailId}=doctor;
  // const {email:patientEmailId}=currentPatient;
  let senderInfo;
  if (cancelledByModule === 'patient') {
    senderInfo = {
      fromUser: currentModuleDetails.email,
      toUser: appointmentDetails.doctor.email,
    };
  } else {
    senderInfo = {
      fromUser: currentModuleDetails.email,
      toUser: appointmentDetails.patient.email,
    };
  }

  const messageBody = {
    ...senderInfo,
    message: cancelledMessage,
    isToast: true,
    appointmentStatus: 'Cancelled',
  };
  sendMessageToFirestore(chatGroupId, messageBody);
}

function sendMessageToFirestore(currentSelectedGroup, messageBody) {
  //sending message to firestore
  messageBody.firebaseTimeStamp = firebase.firestore.Timestamp.fromDate(
    new Date()
  ); // adding 2 value for each new message send
  messageBody.isRead = false;
  firebase
    .firestore()
    .collection('groups')
    .doc(currentSelectedGroup)
    .collection('messages')
    .add(messageBody)
    .then((response) => {
      const {
        // appointmentStatus,
        firebaseTimeStamp,
        fromUser,
        toUser,
        isRead,
        message,
        // idToast,
      } = messageBody;
      const groupMessageBody = {
        lastMessageContent: message,
        lastMessageDocID: response.id,
        lastMessageFromUserId: fromUser,
        lastMessageIsRead: isRead,
        lastMessageTimeStamp: firebaseTimeStamp,
        lastMessageToUserId: toUser,
      };
      updateDataOnGroup(currentSelectedGroup, groupMessageBody);
    })
    .catch((error) => {
      console.log('Error unsubscribing from topic:', error);
    });
}

function updateDataOnGroup(chatGroupId, messageBody) {
  firebase
    .firestore()
    .collection('groups')
    .doc(chatGroupId)
    .update(messageBody);
}
