export function getAppointmentsForDay(state, day){
  const result = [];
  // finding the object in our state.days array who's name matches the provided day
  const dailyAppointmentIds = [];
  for (let dayData of state.days) {
    if (dayData.name === day) {
      dailyAppointmentIds.push(...dayData.appointments)
    }
  }
  if (!dailyAppointmentIds) {
    return [];
  }
  //go through appointments and use the ids we just grabbed
  for (let id of dailyAppointmentIds) {
    result.push(state.appointments[id]);
  }
  return result;
}


export function getInterviewersForDay(state, day){
  const result = [];
  // finding the object in our state.days array who's name matches the provided day parameter
  const dailyInterviewersIds = [];
  for (let dayData of state.days) {
    if (dayData.name === day) {
      //store the interviewers id numbers from the days interviewer array
      dailyInterviewersIds.push(...dayData.interviewers)
    }
  }
  //if the day's interviewer array is empty return empty array
  if (!dailyInterviewersIds) {
    return result;
  }
  
  //go through appointments and use the ids we just grabbed
  for (let id of dailyInterviewersIds) {
    if (!id) {
      result.push(undefined);
    } else {
      result.push(state.interviewers[id]);
    }
  }
  return result;
}

export function getInterview(state, interview){
  if (!interview) {
    return null;
  }
  const interviewerId = interview.interviewer;
  //grab interviewer object from state that matches id
  const result = {
    ...interview,
    interviewer: {
      ...state.interviewers[interviewerId]
    }
  }
  return result;
}

