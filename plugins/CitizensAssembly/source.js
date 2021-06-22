const path = require('path');
const basePath = path.join(process.cwd(),"Plugin APIs/plug-in_base")
const BasePlugIn = require(basePath);


const CA_ROLES = Object.freeze({
    INITIATOR: {
        NAME: "Initiator",
        DESCRIPTION: "A member of the group that initiates the citizen's assembly. The group is responsible for appointing" +
            "the Oversight Panel and the Advisory Board as well as running the selection of the Coordinating Group and " +
            "the Advisory Board, Setting the Task and Delivering the results of the assembly to the governing agency" +
            "enabling the prescribed policy."},

    COORDINATOR: {
        NAME: "Coordinator",
        DESCRIPTION: "A citizens’ assembly is run by a team of coordinators whose impartiality is essential. Their independence from " +
            "those funding the process is safeguarded by a series of checks and balances, such as the oversight panel. These " +
            "coordinators are responsible for conducting the process of random selection and inviting experts, stakeholders " +
            "and facilitators."},

    ADVISORY_BOARD_MEMBER: {
        NAME: "Advisory Board Member",
        DESCRIPTION: "The advisory board develops key criteria for the selection of the expert/stakeholder panel. It also ensures, with " +
            "the help of the oversight panel, that the background material and evidence presented to a citizens’ assembly is " +
            "balanced. The advisory board may be composed in different ways, for example, in the Irish Citizens’ Assembly " +
            "the board comprised academics and practitioners across a number of specific fields of interest. "},

    EXPERT_OR_STAKEHOLDER: {
        NAME: "Expert/Stakeholder",
        DESCRIPTION: "These are a mixture of experts, stakeholders and rights-holders who brief the assembly on their perspective. " +
            "They are invited by the coordinating group based on criteria set by the advisory board to ensure fair and " +
            "broad representation of opinion. Assembly members also have input and are asked whether there are specific " +
            "questions they would like answered or particular groups or individuals they would like to hear from. They " +
            "also have the chance to cross-question panel members at the assembly itself."},

    FACILITATOR: {
        NAME: "Facilitator",
        DESCRIPTION: "A team of facilitators is appointed by the coordinators. In every session during the citizens’ assembly a facilitator " +
            "sits at each table with assembly members. The role of the facilitation team is to ensure that the deliberation " +
            "is not dominated by a vocal few and that everyone has a chance to speak. This role should be carried out by " +
            "experienced practitioners who can ensure that the deliberation environment is respectful. The team should be " +
            "impartial and sufficiently large to adequately support the number of assembly members. The facilitators will " +
            "not have the opportunity to voice their own opinion."},

    OVERSIGHT_PANEL_MEMBER: {
        NAME: "Oversight Panel Member",
        DESCRIPTION: "The oversight panel can be made up of citizens, representatives of government, rights-holders (representatives " +
            "of those whose rights are under threat, such as grassroots campaigns), technical experts in deliberative " +
            "processes and other stakeholders such as NGOs and corporations. The role of this body is to monitor the whole " +
            "process ensuring its compliance with standards."},

    ASSEMBLY_MEMBER: {
        NAME: "Assembly Member",
        DESCRIPTION: "Assembly members are responsible for understanding, deliberating and selecting the appropriate " +
            "policy for the task of the citizen's assembly"},

    MEMBER_OF_THE_PUBLIC: {
        NAME: "Member of the Public",
        DESCRIPTION: "Any group or individual in society can make a written submission " +
            "to the citizens’ assembly. This evidence will be publicly available online, but also " +
            "summarised and presented to the assembly members. Members will also have " +
            "the right to request to hear in person from any of these groups."},

    INVITED_MEMBER_OF_THE_PUBLIC: {
        NAME: "Invited Member of the Public",
        DESCRIPTION: "A member of the public that has made a written submission to the assembly and has been invited " +
            "by the assembly members to voice their opinions during the deliberation phase."
    }

})

const PERMISSIONS = {
    MESSAGING: "Messaging",
    VOTING_CONTROL: "Voting Control",
    VOTING: "Voting",
    ADVANCE_CA_STAGE: "Advance citizen's assembly stage",

    APPOINT_OVERSIGHT_PANEL_MEMBER: "Appoint advisory board member",
    SET_TASK: "Set task",
    APPOINT_COORDINATING_GROUP_MEMBER: "Appoint coordinating group",
    APPOINT_ADVISORY_BOARD_MEMBER: "Appoint advisory board member",
    SET_POLICY_FRAMEWORK: "Set policy framework",
    SET_EXPERT_SELECTION_CRITERIA: "Set expert selection criteria",
    ASSIGN_EXPERT_ROLE: "Assign expert, stakeholder or rights holder role",
    DESIGN_ASSEMBLY_PROCESS: "Design assembly process",
    APPOINT_FACILITATOR: "Appoint facilitator",
    SET_BRIEFING_MATERIALS: "Set briefing materials",
    ASSEMBLY_MEMBER_SORTITION: "Assembly member sortition",
    PUBLISH_MATERIALS: "Publish materials",
    VOICE_EXPERT_OPINION: "Voice expert opinion",
    MAKE_WRITTEN_SUBMISSION: "Make written submission",
    INVITE_MEMBER_OF_PUBLIC: "Invite a member of the public",

    ALTER_PERMISSION: "Alter permission"
}

