const Match = require("../models/Match");
import moment from "moment";

export interface MatchEntity {
  _id: string;
  nickname: string;
  time: number;
  createdAt: string;
  updatedAt: string;
  rank?: number;
}

/**
 * Metodo per il recupero della lista completa dei Match
 * ordinata per 'time' e 'createdAt';
 */
const retrieveMatchesListOrderByTime = (req: any, res: any, next: any) => {
  const page: number = parseInt(req.query.page) || 1;
  const elementsForEachPage: number = 5;

  Match.countDocuments()
    .then((totalCount: number) => {
      return Match.find()
        .sort({ time: 1, createdAt: 1 })
        .skip((page - 1) * elementsForEachPage)
        .limit(elementsForEachPage)
        .then((response: MatchEntity[]) => {
          const totalPages: number = Math.ceil(totalCount / elementsForEachPage);
          res.json({
            response,
            currentPage: page,
            elementsPerPage: elementsForEachPage,
            totalElements: totalCount,
            totalPages: totalPages,
          });
        });
    })
    .catch((error: any) => {
      return res.status(500).send("An Error Occurred!");
    });
};

/**
 * Metodo per il recupero di un singolo Match;
 */
const retrieveSingleMatchByID = (req: any, res: any, next: any) => {
  let matchID = req.query.id;
  Match.findById(matchID)
    .then((response: MatchEntity) => {
      res.json({
        response,
      });
    })
    .catch((error: any) => {
      return res.status(500).send("An Error Occurred!");
    });
};

/**
 * Metodo per il recupero di un singolo Match attraverso
 * il 'nickname' della persona. Query necessaria a stabilire
 * se il 'nickname' che sta inserendo il nuovo giocatore
 * è 'univoco' nel DB;
 */
const retrieveSingleMatchByNickname = (req: any, res: any, next: any) => {
  let matchNickname = req.body.nickname;
  Match.findOne({ nickname: matchNickname })
    .then((response: MatchEntity) => {
      res.json({
        response,
      });
    })
    .catch((error: any) => {
      return res.status(500).send("An Error Occurred!");
    });
};

/**
 * Salvataggio di un nuovo singolo Match;
 */
const storeNewMatch = (req: any, res: any, next: any) => {
  let matchToStore = new Match({
    nickname: req.body.nickname,
    time: req.body.time,
  });

  matchToStore
    .save()
    .then((savedMatch: MatchEntity) => {
      res.json({
        matchId: savedMatch._id,
      });
    })
    .catch((error: any) => {
      return res.status(500).send("An Error Occurred!");
    });
};

/**
 * Metodo per il recupero di un singolo Match tramite 'id'.
 * Recupero comprensivo dei tre Match antecedenti e ai tre match
 * successivi a esso;
 */
const retrievePartialRanking = async (req: any, res: any, next: any) => {
  const matchId = req.query.id;

  Match.find()
    .sort({ time: 1, createdAt: 1 })
    .then((allObjects: any[]) => {
      const allMatches: MatchEntity[] = allObjects
        .map((object: any) => object._doc)
        .map((objectData: any) => {
          return {
            _id: objectData._id.toString(),
            nickname: objectData.nickname,
            time: objectData.time,
            createdAt: moment(objectData.createdAt).toISOString(),
            updatedAt: moment(objectData.updatedAt).toISOString(),
          };
        });
      const matchIndex: number = allMatches.findIndex((match: MatchEntity) => {
        const newMatch: MatchEntity = { ...match };
        const newMatchId: string = newMatch._id;
        return newMatchId === matchId;
      });
      if (matchIndex === -1) {
        return res.status(404).send("Match not found!");
      }
      const beforeMatches: MatchEntity[] = allMatches.slice(Math.max(0, matchIndex - 3), matchIndex);
      const afterMatches: MatchEntity[] = allMatches.slice(matchIndex + 1, Math.min(allMatches.length, matchIndex + 4));
      const response: { response: MatchEntity[] } = {
        response: [
          ...beforeMatches.map((match: MatchEntity, index: number) => ({
            _id: match._id,
            nickname: match.nickname,
            time: match.time,
            rank: matchIndex - 3 + index + 1,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
          })),
          {
            ...allMatches[matchIndex],
            rank: matchIndex + 1,
          },
          ...afterMatches.map((match: MatchEntity, index: number) => ({
            _id: match._id,
            nickname: match.nickname,
            time: match.time,
            rank: matchIndex + 2 + index,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
          })),
        ],
      };
      res.json({ ...response });
    })
    .catch((error: any) => {
      return res.status(500).send("An Error Occurred!");
    });
};

module.exports = {
  storeNewMatch,
  retrieveSingleMatchByID,
  retrievePartialRanking,
  retrieveSingleMatchByNickname,
  retrieveMatchesListOrderByTime,
};
