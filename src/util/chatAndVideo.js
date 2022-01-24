import { getModulesDetailsByIds, getMyAppointmentListbyModule } from "../service/frontendapiservices";
import { commonUtilFunction } from "./commonUtilFunction";

export const chatAndVideoService = {
  getAllModuleDetails,
  isAppoinmentTimeUnderActiveCondition,
};

function getAllModuleDetails(chatGroupList, moduleToFind, currentModuleId, setStateHook) {
  const moduleToFindIdList = [];
  let index = moduleToFind === "doctors" ? 1 : 0;
  Object.keys(chatGroupList).forEach((current) => {
    const moduleId = parseInt(current.split("_")[index].substring(1));
    if (!moduleToFindIdList.includes(moduleId)) {
      moduleToFindIdList.push(moduleId);
    }
  });
  if (moduleToFindIdList.length) {
    const tempObject = {};
    const payloadIdForCurrentModule = moduleToFind === "doctors" ? "patientId" : "doctorId";
    try {
      Promise.allSettled([
        getModulesDetailsByIds(moduleToFindIdList, moduleToFind),
        getMyAppointmentListbyModule({ [payloadIdForCurrentModule]: currentModuleId, endTime: commonUtilFunction.addDaysToDate(1), startTime: commonUtilFunction.addDaysToDate(-3) }),
      ]).then(([res1, res2]) => {
        if(res1.status==='fulfilled' ){
        const { [moduleToFind]: moduleName } = res1.value.data;
        moduleName.forEach((current) => {
          let chatGroupName = moduleToFind === "doctors" ? `P${currentModuleId}_D${current.id}` : `P${current.id}_D${currentModuleId}`;
          tempObject[chatGroupName] = { ...current };
        });
      }
      if(res2.status==='fulfilled'){
        res2.value.data.forEach((current) => {
          const { doctorId, endTime, id, startTime, patientId, unifiedAppointment } = current;
          let chatGroupName = `P${patientId}_D${doctorId}`;
          !tempObject[chatGroupName] && (tempObject[chatGroupName]={});
          !tempObject[chatGroupName]["appointmentDetails"] && (tempObject[chatGroupName]["appointmentDetails"] = {});
          if (unifiedAppointment.toLowerCase().includes("follow")) {
            tempObject[chatGroupName]["appointmentDetails"][unifiedAppointment] = { startTime, endTime };
          } else {
            !tempObject[chatGroupName]["appointmentDetails"][unifiedAppointment] && (tempObject[chatGroupName]["appointmentDetails"][unifiedAppointment] = {});
            if (unifiedAppointment.includes(`-${id}#`)) tempObject[chatGroupName]["appointmentDetails"][unifiedAppointment]["endTime"] = endTime;
            // for enter only end time
            else tempObject[chatGroupName]["appointmentDetails"][unifiedAppointment]["startTime"] = startTime;
          }
        });
      }

        setStateHook(tempObject);
    });
    } catch (error) {
      console.error(`Error during get ${moduleToFind} Details By Ids api:`, error);
    }
  }
}

function isAppoinmentTimeUnderActiveCondition(appointmentDetailsObject, setActiveButton) {
  // chat  -2hour +72 hours
  // video -2min +10 min
  // let currentState={chatButton:false,videoButton:true};
  
  let timeNowUtc = Date.now(); // time in UTC now
  const chatTiming = { before: -2 * 60 * 60 * 1000, after: 72 * 60 * 60 * 1000 };
  const videoTiming = {
    before: -2 * 60 * 1000,
    after: 10 * 60 * 1000,
  };


  // TestendTime=
  // appointmentDetailsObject = {
  //   "2294#FOLLOW_UP": {
  //     startTime: "2021-09-15T20:49:00Z",
  //     endTime: "2021-09-15T20:38:00Z",
  //   },
  // };



  let chatButton;
  let videoButton;
  Object.keys(appointmentDetailsObject).forEach((current) => { //logic for first time checking chat and video button based on above timing
    const { endTime, startTime } = appointmentDetailsObject[current];
    const appointmentStartTimeInutc = new Date(startTime).getTime(); // change startTime: "2021-09-15T20:49:00Z" to milisecon utc 88383828838382
    const appointmentEndTimeInutc = new Date(endTime).getTime();
    chatButton = chatButton || appointmentStartTimeInutc + chatTiming.before <= timeNowUtc && timeNowUtc <= appointmentEndTimeInutc + chatTiming.after;
    videoButton = videoButton || appointmentStartTimeInutc + videoTiming.before <= timeNowUtc && timeNowUtc <= appointmentEndTimeInutc + videoTiming.after;
  });
  setActiveButton({ chatButton, videoButton }); // function to set active or deactive button for showing 

  let nearestTriggeringMilisecond = Object.values(appointmentDetailsObject).reduce((accumulator, current) => { //logic for finding nearest milisecond to rerender chat and video button based on upcoming timesequence
    const { startTime, endTime } = current;
    const appointmentStartTimeInutc = new Date(startTime).getTime();
    const appointmentEndTimeInutc = new Date(endTime).getTime();

    [
      appointmentStartTimeInutc + chatTiming.before - timeNowUtc,
      appointmentEndTimeInutc + chatTiming.after - timeNowUtc,
      appointmentStartTimeInutc + videoTiming.before - timeNowUtc,
      appointmentEndTimeInutc + videoTiming.after - timeNowUtc,
    ].forEach((c) => {
      if (c > 0 && c < accumulator) {
        accumulator = c;
      }
    });
    return accumulator;
  }, timeNowUtc);
  // nearestTriggeringMilisecond === time in milisecond for next nearest time for active or deactivation

  if (nearestTriggeringMilisecond != timeNowUtc) return nearestTriggeringMilisecond;
}
