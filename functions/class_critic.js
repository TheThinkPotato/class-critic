const ratingItemsCount = 6;

function calculateScores(ratings) {
  let communication = 0;
  let participation = 0;
  let qualityOfWork = 0;
  let teamWork = 0;
  let punctual = 0;
  let attitude = 0;
  let totalRating = 0;
  let ratingCount = 0;

  for (let i = 0; i < ratings.length; i++) {
    communication += parseInt(ratings[i].ratings.communication);
    participation += parseInt(ratings[i].ratings.participation);
    qualityOfWork += parseInt(ratings[i].ratings.qualityOfWork);
    teamWork += parseInt(ratings[i].ratings.teamWork);
    punctual += parseInt(ratings[i].ratings.punctual);
    attitude += parseInt(ratings[i].ratings.attitude);
    ratingCount += 1;
  }

  communication = communication / ratingCount;
  participation = participation / ratingCount;
  qualityOfWork = qualityOfWork / ratingCount;
  teamWork = teamWork / ratingCount;
  punctual = punctual / ratingCount;
  attitude = attitude / ratingCount;

  totalRating =
    (communication +
      participation +
      qualityOfWork +
      teamWork +
      punctual +
      attitude) /
    ratingItemsCount;

  return {
    student: ratings[0].lookupName,
    communication,
    participation,
    qualityOfWork,
    teamWork,
    punctual,
    attitude,
    totalRating,
  };
}

module.exports = { calculateScores };
