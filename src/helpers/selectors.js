export function getAppointmentsForDay(state, day){
  const result = [];
  // finding the object in our state.days array who's name matches the provided day
  const dailyAppointmentIds = [];
  for (let dayData of state.days) {
    if (dayData.name === day) {
      console.log(dayData);
      dailyAppointmentIds.push(...dayData.appointments)
    }
  }
  console.log(dailyAppointmentIds)
  if (!dailyAppointmentIds) {
    return [];
  }
  //go through appointments and use the ids we just grabbed
  for (let id of dailyAppointmentIds) {
    result.push(state.appointments[id]);
  }
  return result;
}


export function getInterview(state, interview){
  
  console.log(`interview is: `, interview)
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