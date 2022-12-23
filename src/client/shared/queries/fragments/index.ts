export const CLUB_FRAGMENT = `
  id
  name
  color
`

export const USER_FRAGMENT = `
  id
  name
  isSuper
  isAdmin
  club {
    id
    name
    color
  }
`

export const EVENT_FRAGMENT = `
  id
  title
  start
  end
  startTime
  endTime
  startRecur
  endRecur
  daysOfWeek
  groupId
  allDay
  isRental
  color
  desc
  club {
    ${CLUB_FRAGMENT}
  }
  creator {
    ${USER_FRAGMENT}
  }
`
