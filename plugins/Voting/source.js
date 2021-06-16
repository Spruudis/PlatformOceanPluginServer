const BasePlugIn = require("../../Plugin APIs/plug-in_base");
// const config = require('./config');

class majorityBallotBox{

    #ballotBox
    #isBallotOpen
    #saveVoterSocketID
    #intermediaryResultAccess


    constructor(voteName,
                voteDescription,
                voteOutcomes,
                authenticationCallback,
                saveVoterSocketID = false,
                intermediaryResultAccess = false,
                voteTimeout = null
                )
    {
        this.voteName = voteName;
        this.voteDescription = voteDescription;
        this.authenticationCallback = authenticationCallback;
        this.voteTimeout = voteTimeout;

        this.#isBallotOpen = null;
        this.#saveVoterSocketID = saveVoterSocketID;
        this.#intermediaryResultAccess = intermediaryResultAccess;
        this.#ballotBox = {}

        voteOutcomes.forEach( outcome => {
            if(saveVoterSocketID){
                this.#ballotBox[outcome] = []
            }else{
                this.#ballotBox[outcome] = 0;
            }
        })
    }

    castVote(voteChoice, socketID){
        //Check if ballot is open
        if(this.#isBallotOpen){
            //Check if provided voting option is valid
            if(voteChoice in this.#ballotBox){
                if(this.#saveVoterSocketID){
                    if(socketID !== undefined){
                        this.#ballotBox[voteChoice].push(socketID);
                        return true;
                    }

                }else{
                   this.#ballotBox[voteChoice]++;
                   return true;
                }
                return false;
            }
            return false;
        }
        return false;
    }

    get result(){
        if(this.#isBallotOpen === null){
            return
        }

        if(this.#isBallotOpen === true){
            if(this.#intermediaryResultAccess){
                return this.#ballotBox
            }
        }

        if(this.#isBallotOpen === true){
            return this.#ballotBox
        }
    }

    get saveVoterSocketID(){
        return this.#saveVoterSocketID;
    }

    get isBallotOpen(){
        return this.#isBallotOpen;
    }

    openBallot(){
        this.#isBallotOpen = true;
    }

    closeBallot(){
        this.#isBallotOpen = false;
        return this.#ballotBox
    }

}



class Voting extends BasePlugIn{

    #ballotBoxes

    constructor(parentObject) {
        super(parentObject);
        this.#ballotBoxes = {};

        this.registerHook("createVote", (data) => {

            if(data[0].voteName in this.#ballotBoxes){
                console.log("Voting: attempt to create a vote named",
                    data[0].voteName,
                    "failed as a vote by that name already exists");
                return data;
            }

            //TODO: options for other systems of voting
            this.#ballotBoxes[data[0].voteName] = new majorityBallotBox(
                data[0].voteName,
                data[0].voteDescription,
                data[0].voteOutcomes,
                data[0].authenticationCallback,
                data[0].saveVoterSocketID,
                data[0].intermediaryResultAccess,
                data[0].voteTimeout
            )
            return data;
        })

        this.registerHook("startVote", (data) => {
            return new Promise((resolve, reject) => {
                //Check if the vote has been created
                if(!(data[0].voteName in this.#ballotBoxes)){
                    console.log("Voting: attempt to start a vote named",
                        data[0].voteName,
                        "failed as a vote by that name has not been created");
                    reject(data);
                }

                this.#ballotBoxes[data[0].voteName].openBallot();

                this.eventProxy.emit(
                    'debug message',
                    "Voting for " + data[0].voteName + " is now open")

                //If the vote has a timeout, start the clock
                if(this.#ballotBoxes[data[0].voteName].voteTimeout !== null){
                    setInterval(() => {
                        if(this.#ballotBoxes[data[0].voteName].isBallotOpen){
                            const result = this.#ballotBoxes[data[0].voteName].closeBallot();
                            this.eventProxy.emit(
                                'debug message',
                                "The vote " +
                                data[0].voteName +
                                " has elapsed, the results are: \n"
                                + JSON.stringify(result));
                        }
                    }, this.#ballotBoxes[data[0].voteName].voteTimeout);
                }
                resolve();
            })
        })

        this.subscribeToEvent('Vote', eventProxyResponder => {
            const voteName = eventProxyResponder.eventMessage[0];
            const voteChoice = eventProxyResponder.eventMessage[1];

            //Check if vote exists
            if(!(voteName in this.#ballotBoxes)){
                eventProxyResponder.respondToSender('debug message', "The vote " + voteName + " is not available");
                return
            }

            //Ask vote creator whether the user is permitted to participate in the vote
            this.#ballotBoxes[voteName].authenticationCallback(voteName, eventProxyResponder)
                .then(result => {
                    if(result !== true){
                        eventProxyResponder.respondToSender('debug message', "You are not permitted to cast a ballot for the vote " + voteName);
                        return
                    }

                    const success = this.#ballotBoxes[voteName].castVote(voteChoice, eventProxyResponder.socketID)
                    if(success){
                        eventProxyResponder.respondToSender('debug message', "Your vote has been cast " + voteName);
                    } else {
                        eventProxyResponder.respondToSender('debug message', "Your vote has failed. Is voting open?");
                    }
                })
        })

        this.registerHook("endVote", data => {
            return new Promise((resolve, reject) => {
                if(!(data[0].voteName in this.#ballotBoxes)){
                    console.log("Voting: attempt by Hook to end a vote named",
                        data[0].voteName,
                        "failed as a vote by that name is not present");
                    reject(data);
                }

                //close -> delete ballotBox -> return

                //TODO: Make better output

                if(this.#ballotBoxes[data[0].voteName].isBallotOpen){
                    const result = this.#ballotBoxes[data[0].voteName].closeBallot();
                    this.eventProxy.emit(
                        'debug message',
                        "The vote " +
                        data[0].voteName +
                        " has been closed, the results are: \n"
                        + JSON.stringify(result));

                    delete this.#ballotBoxes[data[0].voteName];
                    resolve(result)
                }
            })
        })

    }




}

module.exports = Voting;