class Game

	host: String (mongoId),
	hostName: String,
	waitingToPlay: Boolean,
	name: String,
	targetSize: Number,
	players: player{}[]
		loyalty: String ['good', 'evil'],
		character: String enum:['Servant of Arthur', 'Minion of Mordred', etc]
		onQuest: boolean
		hasBeenLadyOfTheLake: boolean
	usePercival: Boolean,
	useMorgana: Boolean,
	useOberon: Boolean,
	useMordred: Boolean,
	useLady: Boolean,
	turnOrder: playerFirebaseKeys[],
	quests: Quests[],
		playersNeeded: Number,
		toFail: Number,
		questNumber: Number,
		result: String enum['fail', 'success']
	loyalScore: Number,
	evilScore: Number,
	currentPlayerTurn: player{},
	currentLadyOfTheLake: player{},
	currentGamePhase: String 
		enum:
		['team building', 'team voting', 'quest voting', 
		'using lady', 'guess merlin', 'end - evil wins',
		'end - evil guessed merlin', 'end - good wins'],
	currentVoteTrack: Number,
	currentTurnIdx: Number,
	currentQuestIdx: Number,
	currentQuestPlayersNeeded: Number,
	currentQuestPlayersGoing: players{}
	currentQuestToFail: Number,
	currentQuestApproves: Number,
	currentQuestRejects: Number,
	currentQuestSuccess: Number,
	currentQuestFail: Number,
	previousQuestSuccess: Number,
	previousQuestFail: Number
	merlinGuess: player{}