const CA_STAGES = Object.freeze({
    0: {NAME: "Startup",
        DESCRIPTION: "CitizensAssembly server startup stage. " +
            "This Stage is automatically advanced once the server is started."},

    1: {NAME: "Appointment of Oversight Panel",
        DESCRIPTION: "This oversight panel monitors " +
            "the entire process and the other bodies in order to make sure that the citizens " +
            "assembly is balanced and robust and that the principles of its design are followed.",
        PERMISSIONS: {  "Initiator": [  PERMISSIONS.APPOINT_OVERSIGHT_PANEL_MEMBER,
                                        PERMISSIONS.ADVANCE_CA_STAGE,
                                        PERMISSIONS.ALTER_PERMISSION,
                                        PERMISSIONS.MESSAGING,

                                        PERMISSIONS.VOICE_EXPERT_OPINION]}},


    2: {NAME: "Setting the Task",
        DESCRIPTION: "The person or group that initiates a citizens’ assembly can set the " +
            "question. In doing this, they must ensure that the question is clearly formulated " +
            "and adequately addresses the issue at hand. An explanation of how and when \n" +
            "the government will respond to the recommendations should be clear and be provided alongside the task.",
        PERMISSIONS: {  "Initiator": [              PERMISSIONS.SET_TASK,
                                                    PERMISSIONS.ADVANCE_CA_STAGE,
                                                    PERMISSIONS.ALTER_PERMISSION,
                                                    PERMISSIONS.MESSAGING],

                        "Oversight Panel Member":[  PERMISSIONS.MESSAGING]}},

    3: {NAME: "Appointment of the Coordinating Group and Advisory Board",
        DESCRIPTION:
            "The process is separated into two phases: \n" +
            "A. Appointment of the Coordinating Group\n" +
            "B. Appointment of the Advisory Board\n" ,
        PHASES: {
            A: {NAME: "Appointment of the Coordinating Group",
                DESCRIPTION: "The coordinators must be selected through an open and competitive tendering process. Safeguards " +
                    "must be in place to ensure that powerful stakeholders, such as the government, are not able to influence " +
                    "the selection process by appointing a team of coordinators to act in their interests.",
                PERMISSIONS: {
                    "Initiator": [              PERMISSIONS.APPOINT_COORDINATING_GROUP_MEMBER,
                                                PERMISSIONS.ADVANCE_CA_STAGE,
                                                PERMISSIONS.ALTER_PERMISSION,
                                                PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[  PERMISSIONS.MESSAGING]}},
            B: {NAME: "Appointment of the Advisory Board",
                DESCRIPTION: "The advisory board may be composed in different ways, for example, in the Irish Citizens’ Assembly " +
                    "the board comprised academics and practitioners across a number of specific fields of interest.",
                PERMISSIONS: {
                    "Initiator": [              PERMISSIONS.APPOINT_ADVISORY_BOARD_MEMBER,
                                                PERMISSIONS.ADVANCE_CA_STAGE,
                                                PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[  PERMISSIONS.MESSAGING]}},
            }
        },


    4: {NAME: "The Evidence Base",
        DESCRIPTION: "The coordinating group, in contact with the " +
            "advisory board, work to develop a clear, comprehensive policy framework " +
            "in order to structure the evidence, deliberation and decisions. In the case " +
            "of a citizens’ assembly on climate and ecological justice, this might mean " +
            "developing feasible alternative policies within specific sectors.",
        PERMISSIONS: {
            "Initiator": [                      PERMISSIONS.ALTER_PERMISSION,
                                                PERMISSIONS.MESSAGING],

            "Oversight Panel Member":[          PERMISSIONS.MESSAGING],

            "Coordinator": [                    PERMISSIONS.SET_POLICY_FRAMEWORK,
                                                PERMISSIONS.ADVANCE_CA_STAGE,
                                                PERMISSIONS.MESSAGING],

            "Advisory Board Member": [          PERMISSIONS.SET_POLICY_FRAMEWORK,
                                                PERMISSIONS.MESSAGING]}
        },

    5: {NAME: "Inviting experts and stakeholders",
        DESCRIPTION: "",
        PHASES:{
            A: {NAME: "Advisory board presents criteria",
                DESCRIPTION: "The advisory board identifies and outlines a set of criteria for the" +
                    "selection of experts, stakeholders and rights-holders.",
                PERMISSIONS: {
                    "Initiator": [                  PERMISSIONS.ALTER_PERMISSION,
                                                    PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[      PERMISSIONS.MESSAGING],

                    "Coordinator": [                PERMISSIONS.ADVANCE_CA_STAGE,
                                                    PERMISSIONS.MESSAGING],

                    "Advisory Board Member": [      PERMISSIONS.SET_EXPERT_SELECTION_CRITERIA,
                                                    PERMISSIONS.MESSAGING]}},
            B: {NAME: "Coordinators identify and assign experts",
                DESCRIPTION: "The coordinating group " +
                    "identifies and contacts experts, stakeholders and rights-holders based on " +
                    "the key criteria outlined by the advisory board.",
                PERMISSIONS: {
                    "Initiator": [                  PERMISSIONS.ALTER_PERMISSION,
                                                    PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[      PERMISSIONS.MESSAGING],

                    "Coordinator": [                PERMISSIONS.ADVANCE_CA_STAGE,
                                                    PERMISSIONS.MESSAGING,
                                                    PERMISSIONS.ASSIGN_EXPERT_ROLE],

                    "Advisory Board Member": [      PERMISSIONS.MESSAGING]}},
            },
        },

    6: {NAME: "Designing the assembly process",
        DESCRIPTION: "The coordinating group designs the" +
            "following phases: \n" +
            "A. Learning phase\n" +
            "B. Consultation phase\n" +
            "C. Deliberation phase\n" +
            "D. Decisions",
        PERMISSIONS: {
            "Initiator": [                  PERMISSIONS.ALTER_PERMISSION,
                                            PERMISSIONS.MESSAGING],

            "Oversight Panel Member":[      PERMISSIONS.MESSAGING],

            "Coordinator": [                PERMISSIONS.ADVANCE_CA_STAGE,
                                            PERMISSIONS.MESSAGING,
                                            PERMISSIONS.DESIGN_ASSEMBLY_PROCESS],

            "Advisory Board Member": [      PERMISSIONS.MESSAGING]}
        },

    7: {NAME: "Appointment of the Facilitator Team",
        DESCRIPTION: "A team of facilitators is appointed by the coordinators.",
        PERMISSIONS: {
            "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                        PERMISSIONS.MESSAGING],

            "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

            "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                        PERMISSIONS.MESSAGING,
                                        PERMISSIONS.APPOINT_FACILITATOR],

            "Advisory Board Member": [  PERMISSIONS.MESSAGING]}
    },

    8: {NAME: "Creation of briefing materials",
        DESCRIPTION: "With guidance from the advisory board " +
            "the expert and stakeholder panel creates accessible and balanced background " +
            "materials to be presented to the assembly members.",
        PERMISSIONS: {
            "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                        PERMISSIONS.MESSAGING],

            "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

            "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                        PERMISSIONS.MESSAGING],

            "Advisory Board Member": [  PERMISSIONS.MESSAGING],

            "Expert/Stakeholder": [     PERMISSIONS.MESSAGING,
                                        PERMISSIONS.SET_BRIEFING_MATERIALS]}
    },

    9: {NAME: "Selection of assembly members by sortition",
        DESCRIPTION: "First, a large database of " +
            "residents is identified. A certain number of these people are randomly selected " +
            "from the database and invitations are sent out. The invitation explains the " +
            "task and provides details about logistics as to how the assembly will take place. Coordinators" +
            " set out basic socio-demographic criteria (i.e, gender, age, ethnicity, education " +
            "level and geography) that will govern the stratified random sampling algorithm." +
            "Interested citizens complete a form " +
            "either online or via freephone providing the basic socio-demographic criteria to the " +
            "coordinators. Coordinators provide details on the demographic composition of the population. " +
            "A subset of the interested population is selected so that the percentage of assembly seats " +
            "reserved for a subgroup reflects the percentage of that subpopulation.",
        PERMISSIONS: {
            "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                        PERMISSIONS.MESSAGING],

            "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

            "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                        PERMISSIONS.MESSAGING,
                                        PERMISSIONS.ASSEMBLY_MEMBER_SORTITION]}
    },

    10: {NAME: "Running the assembly",
        DESCRIPTION: "In addition to the 4 phases of running the assembly, the coordinating group should produce a " +
            "report explaining the methodology used in the citizens’ assembly to ensure procedural transparency. " +
            "In Platform Ocean this could include a publication of the log of activities created by a plugin",
        PHASES: {
            A: {
                NAME: "Learning phase",
                DESCRIPTION: "The coordinating group presents the information " +
                    "that assembly members will need to understand the issues at hand. This includes " +
                    "consideration of the number of presentations that will be needed from different " +
                    "experts, stakeholders and rights-holders. Assembly members will learn about " +
                    "critical thinking and bias detection before hearing balanced and comprehensive " +
                    "information on the issue, including key terms and background science (e.g. about " +
                    "the rate and implications of the climate crisis). Then they’ll be presented with a " +
                    "range of opinions and evidence on policy options. Assembly members can invite " +
                    "and ‘cross-examine’ additional experts",
                PHASES:{
                    A: {NAME: "Introduction sub-phase",
                        DESCRIPTION: "The coordinating group presents information on critical thinking, bias detection," +
                            "as well as outlines the organisational structure of the assembly. The available" +
                            "policy options are clearly outlined.",
                        PERMISSIONS: {
                            "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                                        PERMISSIONS.MESSAGING],

                            "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

                            "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                                        PERMISSIONS.MESSAGING,
                                                        PERMISSIONS.PUBLISH_MATERIALS],

                            "Assembly Member": [        PERMISSIONS.MESSAGING]}
                    },
                    B: {NAME: "Background sub-phase",
                        DESCRIPTION: "Experts present the briefing materials that include background knowledge needed" +
                            "to successfully understand the issues at hand. Questions can be raises concerning the " +
                            "background briefing materials.",
                        PERMISSIONS: {
                            "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                                        PERMISSIONS.MESSAGING],

                            "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

                            "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                                        PERMISSIONS.MESSAGING,
                                                        PERMISSIONS.PUBLISH_MATERIALS],
                            "Assembly Member": [        PERMISSIONS.MESSAGING],

                            "Expert/Stakeholder": [     PERMISSIONS.MESSAGING]}
                    },
                    C: {NAME: "Expert, stake-holder and right-holder opinion and evidence presentation sub-phase",
                        DESCRIPTION:  "The experts, stake-holders and rights-holders take turns to present their opinions and" +
                        "evidence on policy options. Discussions take place with each expert and assembly members " +
                            "can invite other experts, stake-holders and rights-holders to participate in the discussion.",
                        PERMISSIONS: {
                            "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                                        PERMISSIONS.MESSAGING],

                            "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

                            "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                                        PERMISSIONS.MESSAGING],

                            "Assembly Member": [        PERMISSIONS.MESSAGING],

                            "Expert/Stakeholder": [     PERMISSIONS.MESSAGING,
                                                        PERMISSIONS.VOICE_EXPERT_OPINION]}
                    }
                }
            },

            B: {
                NAME: "Consultation phase",
                DESCRIPTION: "In addition to the experts and stakeholders who " +
                    "appear in person, any group or individual in society can make a written submission " +
                    "to the citizens’ assembly. This evidence will be publicly available online, but also " +
                    "summarised and presented to the assembly members. Members will also have " +
                    "the right to request to hear in person from any of these groups. A wide range of " +
                    "perspectives should be present, including contrary perspectives.",
                PERMISSIONS: {
                    "Initiator": [                      PERMISSIONS.ALTER_PERMISSION,
                                                        PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[          PERMISSIONS.MESSAGING],

                    "Coordinator": [                    PERMISSIONS.ADVANCE_CA_STAGE,
                                                        PERMISSIONS.MESSAGING],

                    "Assembly Member": [                PERMISSIONS.MESSAGING,
                                                        PERMISSIONS.INVITE_MEMBER_OF_PUBLIC],

                    "Invited Member of the Public": [   PERMISSIONS.MESSAGING],

                    "Member of the Public": [           PERMISSIONS.MAKE_WRITTEN_SUBMISSION],

                    "Expert/Stakeholder": [             PERMISSIONS.MESSAGING]}

            },

            C: {
                NAME: "Deliberation phase",
                DESCRIPTION: "Assembly members discuss the evidence and " +
                    "opinions they have heard. This is an opportunity for members to reflect on and " +
                    "discuss the issues. The facilitator’s job is to ensure that assembly members actively " +
                    "listen to each other and critically assess the different options. This phase takes place " +
                    "through a combination of plenary sessions and facilitated small groups to maximize " +
                    "opportunities to speak and to be heard.",
                PERMISSIONS: {
                    "Initiator": [                  PERMISSIONS.ALTER_PERMISSION,
                                                    PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[      PERMISSIONS.MESSAGING],

                    "Coordinator": [                PERMISSIONS.ADVANCE_CA_STAGE,
                                                    PERMISSIONS.MESSAGING],

                    "Assembly Member": [            PERMISSIONS.MESSAGING],

                    "Facilitator": [                PERMISSIONS.MESSAGING]}
            },

            D: {
                NAME: "Decisions",
                DESCRIPTION: "Assembly members are taken through a step-by-step process " +
                    "in order to draft a report on their recommendations. They may wish to undertake " +
                    "deliberations in private, without facilitators present, similar to a legal jury deciding " +
                    "its verdict. Their report will include key recommendations and the degree of " +
                    "support for each, along with more nuanced descriptions of the points raised during " +
                    "the assembly.\n" +
                    "The coordinating group considers how much time will be needed for assembly " +
                    "members to reflect, deliberate and achieve thorough decisions.\n" +
                    "For the purposes of this mock citizen's assembly this phase will take effect in the form of a vote," +
                    "whereby each member will be able to cast a vote on the policy options.",
                PERMISSIONS: {
                    "Initiator": [              PERMISSIONS.ALTER_PERMISSION,
                                                PERMISSIONS.MESSAGING],

                    "Oversight Panel Member":[  PERMISSIONS.MESSAGING],

                    "Coordinator": [            PERMISSIONS.ADVANCE_CA_STAGE,
                                                PERMISSIONS.MESSAGING,
                                                PERMISSIONS.VOTING_CONTROL],

                    "Assembly Member": [        PERMISSIONS.MESSAGING,
                                                PERMISSIONS.VOTING]}
            }
        }
    }

})


const DEFAULT_CA_ROLE = Object.freeze(CA_ROLES.MEMBER_OF_THE_PUBLIC);



class CitizensAssembly extends BasePlugIn{

    #databaseID = 'CitizensAssembly';
    #collection_users;
    #database;

    //CA stage management
    #currentStage
    #currentPhase
    #currentSubPhase



    constructor(parentObject){
        super(parentObject);

        this.briefingMaterials = {};
        this.expertOpinionsAndEvidence = [];
        this.publicSubmissions = [];

        //TODO: Move to permanent storage and read startup values from there
        this.#currentStage = "0";
        this.#currentPhase = "A";
        this.#currentSubPhase = "A";


        this.subscribeToEvent('message', (eventProxyResponder) => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.MESSAGING)
                .then(result => {
                    if(result === true){
                        this.findUserID(eventProxyResponder.socketID).then(userID => {

                            this.executeHook("getUserRole", userID).then(r =>{
                                if (r.result === null){
                                    this.eventProxy.publishAndEmit("outgoing message", {
                                        message: eventProxyResponder.eventMessage,
                                        userID: userID,
                                        roles: []});
                                    return
                                }
                                this.eventProxy.publishAndEmit("outgoing message", {
                                    message: eventProxyResponder.eventMessage,
                                    userID: userID,
                                    roles: r.result});

                                this.eventProxy.publish('logInfo',
                                    {
                                        msg: "Client message",
                                        data: {
                                            message: eventProxyResponder.eventMessage,
                                            userID: userID,
                                            roles: r.result,
                                            caStage: {
                                                stage: this.#currentStage,
                                                phase: this.#currentPhase,
                                                subPhase: this.#currentSubPhase
                                            }
                                        }
                                    })
                            })
                        })

                    }
                });
        })


        this.subscribeToEvent('User Login', (eventProxyResponder) => {
            const name = eventProxyResponder.eventMessage[0];
            const socketID = eventProxyResponder.socketID;

            this.eventProxy.emit('debug message', name + " joined with id: " + socketID );
            this.#associateUserSocketID(name, socketID, (err, res) => {
                if (err) throw err;
                console.log("CitizensAssembly", res.result.nModified, " user(s) modified");
                console.log("CitizensAssembly: ", res.result.n - res.result.nModified, " user field(s) created")

                //TODO: Remove this debugging log
                this.#collection_users.find().toArray().then((result) => {
                    console.log("Users present: ", result);
                });
            })

            //Register User in case they are not registered
            this.executeHook("registerUser", name)
                .then(result => {
                    if(result.result === 0){
                        this.executeHook("registerUserRole",  name, DEFAULT_CA_ROLE.NAME)
                    }
                }
            )

            this.eventProxy.publish('logInfo',
                {
                    msg: "User Login",
                    data: {
                        message: eventProxyResponder.eventMessage,
                        userID: name,
                    }
                })

        });


        //Triggered when a user disconnects
        this.subscribeToEvent('disconnect', (eventProxyResponder) => {
            console.log(
                "CitizensAssembly: ",
                "user disconnected so attempting to remove the user-socket association: ",
                eventProxyResponder.socketID);

            this.#disassociateUserSocketID(eventProxyResponder.socketID, (err, res) => {
                if (err) throw err;
                console.log("CitizensAssembly:",
                    "updated the socketID for ", res.matchedCount, " user(s)");

                //TODO: Remove this debugging log
                this.#collection_users.find().toArray().then((result) => {
                    console.log("Users present: ", result);
                });

            });
        })

        //TODO: rewrite checkPermission to be fully functional

        this.subscribeToEvent('Advance CA Stage', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.ADVANCE_CA_STAGE)
                .then(result => {
                    if(result === true){
                        this.advanceStage();

                    }
                });
        })

        //TODO: subscribe to connection and send out CA current status

        this.subscribeToEvent('Appoint Oversight Panel Member', eventProxyResponder=>{
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a userID for assignee."
                );
                return
            }
            this.checkPermission(eventProxyResponder, PERMISSIONS.APPOINT_OVERSIGHT_PANEL_MEMBER)
                .then(result => {
                    if(result === true){
                        this.appointOversightPanelMember(eventProxyResponder.eventMessage[0])
                            .then(result => {
                                this.eventProxy.emit(
                                    'chat message',
                                    eventProxyResponder.eventMessage[0] +
                                    " has been to the role of Oversight panel member"
                                );
                            });
                    }
                });
        })


        this.subscribeToEvent('Set Task', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a Citizen's Assembly Title and Description."
                );
                return
            }

            if(eventProxyResponder.eventMessage[1] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a Citizen's Assembly Description."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.SET_TASK)
                .then(result => {
                    if(result === true) {
                        this.setTask(eventProxyResponder.eventMessage[0], eventProxyResponder.eventMessage[1]);
                        eventProxyResponder.respondToSender(
                            'debug message',
                            "Task set successfully"
                        );
                    }
                })
        })


        this.subscribeToEvent('Appoint Coordinator', eventProxyResponder=>{
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a userID for assignee."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.APPOINT_COORDINATING_GROUP_MEMBER)
                .then(result => {
                    if(result === true){
                        this.appointCoordinator(eventProxyResponder.eventMessage[0])
                            .then(result => {
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Coordinator " +
                                    eventProxyResponder.eventMessage[0] +
                                    " appointed successfully"
                                );
                            });
                    }
                });
        })

        this.subscribeToEvent('Appoint Advisor', eventProxyResponder=>{
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a userID for assignee."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.APPOINT_ADVISORY_BOARD_MEMBER)
                .then(result => {
                    if(result === true){
                        this.appointAdvisor(eventProxyResponder.eventMessage[0])
                            .then(result => {
                                this.eventProxy.emit(
                                    'chat message',
                                    eventProxyResponder.eventMessage[0] +
                                    " has been to the role of Advisory board member"
                                );
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Advisor " +
                                    eventProxyResponder.eventMessage[0] +
                                    " appointed successfully"
                                );
                            });
                    }
                });
        })

        this.subscribeToEvent('Set Policy Framework', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a Policy Framework."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.SET_POLICY_FRAMEWORK)
                .then(result => {
                    if(result === true) {
                        this.setPolicyFramework(eventProxyResponder.eventMessage[0]);
                        eventProxyResponder.respondToSender(
                            'debug message',
                            "Policy Framework set successfully"
                        );
                        this.eventProxy.emit(
                            'chat message',
                            eventProxyResponder.eventMessage[0] +
                            " has been to the role of Advisory board member"
                        );
                    }
                })
        })

        this.subscribeToEvent('Provide Expert Selection Criteria', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Please provide a the Expert Selection Criteria."
                );
                return
            }
            this.checkPermission(eventProxyResponder, PERMISSIONS.SET_EXPERT_SELECTION_CRITERIA)
                .then(result => {
                    if(result === true) {
                        this.presentExpertSelectionCriteria(eventProxyResponder.eventMessage[0]);
                    }
                })
        })

        this.subscribeToEvent('Appoint Expert', eventProxyResponder=>{
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a userID for assignee."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.ASSIGN_EXPERT_ROLE)
                .then(result => {
                    if(result === true){
                        this.assignExpertOrStakeHolder(eventProxyResponder.eventMessage[0])
                            .then(result => {
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Expert/Stake-holder/Rights-holder " +
                                    eventProxyResponder.eventMessage[0] +
                                    " appointed successfully"
                                );

                                this.eventProxy.emit(
                                    'chat message',
                                    eventProxyResponder.eventMessage[0] +
                                    " has been to the role of Expert/Stakeholder/Rights-holder"
                                );
                            });
                    }
                });
        })

        //TODO: Make the following 4 one function

        this.subscribeToEvent('Prepare Learning Phase Materials', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Learning Phase Materials."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.DESIGN_ASSEMBLY_PROCESS)
                .then(result => {
                    if(result === true) {
                        this.prepareLearningPhaseMaterials(eventProxyResponder.eventMessage[0]);
                    }
                })
        })

        this.subscribeToEvent('Prepare Consultation Phase Materials', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Consultation Phase Materials."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.DESIGN_ASSEMBLY_PROCESS)
                .then(result => {
                    if(result === true) {
                        this.prepareConsultationPhaseMaterials(eventProxyResponder.eventMessage[0]);
                    }
                })
        })

        this.subscribeToEvent('Prepare Deliberation Phase Materials', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Deliberation Phase Materials."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.DESIGN_ASSEMBLY_PROCESS)
                .then(result => {
                    if(result === true) {
                        this.prepareDeliberationPhaseMaterials(eventProxyResponder.eventMessage[0]);
                    }
                })
        })

        this.subscribeToEvent('Prepare Decision Phase Materials', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Decision Phase Materials."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.DESIGN_ASSEMBLY_PROCESS)
                .then(result => {
                    if(result === true) {
                        this.prepareDecisionPhaseMaterials(eventProxyResponder.eventMessage[0]);
                    }
                })
        })



        this.subscribeToEvent('Appoint Facilitator', eventProxyResponder=>{
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide a userID for assignee."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.APPOINT_FACILITATOR)
                .then(result => {
                    if(result === true){
                        this.appointFacilitator(eventProxyResponder.eventMessage[0])
                            .then(result => {
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Facilitator " +
                                    eventProxyResponder.eventMessage[0] +
                                    " appointed successfully"
                                );
                                this.eventProxy.emit(
                                    'chat message',
                                    eventProxyResponder.eventMessage[0] +
                                    " has been to the role of Facilitator"
                                );
                            });
                    }
                });
        })


        this.subscribeToEvent('Submit Background Briefing Materials', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Background Briefing Materials."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.SET_BRIEFING_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.submitBriefingMaterials(eventProxyResponder.eventMessage[0]);
                    }
                })
        })


        this.subscribeToEvent('Sortition Members', eventProxyResponder => {

            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Number of Users to participate as Assembly Members."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.ASSEMBLY_MEMBER_SORTITION)
                .then(result => {
                    if(result === true) {
                        this.selectRandomMembers(parseInt(eventProxyResponder.eventMessage[0], 10), CA_ROLES.ASSEMBLY_MEMBER)
                            .then(r => {
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Assembly members selected successfully: " + JSON.stringify(r)
                                );
                            });
                    }
                })
        })


        this.subscribeToEvent('Publish Task', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.PUBLISH_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.publishTask();
                    }
                })
        })


        this.subscribeToEvent('Publish Learning Phase Materials', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.PUBLISH_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.publishLearningPhaseMaterials();
                    }
                })
        })

        this.subscribeToEvent('Publish Consultation Phase Materials', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.PUBLISH_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.publishConsultationPhaseMaterials();
                    }
                })
        })

        this.subscribeToEvent('Publish Deliberation Phase Materials', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.PUBLISH_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.publishDeliberationPhaseMaterials();
                    }
                })
        })

        this.subscribeToEvent('Publish Decision Phase Materials', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.PUBLISH_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.publishDecisionPhaseMaterials();
                    }
                })
        })

        this.subscribeToEvent('Publish Background Briefing Materials', eventProxyResponder => {
            this.checkPermission(eventProxyResponder, PERMISSIONS.PUBLISH_MATERIALS)
                .then(result => {
                    if(result === true) {
                        this.publishBackgroundMaterials();
                    }
                })
        })



        this.subscribeToEvent('Present Expert Opinions And Evidence', eventProxyResponder => {

            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the BExpert Opinions And Evidence."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.VOICE_EXPERT_OPINION)
                .then(result => {
                    if(result === true) {
                        this.findUserID(eventProxyResponder.socketID).then( userID=>{
                            if(userID === null){
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Unsuccessful - Something went wrong."
                                );
                            }
                            else{
                                this.presentExpertOpinionsAndEvidence(userID,
                                    eventProxyResponder.eventMessage[0]);
                            }
                        })

                    }
                })
        })

        this.subscribeToEvent('Make Written Submission', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Written Submission."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.MAKE_WRITTEN_SUBMISSION)
                .then(result => {
                    if(result === true) {
                        this.findUserID(eventProxyResponder.socketID).then( userID=>{
                            if(userID === null){
                                eventProxyResponder.respondToSender(
                                    'debug message',
                                    "Unsuccessful - Something went wrong."
                                );
                            }
                            else{
                                this.makeWrittenSubmission(userID,
                                    eventProxyResponder.eventMessage[0]);
                            }
                        })
                    }
                })
        })

        this.subscribeToEvent('Create Vote', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined ||
                eventProxyResponder.eventMessage[1] === undefined ||
                eventProxyResponder.eventMessage[2] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Not enough arguments provided. You should provide Vote Name, Vote Description, and at least one Voting Option"
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.VOTING_CONTROL)
                .then(result => {
                    if(result === true) {
                        let inputArray = eventProxyResponder.eventMessage;
                        let voteName = inputArray.shift();
                        let voteDescription = inputArray.shift();

                        this.createVote(
                            voteName,
                            voteDescription,
                            inputArray,
                            (voteName, EPR) => {
                                return this.checkPermission(EPR, PERMISSIONS.VOTING)
                            });
                    }
                })
        })

        this.subscribeToEvent('Start Vote', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Vote Name."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.VOTING_CONTROL)
                .then(result => {
                    if(result === true) {
                        this.startVote(eventProxyResponder.eventMessage[0]);
                    }
                })
        })

        this.subscribeToEvent('Close Vote', eventProxyResponder => {
            if(eventProxyResponder.eventMessage[0] === undefined){
                eventProxyResponder.respondToSender(
                    'debug message',
                    "Unsuccessful - Please provide the Vote Name."
                );
                return
            }

            this.checkPermission(eventProxyResponder, PERMISSIONS.VOTING_CONTROL)
                .then(result => {
                    if(result === true) {
                        this.closeVote(eventProxyResponder.eventMessage[0]);
                    }
                })
        })



    }

    setup(){
        return new Promise((resolve, reject) => {
            let databaseResult = this.databaseProxy.databaseClient(this.#databaseID);
            if(databaseResult.databaseFound){
                //Setup collections(if not already present)
                this.#database = this.databaseProxy.databaseClient(this.#databaseID).client;
                this.#collection_users = this.#database.collection('users');
                this.#collection_users.createIndex( { "username": 1 }, { unique: true } );
                this.#collection_users.createIndex( { "socketID": 1 }, { sparse: true, unique: true } );

                const setupPromises = [];

                //remove all socket information
                setupPromises.push(this.#collection_users.updateMany({}, {$unset:{socketID: ""}}));

                Promise.all(setupPromises).then(result => {
                    console.log("---Setting up CitizensAssembly - Finished setup");
                    resolve(result);
                }, error => {
                    console.log("---Setting up CitizensAssembly - Error in setup");
                    reject(error);
                })

            }


            resolve();
        })
    }

    start(){
        return new Promise((resolve, reject) => {

            let returnPromises = []

            Object.keys(CA_ROLES).forEach(key=>{
                returnPromises.push(this.executeHook('registerRole', CA_ROLES[key].NAME));
            })

            Promise.all(returnPromises).then(r => {
                this.advanceStage().then(r => {
                    resolve();
                })
            }, reason => {
                reject(reason)
            })
        })
    }

    //---------------------Non-stage-specific helper functions------------------------

    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }


    setStageRoles(){
        return new Promise((resolve, reject) => {
            this.executeHook('removeAllPermissions')
                .then(result => {
                    let currentPermissions;

                    // console.log("Current stage: " + this.#currentStage)
                    // console.log(CA_STAGES[this.#currentStage])

                    if("PHASES" in CA_STAGES[this.#currentStage]){
                        if("PHASES" in CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]){
                            currentPermissions =
                                CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]["PHASES"][this.#currentSubPhase].PERMISSIONS;
                        }else{
                            currentPermissions =
                                CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].PERMISSIONS;
                        }
                    }else{
                        currentPermissions =
                            CA_STAGES[this.#currentStage].PERMISSIONS;
                    }

                    const hookPromises = []

                    Object.keys(currentPermissions).forEach(role => {
                        currentPermissions[role].forEach(permission => {
                            hookPromises.push(this.executeHook("registerRolePermission", role, permission));
                        })
                    })

                    Promise.all(hookPromises).then(result => {
                        resolve();
                    }, error => {
                        reject(error);
                    })
                })
        })
    }

    advanceStage(){
        console.log("CitizensAssembly: Advancing to the next stage")
        return new Promise((resolve, reject) => {
            const canAdvanceSubPhase = () => {
                if("PHASES" in CA_STAGES[this.#currentStage]) {
                    if ("PHASES" in CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]) {
                        let currentSP = this.#currentSubPhase;
                        let nextSP = this.nextChar(currentSP);
                        if (nextSP in CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].PHASES) {
                            return true
                        }
                    }
                }
                return false
            }

            const canAdvancePhase = ()=>{
                if("PHASES" in CA_STAGES[this.#currentStage]) {
                    let currentP = this.#currentPhase;
                    let nextP = this.nextChar(currentP);
                    if (nextP in CA_STAGES[this.#currentStage].PHASES) {
                        return true
                    }
                }
                return false
            }

            const canAdvanceStage = ()=>{
                if(this.#currentStage === "10"){return false};
                return true;
            }

            let stageAdvanced = false;
            if(!canAdvanceSubPhase()){
                this.#currentSubPhase = 'A';
                if(!canAdvancePhase()){
                    this.#currentPhase = 'A';
                    if(canAdvanceStage()){
                        //TODO: replace with string->number->number+1->string
                        if(this.#currentStage === "9"){
                            this.#currentStage = "10";
                        }else{
                            this.#currentStage = this.nextChar(this.#currentStage);
                        }
                        stageAdvanced = true;
                    }
                    else{
                        this.eventProxy.emit('chat message', "The Citizen's Assembly has concluded");
                    }
                }else{
                    this.#currentPhase = this.nextChar(this.#currentPhase);
                    stageAdvanced = true;
                }
            } else{
                this.#currentSubPhase = this.nextChar(this.#currentSubPhase);
                stageAdvanced = true;
            }

            if(stageAdvanced){
                this.setStageRoles().then(r => {
                    //TODO: rewrite to remove code repetition
                    this.eventProxy.emit('chat message', "")
                    this.eventProxy.emit('chat message', "")
                    this.eventProxy.emit('chat message', "")
                    this.eventProxy.emit('chat message', "")
                    this.eventProxy.emit('chat message', "The citizen's assembly is advancing to the next step!")
                    if("PHASES" in CA_STAGES[this.#currentStage]){
                        if("PHASES" in CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]){

                            this.eventProxy.emit(
                                'chat message',
                                "Stage: " +
                                CA_STAGES[this.#currentStage].NAME)
                            if(CA_STAGES[this.#currentStage].DESCRIPTION !== ""){
                                this.eventProxy.emit(
                                    'chat message',
                                    "Stage description: " +
                                    CA_STAGES[this.#currentStage].DESCRIPTION)
                            }

                            this.eventProxy.emit(
                                'chat message',
                                "Phase: " +
                                CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].NAME)
                            if(CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].DESCRIPTION !== ""){
                                this.eventProxy.emit(
                                    'chat message',
                                    "Phase description: " +
                                    CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].DESCRIPTION)
                            }

                            this.eventProxy.emit(
                                'chat message',
                                "Sub-Phase: " +
                                CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]["PHASES"][this.#currentSubPhase].NAME)
                            if(CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]["PHASES"][this.#currentSubPhase].DESCRIPTION !== ""){
                                this.eventProxy.emit(
                                    'chat message',
                                    "Sub-Phase description: " +
                                    CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase]["PHASES"][this.#currentSubPhase].DESCRIPTION)
                            }


                        }else{
                            this.eventProxy.emit(
                                'chat message',
                                "Stage: " +
                                CA_STAGES[this.#currentStage].NAME)
                            if(CA_STAGES[this.#currentStage].DESCRIPTION !== ""){
                                this.eventProxy.emit(
                                    'chat message',
                                    "Stage description: " +
                                    CA_STAGES[this.#currentStage].DESCRIPTION)
                            }

                            this.eventProxy.emit(
                                'chat message',
                                "Phase: " +
                                CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].NAME)
                            if(CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].DESCRIPTION !== ""){
                                this.eventProxy.emit(
                                    'chat message',
                                    "Phase description: " +
                                    CA_STAGES[this.#currentStage]["PHASES"][this.#currentPhase].DESCRIPTION)
                            }
                        }
                    }else{
                        this.eventProxy.emit(
                            'chat message',
                            "Stage: " +
                            CA_STAGES[this.#currentStage].NAME)
                        if(CA_STAGES[this.#currentStage].DESCRIPTION !== ""){
                            this.eventProxy.emit(
                                'chat message',
                                "Stage description: " +
                                CA_STAGES[this.#currentStage].DESCRIPTION)
                        }
                    }
                    resolve();
                })
            }
        })


    }

    //------------------------------------------------------------------
    //----------------Associate Users with a socketID --------------------
    #associateUserSocketID(userName, socketID, callback){
        this.#disassociateUserSocketID(socketID, (err, res) =>{
            return this.#collection_users.updateOne(
                {username: userName},
                {$set:{socketID: socketID}},
                {"upsert": true},
                callback
            )
        })
    }

    #disassociateUserSocketID(socketID, callback){
        return this.#collection_users.updateMany(
            {socketID: socketID},
            {$unset:{socketID: ""}},
            {},
            callback
        )
    }

    //Checks SocketID in database and returns the Username, if one was found
    findUserID(socketID) {
        return new Promise((resolve, reject) => {
            this.#collection_users.findOne(
                {socketID: socketID}
            ).then(result =>{
                    if(result) {
                        resolve(result.username);
                    } else {
                        resolve(null);
                    }
                }
            )
        })
    }

    //------------------------------------------------------------------
    //-----------Add and remove Users from the user list --------------
    #addUser(userName){
        return this.#collection_users.updateOne(
            {username: userName},
            {$set:{username: userName}},
            {"upsert": true},
        )
    }

    #deleteUser(userName, callback){
        return this.#collection_users.deleteMany(
            {username: userName},
            {},
            callback);
    }

    //TODO:Rewrite all the appoint functions as one

    //Checks if the socket associated with the eventProxyResponder has the specified permission
    checkPermission(eventProxyResponder, permissionName){
        return new Promise((resolve, reject) => {

            this.findUserID(eventProxyResponder.socketID)
                .then(result => {
                    if(result === null){
                        eventProxyResponder.respondToSender(
                            'debug message',
                            "You have not registered and hence do not have the permission to perform that action");
                        resolve(false)
                    }else{
                        this.executeHook("checkUserPermission", result, permissionName)
                            .then(hookResult => {
                                if(hookResult.executed){
                                    console.log(
                                        "CitizensAssembly: Successfully checked permission of",
                                        result, "to", permissionName, "  -  ", hookResult.result);

                                        if(!hookResult.result){
                                            eventProxyResponder.respondToSender(
                                                'debug message',
                                                "You do not have permission to perform this action.");
                                        }
                                    resolve(hookResult.result)
                                }else{
                                    eventProxyResponder.respondToSender(
                                        'debug message',
                                        "The roles you occupy are not permitted to perform this action.");
                                    resolve(false)
                                }
                            })
                    }
                })
        })
    }

    //---------------------Stage-specific helper functions----------------------------

    //-------------------------1--------------------------
    appointOversightPanelMember(memberName){
        return new Promise((resolve, reject) => {
            this.#addUser(memberName)
                .then(() => {
                    this.executeHook("registerUser", memberName)
                        .then(() => {
                            this.executeHook("registerUserRole",  memberName, CA_ROLES.OVERSIGHT_PANEL_MEMBER.NAME)
                                .then(result => {
                                    resolve(result.result)
                                }, reason => reject(reason))
                        }, reason => reject(reason))
                }, reason => reject(reason))
        })
    }

    //--------------------------2--------------------------
    setTask(title, description){
        this.title = title;
        this.description = description;
    }

    //--------------------------3--------------------------
    appointCoordinator(memberName){
        return new Promise((resolve, reject) => {
            this.#addUser(memberName)
                .then(() => {
                    this.executeHook("registerUser", memberName)
                        .then(() => {
                            this.executeHook("registerUserRole",  memberName, CA_ROLES.COORDINATOR.NAME)
                                .then(result => {
                                    resolve(result.result)
                                }, reason => reject(reason))
                        }, reason => reject(reason))
                }, reason => reject(reason))
        })
    }

    appointAdvisor(memberName){
        return new Promise((resolve, reject) => {
            this.#addUser(memberName)
                .then(() => {
                    this.executeHook("registerUser", memberName)
                        .then(() => {
                            this.executeHook("registerUserRole",  memberName, CA_ROLES.ADVISORY_BOARD_MEMBER.NAME)
                                .then(result => {
                                    resolve(result.result)
                                }, reason => reject(reason))
                        }, reason => reject(reason))
                }, reason => reject(reason))
        })
    }

    //--------------------------4--------------------------
    setPolicyFramework(framework){
        this.policyFramework = framework;
    }

    //--------------------------5A--------------------------
    presentExpertSelectionCriteria(criteria){
        this.expertSelectionCriteria = criteria;
        this.eventProxy.emit(
            'chat message',
            "The Advisory Board presents the following criteria for expert selection:")
        this.eventProxy.emit(
            'chat message',
            criteria)
    }

    //--------------------------5B--------------------------
    assignExpertOrStakeHolder(memberName){
        return new Promise((resolve, reject) => {
            this.#addUser(memberName)
                .then(() => {
                    this.executeHook("registerUser", memberName)
                        .then(() => {
                            this.executeHook("registerUserRole",  memberName, CA_ROLES.EXPERT_OR_STAKEHOLDER.NAME)
                                .then(result => {
                                    resolve(result.result)
                                }, reason => reject(reason))
                        }, reason => reject(reason))
                }, reason => reject(reason))
        })
    }

    //--------------------------6--------------------------
    prepareLearningPhaseMaterials(materials){
        this.learningPhaseMaterials = materials;
        this.eventProxy.emit(
            'chat message',
            "The coordinating group has set the following as the learning phase materials:")
        this.eventProxy.emit(
            'chat message',
            materials)

    }

    prepareConsultationPhaseMaterials(materials) {
        this.consultationPhaseMaterials = materials;
        this.eventProxy.emit(
            'chat message',
            "The coordinating group has set the following as the consultation phase materials: ")
        this.eventProxy.emit(
            'chat message',
            materials)
    }

    prepareDeliberationPhaseMaterials(materials){
        this.deliberationPhaseMaterials = materials;
        this.eventProxy.emit(
            'chat message',
            "The coordinating group has set the following as the deliberation phase materials:")
        this.eventProxy.emit(
            'chat message',
            materials)
    }

    prepareDecisionPhaseMaterials(materials){
        this.decisionPhaseMaterials = materials;
        this.eventProxy.emit(
            'chat message',
            "The coordinating group has set the following as the decision phase materials:")
        this.eventProxy.emit(
            'chat message',
            materials)
    }


    //--------------------------7--------------------------
    appointFacilitator(memberName){
        return new Promise((resolve, reject) => {
            this.#addUser(memberName)
                .then(() => {
                    this.executeHook("registerUser", memberName)
                        .then(() => {
                            this.executeHook("registerUserRole",  memberName, CA_ROLES.FACILITATOR.NAME)
                                .then(result => {
                                    resolve(result.result)
                                }, reason => reject(reason))
                        }, reason => reject(reason))
                }, reason => reject(reason))
        })
    }
    //--------------------------8--------------------------

    submitBriefingMaterials(materials){
        this.briefingMaterials = materials;

        this.eventProxy.emit(
            'chat message',
            "The expert panel has set the following as the learning phase background materials:")
        this.eventProxy.emit(
            'chat message',
            materials)

    }
    //--------------------------9--------------------------

    selectRandomMembers(numberOfParticipants, assignedRole = DEFAULT_CA_ROLE){
        return new Promise((resolve, reject) => {
            this.executeHook("sampleDocumentProperty",
                this.#collection_users,
                numberOfParticipants,
                "username")
                .then(result => {
                    console.log(result);
                    if (result.executed) {
                        let UserIDs = result.result;

                        UserIDs.forEach(userID => {
                            this.executeHook("registerUser", userID)
                                .then(() => {
                                    this.executeHook("registerUserRole", userID, assignedRole.NAME)
                                        .then(result => {
                                            resolve(UserIDs)
                                        }, reason => reject(reason))
                                }, reason => reject(reason))
                        })
                    }
                })
        })
    }


    //--------------------------10--------------------------

    publishTask(){
        this.eventProxy.emit('chat message', "Welcome!");
        this.eventProxy.emit(
            'chat message',
            "The title of the citizen's assembly held today is: \n" + this.title)
        this.eventProxy.emit('chat message',
            "Description: \n" + this.description);

        this.eventProxy.emit('chat message',
            "The Policy Framework of this Citizen's Assembly is: \n" + this.policyFramework);
    }

    publishLearningPhaseMaterials(){
        this.eventProxy.emit(
            'chat message',
            "The coordinating group presents the following as the Learning phase materials:" +
            this.learningPhaseMaterials + "\n\n" +
            "Please familiarise yourself with the information."
         )

    }

    publishConsultationPhaseMaterials(){
        this.eventProxy.emit(
            'chat message',
            "The coordinating group presents the following as the Consultation phase materials:")
        this.eventProxy.emit('chat message',
            this.consultationPhaseMaterials
        )

    }

    publishDeliberationPhaseMaterials(){
        this.eventProxy.emit(
            'chat message',
            "The coordinating group presents the following as the Deliberation phase materials:"
        )

        this.eventProxy.emit('chat message',
            this.deliberationPhaseMaterials
        )

    }

    publishDecisionPhaseMaterials(){
        this.eventProxy.emit(
            'chat message',
            "The coordinating group presents the following as the Decision phase materials:"
        )
        this.eventProxy.emit('chat message',
            this.decisionPhaseMaterials
        )

    }

    publishBackgroundMaterials(){
        this.eventProxy.emit(
            'chat message',
            "The expert board group has prepared the following background materials:"
        )
        this.eventProxy.emit('chat message',
            this.briefingMaterials
        )
    }


    presentExpertOpinionsAndEvidence(author, materials){
        this.expertOpinionsAndEvidence.push({author: author, materials: materials});

        this.eventProxy.emit(
            'chat message',
            author + " presents the following opinions/evidence: "
        )
        this.eventProxy.emit('chat message',
            materials
        )

    }

    makeWrittenSubmission(author, materials){
        this.publicSubmissions.push({author: author, materials: materials});
    }

    createVote(voteName,
               voteDescription,
               voteOutcomes,
               authenticationCallback){

        this.executeHook(
            "createVote",
            {
                voteName: voteName,
                voteDescription: voteDescription,
                voteOutcomes: voteOutcomes,
                authenticationCallback: authenticationCallback,
                saveVoterSocketID: true,
                intermediaryResultAccess: false})
            .then(result => {
                this.eventProxy.emit(
                    'chat message',
                    "A vote called " + voteName + "has been created.\n" +
                    "Its description is: " + voteDescription + "\n" +
                    "Its voting options are: " + JSON.stringify(voteOutcomes)
                )
            })
    }

    startVote(voteName){
        this.executeHook("startVote", {voteName: voteName})
            .then(result => {
                this.eventProxy.emit(
                    'chat message',
                    "The vote called " + voteName + " has been started. Assembly members can now cast their votes!"
                )
            })
    }

    closeVote(voteName){
        this.executeHook("endVote", {voteName: voteName})
            .then(result => {
                this.eventProxy.emit(
                    'chat message',
                    "The vote called " + voteName + " has been ended. Assembly members can no longer cast votes!"
                )
            })
    }





}

module.exports = CitizensAssembly;