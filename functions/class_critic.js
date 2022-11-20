const ratingItemsCount = 6;

function calculateScores(ratings) {
  let communication = 0;
  let attendance = 0;
  let workmanship = 0;
  let focus = 0;
  let organization = 0;
  let niceness = 0;
  let totalRating = 0;
  let ratingCount = 0;

  for (let i = 0; i < ratings.length; i++) {
    communication += parseInt(ratings[i].ratings.communication);
    attendance += parseInt(ratings[i].ratings.attendance);
    workmanship += parseInt(ratings[i].ratings.workmanship);
    focus += parseInt(ratings[i].ratings.focus);
    organization += parseInt(ratings[i].ratings.organization);
    niceness += parseInt(ratings[i].ratings.niceness);
    ratingCount += 1;
  }

  communication = communication / ratingCount;
  attendance = attendance / ratingCount;
  workmanship = workmanship / ratingCount;
  focus = focus / ratingCount;
  organization = organization / ratingCount;
  niceness = niceness / ratingCount;

  totalRating =
    (communication +
      attendance +
      workmanship +
      focus +
      organization +
      niceness) /
    ratingItemsCount;

  return {
    student: ratings[0].lookupName,
    communication,
    attendance,
    workmanship,
    focus,
    organization,
    niceness,
    totalRating,
  };
}

module.exports = { calculateScores };
