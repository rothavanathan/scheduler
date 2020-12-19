export function getAppointmentsForDay(state, day){
  const dailyInfo = state.days.find(dayData => dayData.name === day);

  if (!dailyInfo || !dailyInfo.appointments) {
    return [];
  }

  const result = dailyInfo.appointments.map(id => state.appointments[id])
  return result;
}


export function getInterviewersForDay(state, day){
  const dailyInfo = state.days.find(dayData => dayData.name === day);

  if (!dailyInfo || !dailyInfo.interviewers) {
    return [];
  }

  const result = dailyInfo.interviewers.map(id => state.interviewers[id])
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

